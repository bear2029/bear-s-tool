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
searchHost = '//'+location.hostname+':9200';
(function(){
var socket = io();
Ajax = {/*{{{*/
	delete:function(url,data)
	{
		return this.post(url,data,'DELETE')
	},
	post:function(url,data)
	{
		var method = arguments[2] || 'POST'
		return new Promise(function(resolve,reject){
			$.ajax({
				method: method,
				url: url,
				data: JSON.stringify(data),
				processData: false,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(jqXHR.responseJSON))
			});
		})
	},
	get:function(url)
	{
		return new Promise(function(resolve,reject){
			$.ajax({
				method: "GET",
				url: url,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(errorThrown))
			});
		})
	}
};/*}}}*/
var EditorCore = 
{/*{{{*/
	mixins: [React.addons.LinkedStateMixin],
	getInitialState:function(){
		this.fieldMap = ['siteName','collectionRule','itemRule','collectionUrlRegex','itemUrlRegex','collectionUrl','itemUrl']
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
		var self = this
		var formBody = _.pick(self.state,this.fieldMap);
		var url = searchHost+"/crawler/common";
		if(this.props.data && this.props.data._id){
			url += '/' + this.props.data._id
		}
		Ajax.post(url,formBody)
		.then(this.onSubmitComplete)
		.catch(function(e){
			console.log('catch');
		})
	},
	onSubmitComplete: function(e){
		if(typeof this.props.onSubmitComplete == 'function'){
			this.props.data._source = this.state;
			this.props.data._id = e._id;
			this.props.onSubmitComplete(this.props.data)
			this.onClose()
		}
	},
	urlTestTypeFromEvent: function(e)
	{
		var name = $(e.target).attr('name');
		var matches = name.match(/^([a-z]+)-url/);
		if(!matches){
			new Error('element is illigal')
		}
		return matches[1];
	},
	componentDidMount:function()
	{
		this.parentElement = $(React.findDOMNode(this)).closest('.popup');
		if(this.parentElement){
			this.parentElement.addClass('appear')
		}
	},
	onClose: function(e)
	{
		var that = this
		console.log(this,React.findDOMNode(that));
		if(e){
			e.preventDefault();
		}
		if(this.parentElement){
			this.parentElement.removeClass('appear')
			$(React.findDOMNode(that)).remove()
		}
	},
	onTest: function(e)
	{
		e.preventDefault()
		var matches = $(e.target).attr('class').match(/(item|collection)/)
		if(matches){
			var testType = matches[0];
			var consoleArea = $('.console textarea',React.findDOMNode(this))
			var story = {
				testUrl: this.state[testType+'Url'],
				testRule: JSON.parse(this.state[testType+'Rule'])
			};
			Ajax.post('/crawler/scriptTester',story).then(function(e){
				//console.log('response',e);
				consoleArea.removeClass('error')
				consoleArea.html(JSON.stringify(e))
			},function(e){
				//console.log('error',e);
				consoleArea.addClass('error')
				consoleArea.html(e.message)
			})
		}
	},
	onUrlMatchChanged: function(e)
	{
		var testType = this.urlTestTypeFromEvent(e);
		var regexString = $('input[name='+testType+'-url-regex]',React.findDOMNode(this)).val()
		var url = $('input[name='+testType+'-url]',React.findDOMNode(this)).val()
		var urlDiv = $('input[name='+testType+'-url]',React.findDOMNode(this)).parent()
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
	render: function() {
		return (
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="site-name" className="form-control" placeholder="site name" valueLink={this.linkState('siteName')}/>
				</div>
				<div className="form-group url">
					<input name="list-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="list URL for test" valueLink={this.linkState('collectionUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="list-url-regex" placeholder="list URL regex" valueLink={this.linkState('collectionUrlRegex')} />
				</div>
				<div className="form-group url">
					<input name="item-url" onKeyUp={this.onUrlMatchChanged} type="url" className="form-control wide" placeholder="item URL for test" valueLink={this.linkState('itemUrl')}/>
					<div className="validation-icon"><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></div>
					<input type="text" onKeyUp={this.onUrlMatchChanged} className="form-control" name="item-url-regex" placeholder="item URL regex" valueLink={this.linkState('itemUrlRegex')}/>
				</div>
				<div className="form-group url">
					<textarea className="form-control wide" name="collection-rule" placeholder="collection rule, e.g. {&#34;title&#34;:&#34;$('h1').html()&#34;}" valueLink={this.linkState('collectionRule')}></textarea>
					<input type="submit" className="btn btn-default collection" onClick={this.onTest} value="test"/>
				</div>
				<div className="form-group url">
					<textarea className="form-control wide" name="item-rule" placeholder="item rule" valueLink={this.linkState('itemRule')}></textarea>
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
		this.setState(this.state)
	},
	render: function()
	{
		return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th>site name</th>
					<th>list URL</th>
					<th>list URL match</th>
					<th>subscription</th>
					<th>deletion</th>
				</tr>
			</thead>
			<tbody>
				{this.state.data.map(function(item){
					return <CrawlerItem data={item}/>;
				})}
				<tr>
					<td colSpan="5"><button className="btn btn-primary" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button></td>
				</tr>
			</tbody>
		</table>
		)
	}
};/*}}}*/
var CrawlerList = React.createClass(CrawlerListCore);
var CrawlerItemCore = 
{/*{{{*/
	mixins: [React.addons.LinkedStateMixin],
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
		if(e.target.tagName.toLowerCase() != 'a'){
			React.render(<Editor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
		}
	},
	onDelete: function(e)
	{
		var that = this
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/common/'+this.state._id).then(function(){
			$(React.findDOMNode(that)).remove();
		})
		return false
	},
	render: function()
	{
		return (
		<tr onClick={this.onClick}>
			<td>{this.state._source.siteName}</td>
			<td>{this.state._source.collectionUrl}</td>
			<td>{this.state._source.collectionUrlRegex}</td>
			<td><a className="btn btn-info btn-xs" href={'/crawler/subscribe/'+this.state._id}>Subscribe <span className="glyphicon glyphicon-heart"></span></a></td>
			<td><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-remove"></span></button></td>
		</tr>
		)
	}
}/*}}}*/
var CrawlerItem = React.createClass(CrawlerItemCore)


