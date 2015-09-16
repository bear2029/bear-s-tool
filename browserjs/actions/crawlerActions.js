var AppDispatcher = require('../dispatchers/AppDispatcher');

var CrawlerActions = {

	add: function() {
		AppDispatcher.dispatch({
			actionType: 'ADD_CRAWLER'
		});
	},
	delete: function(id) {
		AppDispatcher.dispatch({
			actionType: 'DEL_CRAWLER',
			id: id
		});
	},
	startEdit: function(id) {
		AppDispatcher.dispatch({
			actionType: 'START_EDIT',
			id: id
		});
	},
	matchListUrl: function(matcherString,url) {
		AppDispatcher.dispatch({
			actionType: 'MATCH_LIST_URL',
			matcherString: matcherString,
			url: url
		});
	},
	matchItemUrl: function(matcherString,url) {
		AppDispatcher.dispatch({
			actionType: 'MATCH_ITEM_URL',
			matcherString: matcherString,
			url: url
		});
	},
	matchItemUrl: function(matcherString,url) {
		AppDispatcher.dispatch({
			actionType: 'MATCH_ITEM_URL',
			matcherString: matcherString,
			url: url
		});
	},
	testListScript: function(script) {
		AppDispatcher.dispatch({
			actionType: 'TEST_LIST_SCRIPT',
			script: script
		});
	},
	testItemScript: function(script) {
		AppDispatcher.dispatch({
			actionType: 'TEST_ITEM_SCRIPT',
			script: script
		});
	},
	submitEdit: function(data) {
		AppDispatcher.dispatch({
			actionType: 'SUBMIT_EDIT',
			id: data
		});
	},
	endEdit: function() {
		AppDispatcher.dispatch({
			actionType: 'END_EDIT'
		});
	},
};

module.exports = CrawlerActions;
