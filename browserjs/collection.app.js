var $ = require('jquery');
var isSearchPage = location.pathname.match(/^\/searchCollection\//);
var CollectionListView = require('./view/collectionList');
require('./ui/navi');

if (isSearchPage) {
	var SearchListModel = require('./model/searchList');
	var searchListModel = new SearchListModel(app);
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: searchListModel
	});
} else {
	var CollectionListModel = require('./model/collectionList');

	var collectionListModel = new CollectionListModel(app);
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: collectionListModel
	});
}
