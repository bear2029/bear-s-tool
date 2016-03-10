var React = require('react');
var ReactDom = require('react');
var Reflux = require('reflux');
var CrawlerEditor = require('./crawlerEditor.jsx')
var CrawlerItem = require('./crawlerItem.jsx')
var CrawlerStore = require('../stores/crawlerStore');
var CrawlerAction = require('../actions/crawlerAction');
//todo
//var CrawlerStore = require('
var CrawlerList = React.createClass(
{
	mixins: [Reflux.listenTo(CrawlerStore,"onChange")],
        onChange: function(state) {
		this.setState(state)
	},
	getInitialState: function()
	{
		return CrawlerStore.state();
	},
	onAddNew: function()
	{
		window.scroll(0,0);
		CrawlerAction.add();
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
