var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
	routes: {
		'subscription/:name/item/:pg': 'article',
	}
});
var appRouter = new AppRouter();
Backbone.history.start({
	pushState: true
});

var tracker = require('../../lib/tracker');
var store = require('../../lib/store');
var storage = require('../../lib/storageWrapper');
var data, loading = false;
var CHANGE_EVENT = "change";

function formalizeUrl(href, keepExtension) {
	if (href.match(/^#/)) {
		return location.pathname + href;
	}

	var pageNum = href.replace(/(.*\/)*(\d+)(\.html)*.*$/, '$2');
	if (keepExtension) {
		pageNum += '.html'
	}
	return location.pathname.replace(/\d+\.html$/, pageNum);
}


var bodyParagraphs = [];

var Store = assign({}, EventEmitter.prototype, {
	DISPLAY_LAYOUT: {
		'VERTICAL': 1,
		'HORIZONTAL': 0
	},
	init: function(initData, appRouter) {
		this.appRouter = appRouter;
		data = initData;
		this.appRouter.on('route:article', function(name, pg) {
			this.fetchNewPage(pg);
		}.bind(this));
		tracker.track();
	},
	hilight: function(index) {
		data.speechHilightIndex = index;
		this.emitChange();
	},
	dehilight: function(index) {
		data.speechHilightIndex = -1;
		this.emitChange();
	},
	gotoNextPage: function() {
		if (pageData.nextIndex) {
			return fetchNewPage(pageData.nextIndex);
		} else {
			return Promise.reject('next page is not avaialbe');
		}
	},
	fetchNewPage: function(href) {
		loading = true;
		this.emitChange();
		// expecting 1.html
		return $.ajax({
				accepts: 'application/json; charset=utf-8',
				method: 'get',
				url: formalizeUrl(href)
			})
			.then(function(_data) {
				loading = false;
				data = _.clone(_data);
				this.emitChange();
				this.appRouter.navigate(formalizeUrl(href, true));
				this.updatePageTitle();
				tracker.track();
			}.bind(this));
	},
	updatePageTitle: function() {
		if (document && document.title) {
			document.title = data.title;
		}
	},
	track: function(url) {
		tracker.track(location.protocol + '//' + location.hostname + ':' + location.port + formalizeUrl(url, true));
	},
	setLayout: function(val) {
		if (storage.isWorking()) {
			storage.set(storage.STORAGE_DISPLAY_LAYOUT, val);
			this.emitChange();
		}
	},
	getLayout: function() {
		var layout = this.DISPLAY_LAYOUT.HORIZONTAL;
		if (storage.isWorking()) {
			layout = storage.get(storage.STORAGE_DISPLAY_LAYOUT);
			if (!layout || layout == 'undefined') {
				layout = this.DISPLAY_LAYOUT.HORIZONTAL;
				storage.set(storage.STORAGE_DISPLAY_LAYOUT, layout);
			}
		}
		return layout;
	},
	state: function() {
		if (data) {
			data.loading = loading;
			data.displayLayout = this.getLayout();
			return data;
		}
	},
	bodyParagraphs: function() {
		if (data && data._body && _.isString(data._body)) {
			bodyParagraphs = data._body.split("\n");
		}
		return bodyParagraphs;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
}, store);

AppDispatcher.register(function(action) {
	var text;

	switch (action.actionType) {
		case 'CHANGE_PAGE':
			Store.fetchNewPage(action.href);
			break;
		default:
			// no op
	}
});

Store.init(pageData, appRouter);

module.exports = Store;
