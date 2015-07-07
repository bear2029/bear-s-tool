define([
	'jquery',
	'lib/view/collectionList',
	'lib/model/searchList'
],function($,CollectionListView,SearchListModel){
	var searchListModel = new SearchListModel(app);
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: searchListModel
	});
});
