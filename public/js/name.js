var NameModel = Backbone.Model.extend({
	// todo: add validation
	initialize: function()
	{
		//console.log('model init',this,arguments);
	}
});
var NameCollection = Backbone.Collection.extend({
	model: NameModel,
	prioritize: function()
	{
		console.log(this.at(0).get('index'))
	},
	randomize: function(len)
	{
		var minimunScore = 17; // score per char = 10 - index
		do{
			var score = 0;
			var name = {chi:'',eng:''};
			for(var i=0; i<len; i++){
				var randomIndex = Math.floor(Math.random()*this.length);
				name.chi += this.at(randomIndex).get('chi');
				name.eng += this.at(randomIndex).get('eng');
				score += 10 - this.at(randomIndex).get('index');
			}
			console.log('try',score)
		}while(score < minimunScore)
		return name;
	}
})
var NameGenView = Backbone.View.extend({
	initialize: function()
	{
		_.bindAll(this,'randomize')
		this.randomize();
		$('i',this.$el).on('click',this.randomize);
	},
	randomize: function()
	{
		var nameCombo = this.model.randomize(2);
		$('b',this.$el).text(nameCombo.chi)
		$('span',this.$el).text(nameCombo.eng)
	}
})

var collection = new NameCollection;
_.each(nameBases,function(eachName){
	collection.add(new NameModel(eachName));
},[])
collection.prioritize();
var nameGenView = new NameGenView({model: collection, el:$('#name-gen')});
