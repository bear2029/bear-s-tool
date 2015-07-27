var React = require('react');
var store = require('../stores/SampleStore');

module.exports = React.createClass(
{
	getInitialState: function()
	{
		return store.state;
	},
	componentWillMount: function()
	{
		store.observeChange(this.syncState);
	},
	componentWillUnmount: function()
	{
		store.stopObservingChange(this.syncState);
	},
	syncState: function()
	{
		this.setState(store.state);
	},
	render: function()
	{
		var text = "Under control";
		if(store.tooMuch()){
			text = "Out of control!";
		}
		return (
		<span className="indicator">
			{text}
		</span>
		);
	}
})
