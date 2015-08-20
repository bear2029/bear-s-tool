var React = require('react');
var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
var bear = require('../lib/bear');
var articleStore = require('./stores/articleStore');
var playerStore = require('./stores/playerStore');
var Article = require('./components/article.jsx');
require('./ui/navi');

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
