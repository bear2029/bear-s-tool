define([
	'jquery',
	'backbone',
	'underscore',
	'handlebars',
	'lib/view/pagination',
	'lib/model/pagination'
],function($,Backbone,_,Handlebars,PaginationView,PaginationModel){
	var AppRouter = Backbone.Router.extend({
		routes:{
			'subscription/:collectionName/:pg': 'changePage'
		}
	})
	return Backbone.View.extend({
		initialize: function()
		{
			this.template = Handlebars.compile($('#collection-list-template').html());
			_.bindAll(this,'render','onPaginationChange','onUrlPageChange');

			Backbone.history.start({pushState: true});
			this.appRouter = new AppRouter()
			
			var paginationModel = new PaginationModel({
				total: parseInt(this.model.get('total')),
				index: parseInt(this.model.get('pg'))
			})
			var paginationView = new PaginationView({
				el:$('#collection-paginator'),
				model: paginationModel
			});

			paginationModel.on('change',this.onPaginationChange)
			this.appRouter.on('route:changePage',this.onUrlPageChange)
			this.model.on('sync',this.render)
		},
		onPaginationChange: function(model)
		{
			var newPath = location.pathname.replace(/(\/[^\/]+\/)\d+.*$/,'$1'+model.get('index'))+'.html'
			this.appRouter.navigate(newPath)
			this.model.set({id:model.get('index')})
			this.model.fetch()
		},
		onUrlPageChange: function(collection,pg){
			var pg = pg || 1;
			this.model.set({id:pg})
			this.model.fetch()
		},
		render: function(d)
		{
			$('#collection-list',this.$el).html(this.template(d.toJSON()))
		}
	})
})
