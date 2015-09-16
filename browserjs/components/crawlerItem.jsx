var $ = require('jquery');
var CrawlerEditor = require('./crawlerEditor.jsx')
var React = require('react');
var CrawlerItem = React.createClass(
{
	getInitialState: function()
	{
		return this.props.data;
	},
	onSubmitComplete: function(data)
	{
		this.setState(data);
		this.render();
	},
	onClick: function(e)
	{
		var el = $(e.target);
		if(el.prop('tagName').toLowerCase() != 'a'){
			el = el.parentsUntil('td');
		}
		if(el.prop('tagName').toLowerCase() != 'a'){
			e.preventDefault();
			React.render(<CrawlerEditor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
		}
	},
	onDelete: function(e)
	{
		var that = this;
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/common/'+this.state._id).then(function(){
			$(React.findDOMNode(that)).remove();
		});
		return false;
	},
	render: function()
	{
		return (
		<div className="item" onClick={this.onClick}>
			<div><h3>{this.state._source.siteName}</h3></div>
			<div><a target="_blank" className="remote" href={this.state._source.collectionUrl}>{this.state._source.collectionUrl}</a></div>
			<div>{this.state._source.collectionUrlRegex}</div>
			<div><ul className="list-inline">
				<li><a className="btn btn-info btn-xs" href={'/crawler/subscribe/'+this.state._id}>Subscribe <span className="glyphicon glyphicon-heart"></span></a></li>
				<li><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></li>
			</ul></div>
		</div>
		);
	}
})
module.exports = CrawlerItem;