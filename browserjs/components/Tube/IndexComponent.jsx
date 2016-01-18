var React = require('react');
var RouterUtils = require('react-router');
var Link = RouterUtils.Link;
module.exports = React.createClass({
	onSyncClicked: function(e)
	{
		console.log('ops');
	},
	render: function()
	{
		return (
		<div>
			<button className="btn btn-default" onClick={this.onSyncClicked}>SYNC</button>
			<Link to='/tube/123'>a link</Link>
		</div>
		);
	}
});
