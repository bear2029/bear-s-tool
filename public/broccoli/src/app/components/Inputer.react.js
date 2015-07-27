var React = require('react');
var store = require('../stores/SampleStore');
var action = require('../actions/SampleActions');
var $ = require('jquery');

module.exports = React.createClass(
{
	getInitialState: function()
	{
		return {count: this.props.count};
	},
	propTypes: function()
	{
		count: React.PropTypes.number
	},
	componentWillMount: function()
	{
		store.observeChange(function()
		{
			this.setState({count: store.state.count});
		}.bind(this));
	},
	render: function()
	{
		var value = this.state.count;
		return (
		<fieldset>
			<label>Count: </label>
			<input onChange={this.onChange} placeholder="count" type="text" value={value} />
		</fieldset>);
	},
	onChange: function(e)
	{
		var newCount = e.target.value;
		this.setState({count: e.target.value});
		action.setCount(newCount);
	}
})