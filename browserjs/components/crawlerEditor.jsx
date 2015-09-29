var _ = require('underscore');
var $ = require('jquery');
var React = require('react/addons');
var Reflux = require('reflux');
var CrawlerStore = require('../stores/crawlerStore');
var CrawlerActions = require('../actions/crawlerActions');

var Editor = React.createClass(
{
	mixins: [React.addons.LinkedStateMixin,Reflux.listenTo(CrawlerStore,'onStatusChange')],
	getInitialState: function()
	{
		return CrawlerStore.state().editor;
	},
    	onStatusChange: function(status)
	{
		console.log('status',status.editor);
		this.setState(status.editor)
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		console.log($(e.target).serialize());
		var formArray = $(e.target).serializeArray();
		var formObject = _.reduce(formArray,function(obj,item){obj[item.name] = item.value;return obj;},{});
		CrawlerActions.submitEdit(formObject);
	},
	onUrlMatchChanged: function(e)
	{
		var testType = this.urlTestTypeFromEvent(e);
		var regexString = $('input[name='+testType+'-url-regex]',React.findDOMNode(this)).val();
		var url = $('input[name='+testType+'-url]',React.findDOMNode(this)).val();
		if(url && regexString){
			CrawlerActions.validateUrl(testType,regexString,url);
		}
	},
	urlTestTypeFromEvent: function(e)
	{
		var name = $(e.target).attr('name');
		var matches = name.match(/^([a-z]+)-url/);
		if(!matches){
			new Error('element is illigal');
		}
		return matches[1];
	},
	onClose: function(e)
	{
		e.preventDefault();
		CrawlerActions.endEdit();
	},
	onTest: function(e)
	{
		e.preventDefault();
		var matches = $(e.target).attr('class').match(/(item|collection)/);
		if(matches){
			var testType = matches[0];
			var url = $('input[name='+testType+'-url]',React.findDOMNode(this)).val();
			var rule = $('textarea[name='+testType+'-rule]',React.findDOMNode(this)).val();
			CrawlerActions.testScript(url,rule);
		}
	},
	render: function() {
		var popupClassName = this.state.isEditing ? 'popup appear' : 'popup';
		var collectionUrlSectionClass = _.isNull(this.state.isCollectionUrlValid) ? '' : this.state.isCollectionUrlValid ? 'valid' : 'invalid';
		var itemUrlSectionClass = _.isNull(this.state.isItemUrlValid) ? '' : this.state.isItemUrlValid ? 'valid' : 'invalid';
		var consoleClassName = 'console' + (this.state.isErrorOnConsole ? ' error' : '');
		collectionUrlSectionClass += ' form-group one-line';
		itemUrlSectionClass += ' form-group one-line';
		return (
		<div id="crawler-editor" className={popupClassName}>
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="site-name" className="form-control" placeholder="site name" valueLink={this.linkState('siteName')}/>
				</div>
				<div className={collectionUrlSectionClass}>
					<input name="collection-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="list URL for test" valueLink={this.linkState('collectionUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="collection-url-regex" placeholder="list URL regex" valueLink={this.linkState('collectionUrlRegex')} />
				</div>
				<div className={itemUrlSectionClass}>
					<input name="item-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="item URL for test" valueLink={this.linkState('itemUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="item-url-regex" placeholder="item URL regex" valueLink={this.linkState('itemUrlRegex')}/>
				</div>
				<div className="form-group one-line">
					<textarea className="form-control wide" name="collection-rule" placeholder="collection rule, e.g. {&#34;title&#34;:&#34;$('h1').html()&#34;,&#34;links&#34;:{&#34;link&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;}}" valueLink={this.linkState('collectionRule')}></textarea>
					<input type="submit" className="btn btn-default collection" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group one-line">
					<textarea className="form-control wide" name="item-rule" placeholder="item rule" valueLink={this.linkState('itemRule')}></textarea>
					<input type="submit" className="btn btn-default item" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group">
					<input type="hidden" name="id" valueLink={this.linkState('id')} />
					<button type="submit" className="btn btn-default" >Submit</button>&nbsp;
					<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
				</div>
			</div>
			<div className={consoleClassName}>
				<h4>Console</h4>
				<textarea readOnly className="form-control" valueLink={this.linkState('consoleHtml')}></textarea>
			</div>
		</form>
		</div>
		);
	}
});
module.exports = Editor;
