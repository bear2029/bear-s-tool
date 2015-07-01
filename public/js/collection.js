define([
	'jquery',
	'lib/view/collectionList',
	'lib/model/collectionList'
],function($,CollectionListView,CollectionListModel){
	var collectionListModel = new CollectionListModel(app)
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: collectionListModel
	})
});
