var _ = require('underscore');
var React = require('react');
var $ = require('jquery');

var SubscriptionEditor = React.createClass(
{
	getInitialState:function(){
		this.fieldMap = ['collectionName','collectionUrl','crawlerId'];
		this.isNew = !this.props.data._source;
		var state = $.extend({
			crawlerId: crawlerId,
			lastUpdate: '',
			count: 0
		},this.props.data._source);
		return state;
	},
	componentDidMount:function()
	{
		this.parentElement = $(React.findDOMNode(this)).closest('.popup');
		if(this.parentElement){
			this.parentElement.addClass('appear');
		}
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		var self = this;
		var formBody = _.pick(self.state,this.fieldMap);
		var url = searchHost+"/crawler/subscription/";
		if(this.props.data && this.props.data._id){
			url += '/' + this.props.data._id;
		}
		Ajax.post(url,formBody)
		.then(this.onSubmitComplete)
		.catch(function(e){
			console.log('catch');
		});
	},
	onChangeField: function(e)
	{
		var $input = $(e.target);
		switch($input.attr('name')){
			case 'collection-name':
				this.setState({collectionName:$input.val()});
				break;
			case 'collection-url':
				this.setState({collectionUrl:$input.val()});
				break;
		}
	},
	onClose: function(e)
	{
		var that = this;
		if(e){
			e.preventDefault();
		}
		if(this.parentElement){
			this.parentElement.removeClass('appear');
			$(React.findDOMNode(that)).remove();
		}
	},
	render: function() {
		return (
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="collection-name" className="form-control" onChange={this.onChangeField} placeholder="collection name" value={this.state.collectionName}/>
				</div>
				<div className="form-group">
					<input name="collection-url" type="url" className="form-control" onChange={this.onChangeField} placeholder="collection URL" value={this.state.collectionUrl}/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-default" >Submit</button>&nbsp;
					<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
				</div>
			</div>
		</form>
		);
	}
});
module.exports = SubscriptionEditor;
