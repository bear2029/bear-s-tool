var React = require('react');
var CrawlerEditor = require('./crawlerEditor.jsx')
var CrawlerItem = require('./crawlerItem.jsx')
var CrawlerActions = require('../actions/crawlerActions');
//todo
//var CrawlerStore = require('
var CrawlerList = React.createClass(
{
	getInitialState: function()
	{
		return {data:this.props.data};
	},
	onAddNew: function()
	{
		var data = {'_source': {}}
		React.render(<CrawlerEditor data={data} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
	},
	onSubmitComplete: function(data)
	{
		this.state.data.push(data);
		this.setState(this.state);
	},
	render: function()
	{
		return (
		<div>
			<div id="list">
				{this.state.data.map(function(item,i){
					return <CrawlerItem key={i} data={item}/>;
				})}
			</div>
			<button className="btn btn-primary" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button>
		</div>
		);
	}
});
module.exports = CrawlerList;
