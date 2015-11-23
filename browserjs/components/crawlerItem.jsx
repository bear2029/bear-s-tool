var $ = require('jquery');
var CrawlerEditor = require('./crawlerEditor.jsx')
var React = require('react');
var CrawlerAction = require('../actions/crawlerAction');
var CrawlerItem = React.createClass(
{
	propTypes: {
		id: React.PropTypes.string.isRequired,
		siteName: React.PropTypes.string.isRequired,
		remoteUrl: React.PropTypes.string
	},
	onSubmitComplete: function(data)
	{
		this.setState(data);
		this.render();
	},
	onClick: function(e)
	{
		e.preventDefault();
		CrawlerAction.startEdit(this.props.id);
	},
	onDelete: function(e)
	{
		CrawlerAction.del(this.props.id);
	 	e.preventDefault();
	},
	render: function()
	{
		return (
		<div className="item">
			<div><h3><a href="?" onClick={this.onClick}>{this.props.siteName}</a></h3></div>
			<div><a target="_blank" className="remote" href={this.remoteUrl}>{this.props.remoteUrl}</a></div>
			<div><ul className="list-inline">
				<li><a className="btn btn-info btn-xs" href={'/crawler/subscribe/'+this.props.id}>Subscribe <span className="glyphicon glyphicon-heart"></span></a></li>
				<li><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></li>
			</ul></div>
		</div>
		);
	}
})
module.exports = CrawlerItem;
