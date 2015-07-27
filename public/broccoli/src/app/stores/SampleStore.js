var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var appDispatcher = require('../dispatchers/AppDispatcher');
var constants = require('../constants/SampleConstant');

var CHANGE_EVENT = 'change';
var data = {count: 5};

var Store = assign({}, EventEmitter.prototype, 
{
	get state(){
		return data;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	observeChange: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	stopObservingChange: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	tooMuch: function()
	{
		return data.count > constants.LIMIT;
	}
});

appDispatcher.register(function(action)
{
	switch(action.actionType) {
		case constants.PLUS:
			data.count++;
			Store.emitChange();
			break;
		case constants.MINUS:
			data.count--;
			Store.emitChange();
			break;
		case constants.SET:
			data.count = action.count;
			Store.emitChange();
			break;
		default:
			Store.emitChange();
			break;
	}
});

module.exports = Store;