var SubscriptionEditorCore = _.extend(EditorCore,
{/*{{{*/
	getInitialState:function(){
		this.fieldMap = ['collectionName','collectionUrl','crawlerId']
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
		var self = this
		var formBody = _.pick(self.state,this.fieldMap);
		console.log(formBody);
		var url = searchHost+"/crawler/subscription/";
		if(this.props.data && this.props.data._id){
			url += '/' + this.props.data._id
		}
		Ajax.post(url,formBody)
		.then(this.onSubmitComplete)
		.catch(function(e){
			console.log('catch');
		})
	},
	render: function() {
		return (
		<form className="crawler-editor" onSubmit={this.onSubmit}>
			<div className="editor">
				<h4>Editor</h4>
				<div className="form-group">
					<input name="collection-name" className="form-control" placeholder="collection name" valueLink={this.linkState('collectionName')}/>
				</div>
				<div className="form-group">
					<input name="collection-url" type="url" className="form-control" placeholder="collection URL" valueLink={this.linkState('collectionUrl')}/>
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
var SubscriptionEditor = React.createClass(SubscriptionEditorCore)
var SubscriptionListCore = _.extend(CrawlerListCore,
{/*{{{*/
	componentDidMount: function()
	{
		socket.on('crawler',function(msg){
			console.log(msg);
			if(msg.msg == 'all done'){
				console.log('new count '+msg.count)
			}
		})
	},
	onAddNew: function()
	{
		var data = {'_source': {}}
		React.render(<SubscriptionEditor data={data} onSubmitComplete={this.onSubmitComplete} />, $('#subscribe-editor')[0]);
	},
	render: function()
	{
		return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Collection name</th>
					<th>list URL</th>
					<th>count</th>
					<th>last update</th>
					<th>update</th>
					<th>download</th>
					<th>export to dropbox</th>
					<th>Edit</th>
					<th>delete</th>
				</tr>
			</thead>
			<tbody>
				{this.state.data.map(function(item){
					return <SubscriptionItem data={item}/>;
				})}
				<tr>
					<td colSpan="9"><button className="btn btn-primary" onClick={this.onAddNew}>Add New &nbsp;<span className="glyphicon glyphicon-plus"></span></button></td>
				</tr>
			</tbody>
		</table>
		)
	}
});/*}}}*/
var SubscriptionList = React.createClass(SubscriptionListCore);
var SubscriptionItemCore = _.extend(CrawlerItemCore,
{/*{{{*/
	onEdit: function(e)
	{
		React.render(<SubscriptionEditor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#subscribe-editor')[0]);
	},
	onUpdate: function(e)
	{
		socket.emit('crawler', {'subscriptionId':this.state._id});
	},
	onDelete: function(e)
	{
		var that = this
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/subscription/'+that.state._id)
		.then(function(){
			return Ajax.delete(searchHost+'/crawler/subscriptionItem/_query',{query:{match:{subscriptionId:that.state._id}}})
		})
		.then(function(){
			$(React.findDOMNode(that)).remove();
		})
		return false
	},
	onExportToDropBox: function(e)
	{
	},
	render: function()
	{
		return (
		<tr>
			<th>{this.state._source.collectionName}</th>
			<th>{this.state._source.collectionUrl}</th>
			<th>{this.state._source.count}</th>
			<th>{this.state._source.lastUpdate}</th>
			<td><button className="btn btn-info btn-xs" onClick={this.onUpdate}>update <span className="glyphicon glyphicon-refresh"></span></button></td>
			<td><a className="btn btn-primary btn-xs" href={"/crawler/subscriptionItems/"+this.state._source.collectionName+"/zip"}>download <span className="glyphicon glyphicon-floppy-save"></span></a></td>
			<td><button className="btn btn-primary btn-xs" onClick={this.onExportToDropBox}>export to dropbox <span className="glyphicon glyphicon-cloud-download"></span></button></td>
			<td><button className="btn btn-success btn-xs" onClick={this.onEdit}>Edit <span className="glyphicon glyphicon-pencil"></span></button></td>
			<td><button className="btn btn-danger btn-xs" onClick={this.onDelete}>delete <span className="glyphicon glyphicon-trash"></span></button></td>
		</tr>
		)
	}
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
	})
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
		console.log(data.aggregations.group_by_collection.buckets,core);
		var itemGroup = data.aggregations.group_by_collection.buckets;
		_.each(core,function(coreItem){
			_.each(itemGroup,function(item){
				if(_.isMatch(item,{key:coreItem._id.toLowerCase()})){
					coreItem._source.count = item.doc_count;
					coreItem._source.lastUpdate = _.formatDate(new Date(item.lastUpdate.value));
				}
			})
		})
		React.render(<SubscriptionList data={core} />, document.getElementById('subscribe-list'));
	}).catch(function(e){
		console.log(e)
		//var data = [];
		//React.render(<SubscriptionList data={data} />, document.getElementById('subscribe-list'));
	})
}

})()
