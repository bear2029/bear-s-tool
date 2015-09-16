var _ = require('underscore');
var React = require('react');
var $ = require('jquery');

var Editor = React.createClass(
{
	getInitialState:function(){
		this.fieldMap = ['siteName','collectionRule','itemRule','collectionUrlRegex','itemUrlRegex','collectionUrl','itemUrl'];
		this.isNew = !this.props.data._source;
		var state = $.extend({
			iscollectionUrlValid: true,
			isItemUrlValid: true
		},this.props.data._source);
		return state;
	},
	onSubmit: function(e)
	{
		e.preventDefault();
		var self = this;
		var formBody = _.pick(self.state,this.fieldMap);
		var url = searchHost+"/crawler/common";
		if(this.props.data && this.props.data._id){
			url += '/' + this.props.data._id;
		}
		Ajax.post(url,formBody)
		.then(this.onSubmitComplete)
		.catch(function(e){
			console.log('catch');
		});
	},
	onSubmitComplete: function(e){
		if(typeof this.props.onSubmitComplete == 'function'){
			this.props.data._source = this.state;
			this.props.data._id = e._id;
			this.props.onSubmitComplete(this.props.data);
			this.onClose();
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
	componentDidMount:function()
	{
		this.parentElement = $(React.findDOMNode(this)).closest('.popup');
		if(this.parentElement){
			this.parentElement.addClass('appear');
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
	onTest: function(e)
	{
		e.preventDefault();
		var matches = $(e.target).attr('class').match(/(item|collection)/);
		if(matches){
			var testType = matches[0];
			var consoleArea = $('.console textarea',React.findDOMNode(this));
			var story = {
				testUrl: this.state[testType+'Url'],
				testRule: JSON.parse(this.state[testType+'Rule'])
			};
			Ajax.post('/crawler/scriptTester',story).then(function(e){
				//console.log('response',e);
				consoleArea.removeClass('error');
				consoleArea.html(JSON.stringify(e));
			},function(e){
				//console.log('error',e);
				consoleArea.addClass('error');
				consoleArea.html(e.message);
			});
		}
	},
	onUrlMatchChanged: function(e)
	{
		var testType = this.urlTestTypeFromEvent(e);
		var regexString = $('input[name='+testType+'-url-regex]',React.findDOMNode(this)).val();
		var url = $('input[name='+testType+'-url]',React.findDOMNode(this)).val();
		var urlDiv = $('input[name='+testType+'-url]',React.findDOMNode(this)).parent();
		var isValid = false;
		if(url && regexString){
			var regex = new RegExp(regexString);
			isValid = url.match(regex);
		}
		this.setState({iscollectionUrlValid: isValid});
		if(isValid){
			urlDiv.addClass('valid');
			urlDiv.removeClass('invalid');
		}else{
			urlDiv.removeClass('valid');
			urlDiv.addClass('invalid');
		}
	},
	onChangeField: function(e)
	{
		// todo
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
	render: function() {
		return (
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="site-name" className="form-control" placeholder="site name" value={this.state.siteName}/>
				</div>
				<div className="form-group url">
					<input name="list-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="list URL for test" value={this.state.collectionUrl}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="list-url-regex" placeholder="list URL regex" value={this.state.collectionUrlRegex} />
				</div>
				<div className="form-group url">
					<input name="item-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="item URL for test" value={this.state.itemUrl}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="item-url-regex" placeholder="item URL regex" value={this.state.itemUrlRegex}/>
				</div>
				<div className="form-group url">
					<textarea className="form-control wide" name="collection-rule" placeholder="collection rule, e.g. {&#34;title&#34;:&#34;$('h1').html()&#34;,&#34;links&#34;:{&#34;link&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;}}" value={this.state.collectionRule}></textarea>
					<input type="submit" className="btn btn-default collection" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group url">
					<textarea className="form-control wide" name="item-rule" placeholder="item rule" value={this.state.itemRule}></textarea>
					<input type="submit" className="btn btn-default item" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-default" >Submit</button>&nbsp;
					<button type="close" className="btn btn-default" onClick={this.onClose}>Close</button>
				</div>
			</div>
			<div className="console">
				<h4>Console</h4>
				<textarea readOnly className="form-control"></textarea>
			</div>
		</form>
		);
	}
});
module.exports = Editor;
