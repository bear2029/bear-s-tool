var NaviList = Backbone.View.extend({
	initialize: function()
	{
		_.bindAll(this,'onToggle');
		$('.toggle',this.$el).on('click',this.onToggle)
	},
	onToggle: function()
	{
		$('body').toggleClass('navi-list-expend');
	}
})
$(document).ready(function(){
	var naviList = new NaviList({el: $('nav .navi-list')[0]})
})
