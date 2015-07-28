/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * PrefixerStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var autoprefixer = require('autoprefixer-core');
var postcss      = require('postcss');
 

var CHANGE_EVENT = 'change';

var _data = {row: '', final: '', valid: true};

function transform(css)
{
	return postcss([ autoprefixer ]).process(css).then(function (result) {
		result.warnings().forEach(function (warn) {
			console.warn(warn.toString());
		});
		console.log(result.css);
		return result.css;
	});
}


var PrefixerStore = assign({}, EventEmitter.prototype, {

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

	get state(){
		return _data;
	}
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
	var text;

	switch(action.actionType) {
		case 'CHANGE_RAW':
			text = action.text;
			if (text !== '') {
				_data.raw = text;
				transform(text)
				.then(function(text)
				{
					_data.valid = true;
					_data.final = text;
					PrefixerStore.emitChange();
				})
				.catch(function(e){
					_data.valid = false;
					PrefixerStore.emitChange();
				})
			}
			break;
		default:
			// no op
	}
});

module.exports = PrefixerStore;
