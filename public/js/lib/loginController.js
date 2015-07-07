define(['jquery','backbone','underscore'],function($,Backbone,_){
	var myName = function()
	{
		return 'bear';
	};
	return {
		log: function()
		{
			console.log(myName());
		}
	};
});