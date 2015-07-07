var AppRouter = Backbone.Router.extend({
	routes: {
		'name/*nameJson': 'changeName',
		'name': 'changeName'
	}
});
	
var appRouter = new AppRouter();

Handlebars.registerHelper('json',function(e){
	if(_.isUndefined(e)){
		return '';
	}
	var str = JSON.stringify(e);
	return str;
});
Handlebars.registerHelper('strip',function(e){
	if(typeof e == 'string'){
		return e.replace(/[`~]/g,'');
	}
	return e;
});
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var clickMethod = isMobile ? 'touchstart' : 'click';
	


var CharModel = Backbone.Model.extend({});
var NameCombo = Backbone.Collection.extend({/*{{{*/
	url: '/queue/nameCache',
	model: CharModel,
	initialize: function()
	{
		_.bindAll(this,'chi','eng');
	},
	chi: function()
	{
		return this.reduce(function(str,item){
			str.push(item.get('chi')); return str;
		},[]);
	},
	eng: function()
	{
		return this.reduce(function(str,item){
			str.push(item.get('eng')); return str;
		},[]);
	},
	toNameModel: function()
	{
		return new NameModel({chi:this.chi(),eng:this.eng()});
	}
});/*}}}*/
var NameModel = Backbone.Model.extend(
{/*{{{*/
	urlRoot: '/queue/nameCache/',
	equalTo: function(other)
	{
		return false;
	},
	exchange: function()
	{
		// todo: only work for 2 chars
		var attrs = ['chi','eng'];
		_.each(attrs,function(_var){
			this[_var] = [];
			_.each(this.get(_var),function(char){
				this[_var].unshift(char);
			}.bind(this));
			this.set(_var,this[_var]);
			delete this[_var];
		}.bind(this));
		//todo here
	},
	eng: function()
	{
		return this.get('eng').join('');
	},
	chi: function()
	{
		return this.get('chi').join('');
	},
	charModelAtIndex: function(index)
	{
		return new CharModel({
			chi: this.get('chi')[index],
			eng: this.get('eng')[index]
		});
	}
});/*}}}*/
var NameList = Backbone.Collection.extend(
{/*{{{*/
	urlRoot: '/queue/nameCache/',
	url: '/queue/nameCache',
	model: NameModel
});/*}}}*/
var CharCollection = Backbone.Collection.extend(
{/*{{{*/
	model: CharModel,
	randomize: function(len,pronouncePattern)
	{
		var minimunScore = len * 8; // score per char = 10 - index
		var score, nameCombo;
		do{
			score = 0;
			nameCombo = new NameCombo();
			for(var i=0; i<len; i++){
				var sample = pronouncePattern ? new CharCollection(this.where({eng:pronouncePattern[i]})) : this;
				var randomIndex = Math.floor(Math.random()*sample.length);
				nameCombo.add(sample.at(randomIndex));
				score += 10 - sample.at(randomIndex).get('index');
			}
		}while(score < minimunScore);
		return nameCombo;
	}
});/*}}}*/
var DictionaryModel = Backbone.Model.extend({
	urlRoot: '/dictionaryWrapper'
});


var CustomEditView = Backbone.View.extend(
{/*{{{*/
	initialize: function()
	{
		this.template = Handlebars.compile($('#custom-edit-template').html());
		_.bindAll(this,'render','onSubmit');
		this.render();
		this.attributes.parentEl.append(this.$el);
		this.$el.on('reset', function(e)
		{
			$('#name-gen').removeClass('custom-edting');
		});
		this.$el.on('submit',this.onSubmit);
		this.model.on('change',this.render);
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		$('#name-gen').removeClass('custom-edting');
		var nameObj = _.reduce($('input.free',this.$el),function(list,item){
			item = $(item);
			if(item.hasClass('chi')){
				list.chi.push(item.val());
			}else if(item.hasClass('eng')){
				list.eng.push(item.val());
			}
			return list;
		},{chi:[],eng:[]});
		this.model.set(nameObj);
	},
	render: function() {
		this.$el.html($(this.template(this.model.toJSON())));
		return this;
	}
});/*}}}*/
var DictionaryView = Backbone.View.extend(
{/*{{{*/
	initialize: function()
	{
		this.template = Handlebars.compile($('#dictionary-template').html());
		_.bindAll(this,'render');
		var dictionary = new DictionaryModel({id: this.attributes.str});
		dictionary.fetch();
		this.listenTo(dictionary, 'change', function(e){
			this.render({d:dictionary.toJSON()});
		});
	},
	render: function(data) {
		if(this.$el){
			this.$el.remove();
		}
		data.strokes = _.reduce(data.d,function(total,item){
			if(item.c){
				total+=item.c;
			}
			return total;
		},0);
		data.isMatchStrokes = [9,10,15,17,18,21,25,31].indexOf(data.strokes) > -1;
		if(!data.isMatchStrokes){
			this.trigger('notMatch',this);
		}
		this.$el = $(this.template(data));
		this.attributes.parentEl.append(this.$el);
		$('.toggler',this.$el).on(clickMethod,function(){
			this.$el.toggleClass('expand');
		}.bind(this));
		return this;
	}
});/*}}}*/
var FavItemView = Backbone.View.extend(
{/*{{{*/
	remove: function()
	{
		this.collection.remove(this.model);
		this.model.destroy();
		//todo, should be .remove
		this.$el.remove();
	},
	initialize: function()
	{
		this.template = Handlebars.compile($('#fav-item-template').html());
		_.bindAll(this,'render','remove');
		this.render(this.attributes.parentEl);
		this.attributes.parentEl.append(this.$el);
		this.dictionary = new DictionaryView({attributes: {parentEl: this.$el, str: this.model.chi()}});
		$('.remove',this.$el).on(clickMethod,this.remove);
		$('.main',this.$el).on('click',function(){
			this.trigger('select',this.model);
		}.bind(this));
	},
	render: function() {
		var data = {
			name: this.model.chi()
		};
		this.$el = $(this.template(data));
		return this;
	}
});/*}}}*/
var NameGenView = Backbone.View.extend({
	initialize: function()
	{
		this.nameModel = new NameModel({'chi':[],'eng':[]});
		this.customEditor = new CustomEditView({
			attributes:{
				parentEl: $('.generator .name-card',this.$el)
			},
			model: this.nameModel.clone()
		});
		_.bindAll(this,
			'onSelectFav',
			'onPinSelected',
			'onPinPronounce',
			'onCustom',
			'urlChangeName',
			'randomize','capture','onAddFavItem','rotate','rerender');
		this.favItemViews = [];
		this.faviCollection = new NameList([]);
		this.faviCollection.fetch();
		if(location.pathname == '/name'){
			this.randomize();
		}
		this.isSelectingPin = false;
		this.pinIndex = -1;
		this.isFixingPronounce = false;
		this.listenTo(this.faviCollection,'add',this.onAddFavItem);
		this.nameModel.on('change',function(){
			var data = this.nameModel.toJSON();
			data = _.pick(data,'chi','eng');
			appRouter.navigate('name/'+JSON.stringify(data));
			this.rerender();
		}.bind(this));
		this.customEditor.model.on('change',function(e){
			this.nameModel.set(e.toJSON());
		}.bind(this));
		$('i',this.$el).on(clickMethod,this.randomize);
		$('em',this.$el).on(clickMethod,this.capture);
		$('.generator .main',this.$el).on(clickMethod,this.onPinSelected);
		$('.generator .name-card>h4',this.$el).on(clickMethod,this.onPinPronounce);
		$('.utils>.rotate',this.$el).on(clickMethod,this.rotate);
		$('.utils>.custom',this.$el).on(clickMethod,this.onCustom);
		appRouter.on('route:changeName', this.urlChangeName);
	},
	events:{
	},
	onCustom: function() { this.$el.addClass('custom-edting'); },
	onPinPronounce: function(e)
	{
		this.isFixingPronounce = !this.isFixingPronounce;
		this.synPinPronounceClass();
	},
	onPinSelected: function(e)
	{
		var charElement = $(e.target);
		var selectedIndex = this.nameModel.chi().indexOf(charElement.html());
		this.pinIndex = selectedIndex == this.pinIndex ? -1 : selectedIndex;
		this.syncPinClass();
	},
	synPinPronounceClass: function()
	{/*{{{*/
		var pronounceEl = $('.generator .name-card>h4',this.$el);
		if(this.isFixingPronounce){
			pronounceEl.addClass('selected');
		}else{
			pronounceEl.removeClass('selected');
		}
	},/*}}}*/
	syncPinClass: function()
	{/*{{{*/
		_.each($('.generator .main>span',this.$el),function(el,i){
			if(i == this.pinIndex){
				$(el).addClass('selected');
			}else{
				$(el).removeClass('selected');
			}
		}.bind(this));
	},/*}}}*/
	onAddFavItem: function(newNameModel)
	{/*{{{*/
		var index = this.faviCollection.indexOf(newNameModel);
		this.favItemViews[index] = new FavItemView({
			model: newNameModel,
			collection: this.faviCollection,
			attributes:{parentEl: $('.fav>ul',this.$el)}
		});
		this.listenTo(this.favItemViews[index],'select',this.onSelectFav);
	},/*}}}*/
	onSelectFav: function(e)
	{
		this.nameModel.set(e.toJSON());
	},
	rotate: function()
	{
		this.nameModel.exchange();
	},
	capture: function()
	{/*{{{*/
		if(!this.faviCollection.contains(this.nameModel)){
			this.faviCollection.add(this.nameModel);
			this.nameModel.save();
		}
		this.$el.addClass('favorite');
	},/*}}}*/
	randomize: function()
	{/*{{{*/
		var pronouncePattern,charCombo;
		if(this.isFixingPronounce){
			pronouncePattern = this.nameModel.get('eng');
		}
		if(this.pinIndex>-1){
			// logically, if pinIndex is set, then this.nameModel should be set too
			// todo: assume total leng is 2
			charCombo = this.collection.randomize(1,pronouncePattern);
			var method = this.pinIndex === 0 ? 'unshift' : 'add';
			charCombo[method](this.nameModel.charModelAtIndex(this.pinIndex));
			this.nameModel.set(charCombo.toNameModel().toJSON());
		}else{
			charCombo = this.collection.randomize(2,pronouncePattern);
			this.nameModel.set(charCombo.toNameModel().toJSON());
		}
	},/*}}}*/
	urlChangeName: function(nameJson) {
		this.nameModel.set(JSON.parse(nameJson));
		this.rerender();
	},
	render: function(){
		this.rerender();
	},
	rerender: function()
	{
		var isFav = this.faviCollection.contains(this.nameModel);
		if(isFav){
			this.$el.addClass('favorite');
		}else{
			this.$el.removeClass('favorite');
		}
		$('h3',this.$el).text('');
		_.each(this.nameModel.chi(),function(char){
			$('h3',this.$el).append('<span>'+char+'</span>');
		});
		$('h4',this.$el).text(this.nameModel.eng());
		if(this.dictionary){
			this.dictionary.remove();
		}
		this.dictionary = new DictionaryView({attributes: {parentEl: $('.generator .name-card',this.$el), str: this.nameModel.chi()}});
		this.syncPinClass();
		this.synPinPronounceClass();
		this.customEditor.model.set(this.nameModel.toJSON());
	}
});

var charCollection = new CharCollection([]);
_.each(nameBases,function(eachName){
	charCollection.add(new CharModel(eachName));
},[]);
var nameGenView = new NameGenView({collection: charCollection, el:$('#name-gen')});
Backbone.history.start({pushState: true});
