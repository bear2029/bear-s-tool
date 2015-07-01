define(['jquery','backbone','underscore'],function($,Backbone,_){
	var myName = function()
	{
		console.log($('body'))
		return 'bear'
	}
	return {
		log: function()
		{
			console.log(myName());
		}
	}
})
