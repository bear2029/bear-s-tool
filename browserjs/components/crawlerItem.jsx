var $ = require('jquery');
var CrawlerEditor = require('./crawlerEditor.jsx')
var React = require('react');
var CrawlerActions = require('../actions/crawlerActions');
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
		console.log(this.props);
	// 	var that = this;
	// 	e.preventDefault();
	// 	Ajax.delete(searchHost+'/crawler/common/'+this.state._id).then(function(){
	// 		$(React.findDOMNode(that)).remove();
	// 	});
	// 	return false;
	},
	render: function()
	{
		return (
		<div className="item">
			<div><h3><a href="?" onClick={this.onClick}>{this.state.siteName}</a></h3></div>
			<div><a target="_blank" className="remote" href={this.state.collectionUrl}>{this.state.collectionUrl}</a></div>
			<div>{this.state.collectionUrlRegex}</div>
			<div><ul className="list-inline">
				<li><a className="btn btn-info btn-xs" href={'/crawler/subscribe/'+this.id}>Subscribe <span className="glyphicon glyphicon-heart"></span></a></li>
				<li><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></li>
			</ul></div>
		</div>
		);
	}
})
module.exports = CrawlerItem;
