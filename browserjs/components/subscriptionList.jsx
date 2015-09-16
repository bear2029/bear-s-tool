var SubscriptionEditor = require('./subscriptionEditor.jsx')
var SubscriptionItem = require('./subscriptionItem.jsx')
var React = require('react');
SubscriptionList = React.createClass(
{
	getInitialState: function()
	{
		return {data:this.props.data};
	},
	onSubmitComplete: function(data)
	{
		this.state.data.push(data);
		this.setState(this.state);
	},
	onAddNew: function()
	{
		var data = {'_source': {}}
		React.render(<SubscriptionEditor data={data} onSubmitComplete={this.onSubmitComplete} />, $('#subscribe-editor')[0]);
	},
	render: function()
	{
		return (
		<div>
			<div id="list">
				{this.state.data.map(function(item,i){
					return <SubscriptionItem key={i} data={item}/>;
				})}
			</div>
			<button className="btn btn-primary add-new" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button>
		</div>
		);
	}
});
module.exports = SubscriptionList;
