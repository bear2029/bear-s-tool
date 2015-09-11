var React = require('react');
var $ = require('jquery');
var bear = require('../lib/bear');
var Ajax = require('../lib/promiseAjax');
var _ = require('underscore');
var backbone = require('backbone');
var dropBoxHelper = require('./lib/dropBoxHelper');
require('./ui/navi');


Number.prototype.padLeft = function(base,chr){
	var  len = (String(base || 10).length - String(this).length)+1;
	return len > 0? new Array(len).join(chr || '0')+this : this;
};
_.formatDate = function(d)
{
	dformat = [ (d.getMonth()+1).padLeft(),
	d.getDate().padLeft(),
	d.getFullYear()].join('/')+ ' ' +
	[ d.getHours().padLeft(),
	d.getMinutes().padLeft(),
	d.getSeconds().padLeft()].join(':');
	return dformat;
};
//searchHost = '//'+location.hostname+':9200';
searchHost = '/es';
(function(){
var socket = io();
var EditorCore = 
{/*{{{*/
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
};/*}}}*/
var Editor = React.createClass(EditorCore);
var CrawlerListCore = 
{/*{{{*/
	getInitialState: function()
	{
		return {data:this.props.data};
	},
	onAddNew: function()
	{
		var data = {'_source': {}}
		React.render(<Editor data={data} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
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
};/*}}}*/
var CrawlerList = React.createClass(CrawlerListCore);
var CrawlerItemCore = 
{/*{{{*/
	getInitialState: function()
	{
		return this.props.data;
	},
	onSubmitComplete: function(data)
	{
		this.setState(data);
		this.render();
	},
	onClick: function(e)
	{
		var el = $(e.target);
		if(el.prop('tagName').toLowerCase() != 'a'){
			el = el.parentsUntil('td');
		}
		if(el.prop('tagName').toLowerCase() != 'a'){
			e.preventDefault();
			React.render(<Editor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
		}
	},
	onDelete: function(e)
	{
		var that = this;
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/common/'+this.state._id).then(function(){
			$(React.findDOMNode(that)).remove();
		});
		return false;
	},
	render: function()
	{
		return (
		<div className="item" onClick={this.onClick}>
			<div><h3>{this.state._source.siteName}</h3></div>
			<div><a target="_blank" className="remote" href={this.state._source.collectionUrl}>{this.state._source.collectionUrl}</a></div>
			<div>{this.state._source.collectionUrlRegex}</div>
			<div><ul className="list-inline">
				<li><a className="btn btn-info btn-xs" href={'/crawler/subscribe/'+this.state._id}>Subscribe <span className="glyphicon glyphicon-heart"></span></a></li>
				<li><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></li>
			</ul></div>
		</div>
		);
	}
}/*}}}*/
var CrawlerItem = React.createClass(CrawlerItemCore)


var SubscriptionEditorCore = _.extend(EditorCore,
{/*{{{*/
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
});/*}}}*/
var SubscriptionEditor = React.createClass(SubscriptionEditorCore);
var SubscriptionListCore = _.extend(CrawlerListCore,
{/*{{{*/
	componentDidMount: function()
	{
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
});/*}}}*/
var SubscriptionList = React.createClass(SubscriptionListCore);
var SubscriptionItemCore = _.extend(CrawlerItemCore,
{
	componentDidMount: function()
	{
		var that = this;
		this.state.updating = false;
		socket.on('crawler',function(msg){
			if(msg.id == that.state._id){
				if(msg.msg == 'all done'){
					that.state.updating = false;
					that.state._source.count = msg.count;
					that.state._source.lastUpdate = msg.lastUpdate;
					that.setState(that.state);
				}else if(msg.percentage){
					that.setState({'updating': true,'updatePercentage':msg.percentage});
				}
			}
		})
	},
	onEdit: function(e) { React.render(<SubscriptionEditor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#subscribe-editor')[0]); },
	onUpdate: function(e) {
		socket.emit('crawler', {'subscriptionId':this.state._id});
		this.setState({'updating':true});
		this.setState({'updatePercentage':0});
	},
	onDelete: function(e)
	{/*{{{*/
		var that = this;
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/subscription/'+that.state._id)
		.then(function(){
			return Ajax.delete(searchHost+'/crawler/subscriptionItem/_query',{query:{match:{
				subscriptionId:that.state._id}
			}});
		})
		.then(function(){
			$(React.findDOMNode(that)).remove();
		})
		return false;
	},/*}}}*/
	onExportToDropBox: function(e) {
		console.log($(e.currentTarget).attr('data-collection-name'));
	},
	render: function()
	{/*{{{*/
		var classes = 'update-cell';
		if(this.state.updating){
			classes += ' updating'
		}
		var href = "/subscription/"+this.state._source.collectionName+"/1.html";
		var progressStyle = {width: this.state.updatePercentage+'%'}
		return (
		<div className="item">
			<div><h3><a target="_blank" href={href}>{this.state._source.collectionName}</a></h3></div>
			<div><a target="_blank" className="remote" href={this.state._source.collectionUrl}>{this.state._source.collectionUrl}</a></div>
			<div>count: {this.state._source.count}</div>
			<div>last update: {this.state._source.lastUpdate}</div>
			<div className={classes}>
				<button className="btn btn-info btn-xs" onClick={this.onUpdate}>
					update <span className="glyphicon glyphicon-refresh"></span>
				</button>
				<div className="progress">
					<div style={progressStyle} className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">{this.state.updatePercentage}%</div>
				</div>
			</div>
			<div className="utils">
				<a className="btn btn-primary btn-xs" href={"/crawler/subscriptionItems/"+this.state._id+"/"+this.state._source.collectionName+".zip"} title="download"><span className="glyphicon glyphicon-floppy-save"></span></a>
				<button className="btn btn-primary btn-xs" data-collection-name={this.state._source.collectionName} onClick={this.onExportToDropBox} title="export to dropbox"><span className="glyphicon glyphicon-cloud-download"></span></button>
				<button className="btn btn-success btn-xs" onClick={this.onEdit} title="Edit"><span className="glyphicon glyphicon-pencil"></span></button>
				<button className="btn btn-danger btn-xs" onClick={this.onDelete} title="delete"><span className="glyphicon glyphicon-trash"></span></button>
			</div>
		</div>
		);
	}/*}}}*/
});/*}}}*/
var SubscriptionItem = React.createClass(SubscriptionItemCore);

if($('#crawler-list').length){
	var collectionList;
	Ajax.post(searchHost+'/crawler/common/_search',{size:1000})
	.then(function(data){
		collectionList = data;
		return data.hits.hits
	})
	.then(function(data){
		return Ajax.post(searchHost+'/crawler/common/_search',{size:1000})
	})
	.then(function(data){
		React.render(<CrawlerList data={data.hits.hits} />, document.getElementById('crawler-list'));
	}).catch(function(e){
		var data = [];
		React.render(<CrawlerList data={data} />, document.getElementById('crawler-list'));
	});
}else if($('#subscribe-list').length && crawlerId){
	var core;
	Ajax.get(searchHost+'/crawler/subscription/_search?size=1000&q=crawlerid='+crawlerId)
	.then(function(data){ core = data.hits.hits;})
	.then(function(){
		return Ajax.post(searchHost+'/crawler/subscriptionItem/_search',{
			"size": 0,
			"fields":["_timestamp"],
			"aggs": {
				"group_by_collection": {
					"terms": { "field": "subscriptionId" },
					"aggs": {
						"lastUpdate": { "max": { "field": "_timestamp" } }
					}
				}
			}
		})
	})
	.then(function(data){
		var itemGroup = data.aggregations.group_by_collection.buckets;
		_.each(core,function(coreItem){
			_.each(itemGroup,function(item){
				if(item.key == coreItem._id){
					coreItem._source.count = item.doc_count;
					coreItem._source.lastUpdate = _.formatDate(new Date(item.lastUpdate.value));
				}
			})
		})
		React.render(<SubscriptionList data={core} />, document.getElementById('subscribe-list'));
	}).catch(function(e){
		console.log(e);
		//var data = [];
		//React.render(<SubscriptionList data={data} />, document.getElementById('subscribe-list'));
	});
}

})();
