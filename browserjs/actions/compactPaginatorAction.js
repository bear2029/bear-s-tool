var AppDispatcher = require('../dispatchers/AppDispatcher');

var CompactPaginatorActions = {

	changePage: function(href) {
		AppDispatcher.dispatch({
			actionType: 'CHANGE_PAGE',
			href: href
		});
	}
};

module.exports = CompactPaginatorActions;

