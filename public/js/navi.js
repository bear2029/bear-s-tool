var NaviList = Backbone.View.extend({
	initialize: function()
	{
		console.log(12,this.$el);
		_.bindAll(this,'onToggle');
		$('.toggle',this.$el).on('click',this.onToggle)
	},
	onToggle: function()
	{
		console.log(11);
		$('body').toggleClass('navi-list-expend');
	}
})
$(document).ready(function(){
	var naviList = new NaviList({el: $('nav .navi-list')[0]})
})
