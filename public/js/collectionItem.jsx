define([
	'react',
	'underscore',
	'backbone',
	'jquery',
	'bear',
	'stores/articleStore',
	'stores/playerStore',
	'jsx!components/article',
],function(React,_,backbone,$,bear,articleStore,playerStore,Article)
{
	var AppRouter = Backbone.Router.extend({
		routes: {
			'subscription/:name/item/:pg': 'article',
		}
	});
	var appRouter = new AppRouter();
	Backbone.history.start({pushState: true});

	articleStore.init(pageData,appRouter);
	playerStore.init(articleStore);
	React.render(<Article store={articleStore} playerStore={playerStore} />,$('#content')[0]);
});