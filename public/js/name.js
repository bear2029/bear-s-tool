Handlebars.registerHelper('json',function(e){
	if(_.isUndefined(e)){
		return '';
	}
	var str = JSON.stringify(e)
	return str;
})
Handlebars.registerHelper('strip',function(e){
	if(typeof e == 'string'){
		return e.replace(/[`~]/g,'');
	}
	return e
})


var CharModel = Backbone.Model.extend({});
var NameCombo = Backbone.Collection.extend({/*{{{*/
	url: '/queue/nameCache',
	model: CharModel,
	initialize: function()
	{
		_.bindAll(this,'chi','eng')
	},
	chi: function()
	{
		return this.reduce(function(str,item){
			str.push(item.get('chi')); return str;
		},[])
	},
	eng: function()
	{
		return this.reduce(function(str,item){
			str.push(item.get('eng')); return str;
		},[])
	},
	toNameModel: function()
	{
		return new NameModel({chi:this.chi(),eng:this.eng()});
	}
})/*}}}*/
var NameModel = Backbone.Model.extend({
	urlRoot: '/queue/nameCache/',
	exchange: function()
	{
		// todo: only work for 2 chars
		var attrs = ['chi','eng'];
		_.each(attrs,function(_var){
			this[_var] = [];
			_.each(this.get(_var),function(char){
				this[_var].unshift(char)
			}.bind(this))
			this.set(_var,this[_var]);
			delete this[_var];
		}.bind(this))
		console.log(this)
	},
	eng: function()
	{
		return this.get('eng').join('')
	},
	chi: function()
	{
		return this.get('chi').join('')
	}
})
var NameList = Backbone.Collection.extend({
	urlRoot: '/queue/nameCache/',
	url: '/queue/nameCache',
	model: NameModel
})
var CharCollection = Backbone.Collection.extend({
	model: CharModel,
	prioritize: function()
	{
		//console.log(this.at(0).get('index'))
	},
	randomize: function(len)
	{
		var minimunScore = 17; // score per char = 10 - index
		do{
			var score = 0;
			var nameCombo = new NameCombo;
			for(var i=0; i<len; i++){
				var randomIndex = Math.floor(Math.random()*this.length);
				nameCombo.add(this.at(randomIndex));
				score += 10 - this.at(randomIndex).get('index');
			}
		}while(score < minimunScore)
		return nameCombo.toNameModel();
	}
});
var DictionaryModel = Backbone.Model.extend({
	urlRoot: '/dictionaryWrapper'
})


var DictionaryView = Backbone.View.extend({
	template: Handlebars.compile($('#dictionary-template').html()),
	initialize: function()
	{
		_.bindAll(this,'render')
		var dictionary = new DictionaryModel({id: this.attributes.str})
		dictionary.fetch();
		this.listenTo(dictionary, 'change', function(e){
			this.render({d:dictionary.toJSON()})
		})
	},
	render: function(data) {
		if(this.$el){
			this.$el.remove();
		}
		this.$el = $(this.template(data));
		this.attributes.parentEl.append(this.$el);
		$('.toggler',this.$el).on('click',function(){
			this.$el.toggleClass('expand');
		}.bind(this))
		return this;
	}
});
var FavItemView = Backbone.View.extend({
	template: Handlebars.compile($('#fav-item-template').html()),
	remove: function()
	{
		this.collection.remove(this.model)
		this.model.destroy();
		//todo, should be .remove
		this.$el.remove();
	},
	initialize: function()
	{
		_.bindAll(this,'render','remove')
		this.render(this.attributes.parentEl)
		this.attributes.parentEl.append(this.$el);
		this.dictionary = new DictionaryView({attributes: {parentEl: this.$el, str: this.model.chi()}})
		$('.remove',this.$el).on('click',this.remove);
	},
	render: function() {
		var data = {
			name: this.model.chi()
		}
		this.$el = $(this.template(data));
		return this;
	}
});
var NameGenView = Backbone.View.extend({
	initialize: function()
	{
		_.bindAll(this,'randomize','capture','onAddFavItem','rotate','rerender')
		this.favItemViews = [];
		this.randomize();
		this.faviCollection = new NameList([])
		this.faviCollection.fetch();
		this.listenTo(this.faviCollection,'add',this.onAddFavItem)
		$('i',this.$el).on('click',this.randomize);
		$('em',this.$el).on('click',this.capture);
		$('.utils>.rotate',this.$el).on('click',this.rotate);
	},
	onAddFavItem: function(newNameModel)
	{
		var index = this.faviCollection.indexOf(newNameModel);
		this.favItemViews[index] = new FavItemView({
			model: newNameModel,
			collection: this.faviCollection,
			attributes:{parentEl: $('.fav>ul',this.$el)}
		})
	},
	rotate: function()
	{
		this.nameModel.exchange();
		this.rerender();
	},
	capture: function()
	{
		if(!this.faviCollection.contains(this.nameModel)){
			this.faviCollection.add(this.nameModel);
			this.nameModel.save();
		}
		this.$el.addClass('favorite')
	},
	randomize: function()
	{
		this.nameModel = this.collection.randomize(2);
		this.rerender();
	},
	rerender: function()
	{
		if(this.collection.indexOf(this.nameModel) > -1){
			this.$el.addClass('favorite')
		}else{
			this.$el.removeClass('favorite')
		}
		$('h3',this.$el).text(this.nameModel.chi())
		$('h4',this.$el).text(this.nameModel.eng())
		if(this.dictionary){
			this.dictionary.remove();
		}
		this.dictionary = new DictionaryView({attributes: {parentEl: $('.generator .name-card',this.$el), str: this.nameModel.chi()}})
	}
})

var charCollection = new CharCollection([]);
_.each(nameBases,function(eachName){
	charCollection.add(new CharModel(eachName));
},[])
var nameGenView = new NameGenView({collection: charCollection, el:$('#name-gen')});
