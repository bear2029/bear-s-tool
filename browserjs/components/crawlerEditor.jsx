var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Reflux = require('reflux');
var CrawlerStore = require('../stores/crawlerStore');
var CrawlerAction = require('../actions/crawlerAction');

var Editor = React.createClass(
{
	mixins: [LinkedStateMixin,Reflux.listenTo(CrawlerStore,'onChange')],
	getInitialState: function()
	{
		return CrawlerStore.state().editor;
	},
    	onChange: function(state)
	{
		console.log('ss',state.editor);
		this.setState(state.editor)
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		var formArray = $(e.target).serializeArray();
		var formObject = _.reduce(formArray,function(obj,item){obj[item.name] = item.value;return obj;},{});
		CrawlerAction.submitEdit(formObject);
	},
	onUrlMatchChanged: function(e)
	{
		var testType = this.urlTestTypeFromEvent(e);
		var url = this.state[testType+'Url'];
		var regexString = this.state[testType+'UrlRegex'];
		if(url && regexString){
			CrawlerAction.syncEditorState(this.state);
			CrawlerAction.validateUrl(testType,regexString,url);
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
		CrawlerAction.endEdit();
	},
	onTestScript: function(e)
	{
		e.preventDefault();
		var matches = $(e.target).attr('class').match(/(item|collection)/);
		if(matches){
			var testType = matches[0];
			var url = this.state[testType+'Url'];
			var rule = this.state[testType+'Rule'];
			CrawlerAction.syncEditorState(this.state);
			CrawlerAction.testScript(url,rule);
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
				<div className={collectionUrlSectionClass} onKeyUp={this.onUrlMatchChanged}>
					<input name="collection-url" type="url" className="form-control wide" placeholder="list URL for test" valueLink={this.linkState('collectionUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" className="form-control" name="collection-url-regex" placeholder="list URL regex" valueLink={this.linkState('collectionUrlRegex')} />
				</div>
				<div className={itemUrlSectionClass}>
					<input name="item-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="item URL for test" valueLink={this.linkState('itemUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="item-url-regex" placeholder="item URL regex" valueLink={this.linkState('itemUrlRegex')}/>
				</div>
				<div className="form-group one-line">
					<textarea className="form-control wide" name="collection-rule" placeholder="collection rule, e.g. {&#34;title&#34;:&#34;$('h1').html()&#34;,&#34;links&#34;:{&#34;link&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;}}" valueLink={this.linkState('collectionRule')}></textarea>
					<input type="submit" className="btn btn-default collection" onClick={this.onTestScript} value="test"/>
				</div>
				<div className="form-group one-line">
					<textarea className="form-control wide" name="item-rule" placeholder="item rule" valueLink={this.linkState('itemRule')}></textarea>
					<input type="submit" className="btn btn-default item" onClick={this.onTestScript} value="test"/>
				</div>
				<div className="form-group">
					<input type="hidden" name="id" valueLink={this.linkState('id')} />
					<button type="submit" className="btn btn-default" >Submit</button>&nbsp;
					<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
				</div>
			</div>
			<div className={consoleClassName}>
				<h4>Console</h4>
				<pre dangerouslySetInnerHTML={{__html: this.state.consoleHtml}} />
			</div>
		</form>
		</div>
		);
	}
});
module.exports = Editor;
