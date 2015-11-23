var SubscriptionStore = require('../stores/subscriptionStore');
var SubscriptionAction = require('../actions/subscriptionAction');
var SubscriptionEditor = require('./subscriptionEditor.jsx')
var SubscriptionItem = require('./subscriptionItem.jsx')
var React = require('react');
var ReactDom = require('react-dom');
var Reflux = require('reflux');
var $ = require('jquery');
SubscriptionList = React.createClass(
{
	mixins: [Reflux.listenTo(SubscriptionStore,"onChange")],
	onChange: function(state)
	{
		this.setState(state);
	},
	getInitialState: function()
	{
		return SubscriptionStore.state();
	},
	onAddNew: function(e)
	{
		e.preventDefault();
		SubscriptionAction.add();
	},
	render: function()
	{
		return (
		<div>
			<div id="list">
				{this.state.items.map(function(item,i){
					return <SubscriptionItem key={i} 
							name={item.name}
							count={item.count}
							id={item.id}
							crawlerId={item.crawlerId}
							lastIndex={item.lastIndex}
							lastUpdate={item.lastUpdate}
							remoteUrl={item.remoteUrl}
					/>;
				})}
			</div>
			<button className="btn btn-primary add-new" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button>
			<SubscriptionEditor />
		</div>
		);
	}
});
module.exports = SubscriptionList;
