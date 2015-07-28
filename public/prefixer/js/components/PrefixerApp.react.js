/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".	It listens for changes in
 * the PrefixerStore and passes the new data to its children.
 */

var React = require('react');
var PrefixerStore = require('../stores/PrefixerStore');
var PrefixerAction = require('../actions/PrefixerActions');

/**
 * Retrieve the current Prefixer data from the PrefixerStore
 */
function getPrefixerState() {
	return PrefixerStore.state;
}

var PrefixerApp = React.createClass({

	getInitialState: function() {
		return getPrefixerState();
	},

	componentDidMount: function() {
		PrefixerStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		PrefixerStore.removeChangeListener(this._onChange);
	},

	/**
	 * @return {object}
	 */
	render: function() {
		var validClass = this.state.valid ? 'valid' : '';
		console.log(validClass);
		return (
		<div id="prefixer-app">
			<div id="src"><textarea onKeyup={this.onChange} onChange={this.onChange}></textarea></div>
			<div id="result" className={validClass}><pre>{this.state.final}</pre></div>
		</div>
		);
	},
	onChange: function(e)
	{
		PrefixerAction.change(e.target.value);
	},
	/**
	 * Event handler for 'change' events coming from the PrefixerStore
	 */
	_onChange: function() {
		this.setState(getPrefixerState());
	}

});

module.exports = PrefixerApp;
