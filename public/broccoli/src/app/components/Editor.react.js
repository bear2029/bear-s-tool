var React = require('react');
var store = require('../stores/SampleStore');
var Inputer = require('./Inputer.react');
var Scroller = require('./Scroller.react');

var Editor = React.createClass(
{
	getInitialState: function()
	{
		return store.state;
	},
	onChange: function()
	{
		this.setState(store.state);
	},
	componentWillMount: function()
	{
		store.observeChange(this.onChange);
	},
	componentWillUnmount: function()
	{
		store.stopObservingChange(this.onChange);
	},
	render: function()
	{
		return ( 
		<div className="Editor">
			<Inputer count={this.state.count} />
			<Scroller count={this.state.count} />
		</div>);
	}
})
module.exports = Editor;