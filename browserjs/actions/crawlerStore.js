var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var $ = require('jquery');
var _ = require('underscore');
var CHANGE_EVENT = 'CHANGE';

var data, store = require('../../lib/store');



var Store = assign({}, EventEmitter.prototype, {
	init: function() {
		//this.emitChange();
	},
	state: function() {
		if (data) {
			return data;
		}
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

	switch (action.actionType) {
		// case 'CHANGE_PAGE':
		// 	Store.fetchNewPage(action.href);
		// 	break;
		default:
			// no op
	}
});

Store.init();

module.exports = Store;

