var HomeModuleView = Backbone.View.extend({
	template: Handlebars.compile($('#entry-template').html()),
	initialize: function()
	{
		var data = {t:'123','b':456}
		var result = this.template(data);
		this.attributes.parentEl.append(result)
	}
})
var HomeView = Backbone.View.extend({
	initialize: function()
	{
		this.$el.html('1111')
		this.crawlerSummary = new HomeModuleView({attributes:{parentEl: this.$el}});
	}
})
var home = new HomeView({el:$('#home')});
