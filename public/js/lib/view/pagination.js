define([
	'jquery',
	'backbone',
	'underscore',
	'handlebars'
],function($,backbone,_,Handlebars){
	return Backbone.View.extend({
		tagName: 'div',
		template: Handlebars.compile($('#pagination-template').html()),
		initialize: function()
		{
			_.bindAll(this,'render');
			this.listenTo(this.model,'change',this.render)
			this.render();
		},
		events:{
			'click a': function(e){
				e.preventDefault();
				var el = $(e.target)
				var matches = (el.attr('href')||'').match(/(\d+).html$/)
				if(matches){
					this.model.set({
						index: parseInt(matches[1])
					})
				}
			}
		},
		render: function()
		{
			this.$el.html($(this.template(this.model.objectForRender())));
		}
	})
})
