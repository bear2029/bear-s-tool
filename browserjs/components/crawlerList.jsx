var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var CrawlerEditor = require('./crawlerEditor.jsx')
var CrawlerItem = require('./crawlerItem.jsx')
var CrawlerStore = require('../stores/crawlerStore');
var CrawlerActions = require('../actions/crawlerActions');
//todo
//var CrawlerStore = require('
var CrawlerList = React.createClass(
{
	mixins: [Reflux.listenTo(CrawlerStore,"onStatusChange")],
        onStatusChange: function(status) {
		this.setState(status)
	},
	getInitialState: function()
	{
		return CrawlerStore.state();
	},
	onAddNew: function()
	{
		window.scroll(0,0);
		CrawlerActions.add();
		//var data = {'_source': {}}
		//React.render(<CrawlerEditor data={data} onSubmitComplete={this.onSubmitComplete} />, document.getElementById('crawler-editor'));
	},
	render: function()
	{
		return (
		<div>
			<div id="list">
				{this.state.crawlers.map(function(item,i){
					return <CrawlerItem key={i} id={item.id} siteName={item.siteName} remoteUrl={item.collectionUrl}/>;
				})}
			</div>
			<button className="btn btn-primary" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button>
			{<CrawlerEditor />}
		</div>
		);
	}
});
module.exports = CrawlerList;
