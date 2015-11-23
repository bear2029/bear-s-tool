var _ = require('underscore');
var React = require('react');
var ReactDom = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Reflux = require('reflux');
var $ = require('jquery');
var searchHost = '/es/';
var Ajax = require('../../lib/promiseAjax');
var SubscriptionStore = require('../stores/subscriptionStore');
var SubscriptionAction = require('../actions/subscriptionAction');
var fieldMap = ['collectionName','collectionUrl','crawlerId'];

var SubscriptionEditor = React.createClass(
{
	mixins: [LinkedStateMixin,Reflux.listenTo(SubscriptionStore,'onChange')],
    	onChange: function(state)
	{
		this.setState(state.editor);
	},
	getInitialState:function(){
		return SubscriptionStore.state().editor;
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		var formBody = _.pick(this.state,fieldMap);
		// todo
		SubscriptionAction.editorSubmit(formBody,this.state.subscriptionId);
	},
	onClose: function(e)
	{
		e.preventDefault();
		SubscriptionAction.closeEditor();
	},
	render: function() {
		var img,rootClassName = 'crawler-editor popup' + (this.state.isEditing ? ' appear' : '');
		if (this.state.thumnailUrl){
			img = (<img src={this.state.thumnailUrl} />);
		}
		return (
		<form className={rootClassName} onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="row">
					<div className="col-xs-8">
						<input name="thumbnail-uri" type="hidden" valueLink={this.linkState('thumbnail-uri')}/>
						<div className="form-group">
							<input name="collection-name" className="form-control" valueLink={this.linkState('collectionName')} placeholder="collection name"/>
						</div>
						<div className="form-group">
							<input name="collection-url" type="url" className="form-control" valueLink={this.linkState('collectionUrl')} placeholder="collection URL"/>
						</div>
						<div className="form-group">
							<button type="submit" className="btn btn-primary" >Submit</button>&nbsp;
							<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
						</div>
					</div>
					<div className="col-xs-4">
						<figure>{img}</figure>
					</div>
				</div>
			</div>
		</form>
		);
	}
});
module.exports = SubscriptionEditor;
