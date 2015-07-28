define([
	'react',
	'underscore',
	'backbone',
	'jquery',
	'bear'
],function(React,_,backbone,$,bear){
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
	Ajax = {/*{{{*/
		delete:function(url,data)
		{
			return this.post(url,data,'DELETE');
		},
		post:function(url,data)
		{
			var method = arguments[2] || 'POST';
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
					reject(new Error(jqXHR.responseJSON));
				});
			});
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
					reject(new Error(errorThrown));
				});
			});
		}
	};/*}}}*/
	var EditorCore = 
	{/*{{{*/
		mixins: [React.addons.LinkedStateMixin],
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
		render: function() {
			return (
			React.createElement("form", {className: "crawler-editor", onSubmit: this.onSubmit}, 
				React.createElement("div", {className: "editor"}, 
					React.createElement("h4", null, "Editor"), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("input", {name: "site-name", className: "form-control", placeholder: "site name", valueLink: this.linkState('siteName')})
					), 
					React.createElement("div", {className: "form-group url"}, 
						React.createElement("input", {name: "list-url", onKeyUp: this.onUrlMatchChanged, type: "url", className: "form-control wide", placeholder: "list URL for test", valueLink: this.linkState('collectionUrl')}), 
						React.createElement("div", {className: "validation-icon"}, React.createElement("span", {className: "glyphicon glyphicon-ok", "aria-hidden": "true"})), 
						React.createElement("input", {type: "text", onKeyUp: this.onUrlMatchChanged, className: "form-control", name: "list-url-regex", placeholder: "list URL regex", valueLink: this.linkState('collectionUrlRegex')})
					), 
					React.createElement("div", {className: "form-group url"}, 
						React.createElement("input", {name: "item-url", onKeyUp: this.onUrlMatchChanged, type: "url", className: "form-control wide", placeholder: "item URL for test", valueLink: this.linkState('itemUrl')}), 
						React.createElement("div", {className: "validation-icon"}, React.createElement("span", {className: "glyphicon glyphicon-ok", "aria-hidden": "true"})), 
						React.createElement("input", {type: "text", onKeyUp: this.onUrlMatchChanged, className: "form-control", name: "item-url-regex", placeholder: "item URL regex", valueLink: this.linkState('itemUrlRegex')})
					), 
					React.createElement("div", {className: "form-group url"}, 
						React.createElement("textarea", {className: "form-control wide", name: "collection-rule", placeholder: "collection rule, e.g. {\"title\":\"$('h1').html()\",\"links\":{\"link\":\"\",\"title\":\"\"}}", valueLink: this.linkState('collectionRule')}), 
						React.createElement("input", {type: "submit", className: "btn btn-default collection", onClick: this.onTest, value: "test"})
					), 
					React.createElement("div", {className: "form-group url"}, 
						React.createElement("textarea", {className: "form-control wide", name: "item-rule", placeholder: "item rule", valueLink: this.linkState('itemRule')}), 
						React.createElement("input", {type: "submit", className: "btn btn-default item", onClick: this.onTest, value: "test"})
					), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("button", {type: "submit", className: "btn btn-default"}, "Submit"), " ", 
						React.createElement("button", {type: "close", className: "btn btn-default", onClick: this.onClose}, "Close")
					)
				), 
				React.createElement("div", {className: "console"}, 
					React.createElement("h4", null, "Console"), 
					React.createElement("textarea", {readOnly: true, className: "form-control"})
				)
			)
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
			React.render(React.createElement(Editor, {data: data, onSubmitComplete: this.onSubmitComplete}), $('#crawler-editor')[0]);
		},
		onSubmitComplete: function(data)
		{
			this.state.data.push(data);
			this.setState(this.state);
		},
		render: function()
		{
			return (
			React.createElement("table", {className: "table table-striped responsive-table"}, 
				React.createElement("thead", null, 
					React.createElement("colgroup", null, 
						React.createElement("col", {className: ""}), 
						React.createElement("col", {className: "hide-mobile"}), 
						React.createElement("col", {className: "hide-mobile"}), 
						React.createElement("col", {className: ""}), 
						React.createElement("col", {className: "hide-mobile"})
					), 
					React.createElement("tr", null, 
						React.createElement("th", null, "site name"), 
						React.createElement("th", null, "list URL"), 
						React.createElement("th", null, "list URL match"), 
						React.createElement("th", null, "subscription"), 
						React.createElement("th", null, "deletion")
					)
				), 
				React.createElement("tbody", null, 
					this.state.data.map(function(item,i){
						return React.createElement(CrawlerItem, {key: i, data: item});
					}), 
					React.createElement("tr", null, 
						React.createElement("td", {colSpan: "5"}, React.createElement("button", {className: "btn btn-primary", onClick: this.onAddNew}, "Add New  ", React.createElement("span", {className: "glyphicon glyphicon-plus"})))
					)
				)
			)
			);
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
			var el = $(e.target);
			if(el.prop('tagName').toLowerCase() != 'a'){
				el = el.parentsUntil('td');
			}
			if(el.prop('tagName').toLowerCase() != 'a'){
				e.preventDefault();
				React.render(React.createElement(Editor, {data: this.state, onSubmitComplete: this.onSubmitComplete}), $('#crawler-editor')[0]);
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
			React.createElement("tr", {onClick: this.onClick}, 
				React.createElement("td", null, this.state._source.siteName), 
				React.createElement("td", null, this.state._source.collectionUrl), 
				React.createElement("td", null, this.state._source.collectionUrlRegex), 
				React.createElement("td", null, React.createElement("a", {className: "btn btn-info btn-xs", href: '/crawler/subscribe/'+this.state._id}, "Subscribe ", React.createElement("span", {className: "glyphicon glyphicon-heart"}))), 
				React.createElement("td", null, React.createElement("button", {className: "btn btn-danger btn-xs", onClick: this.onDelete}, "delete ", React.createElement("span", {className: "glyphicon glyphicon-remove"})))
			)
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
		render: function() {
			return (
			React.createElement("form", {className: "crawler-editor", onSubmit: this.onSubmit}, 
				React.createElement("div", {className: "editor"}, 
					React.createElement("h4", null, "Editor"), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("input", {name: "collection-name", className: "form-control", placeholder: "collection name", valueLink: this.linkState('collectionName')})
					), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("input", {name: "collection-url", type: "url", className: "form-control", placeholder: "collection URL", valueLink: this.linkState('collectionUrl')})
					), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("button", {type: "submit", className: "btn btn-default"}, "Submit"), " ", 
						React.createElement("button", {type: "close", className: "btn btn-default", onClick: this.onClose}, "Close")
					)
				)
			)
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
			React.render(React.createElement(SubscriptionEditor, {data: data, onSubmitComplete: this.onSubmitComplete}), $('#subscribe-editor')[0]);
		},
		render: function()
		{
			return (
			React.createElement("div", null, 
				React.createElement("div", {id: "list"}, 
					this.state.data.map(function(item,i){
						return React.createElement(SubscriptionItem, {key: i, data: item});
					})
				), 
				React.createElement("button", {className: "btn btn-primary add-new", onClick: this.onAddNew}, "Add New  ", React.createElement("span", {className: "glyphicon glyphicon-plus"}))
			)
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
		onEdit: function(e) { React.render(React.createElement(SubscriptionEditor, {data: this.state, onSubmitComplete: this.onSubmitComplete}), $('#subscribe-editor')[0]); },
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
		onExportToDropBox: function(e) { },
		render: function()
		{/*{{{*/
			var classes = 'update-cell';
			if(this.state.updating){
				classes += ' updating'
			}
			var href = "/subscription/"+this.state._source.collectionName+"/1.html";
			var progressStyle = {width: this.state.updatePercentage+'%'}
			return (
			React.createElement("div", {className: "item"}, 
				React.createElement("div", null, React.createElement("h3", null, React.createElement("a", {target: "_blank", href: href}, this.state._source.collectionName))), 
				React.createElement("div", null, React.createElement("a", {target: "_blank", href: this.state._source.collectionUrl}, this.state._source.collectionUrl)), 
				React.createElement("div", null, "count: ", this.state._source.count), 
				React.createElement("div", null, "last update: ", this.state._source.lastUpdate), 
				React.createElement("div", {className: classes}, 
					React.createElement("button", {className: "btn btn-info btn-xs", onClick: this.onUpdate}, 
						"update ", React.createElement("span", {className: "glyphicon glyphicon-refresh"})
					), 
					React.createElement("div", {className: "progress"}, 
						React.createElement("div", {style: progressStyle, className: "progress-bar", role: "progressbar", "aria-valuenow": "60", "aria-valuemin": "0", "aria-valuemax": "100"}, this.state.updatePercentage, "%")
					)
				), 
				React.createElement("div", {className: "utils"}, 
					React.createElement("a", {className: "btn btn-primary btn-xs", href: "/crawler/subscriptionItems/"+this.state._id+"/"+this.state._source.collectionName+".zip", title: "download"}, React.createElement("span", {className: "glyphicon glyphicon-floppy-save"})), 
					React.createElement("button", {className: "btn btn-primary btn-xs", onClick: this.onExportToDropBox, title: "export to dropbox"}, React.createElement("span", {className: "glyphicon glyphicon-cloud-download"})), 
					React.createElement("button", {className: "btn btn-success btn-xs", onClick: this.onEdit, title: "Edit"}, React.createElement("span", {className: "glyphicon glyphicon-pencil"})), 
					React.createElement("button", {className: "btn btn-danger btn-xs", onClick: this.onDelete, title: "delete"}, React.createElement("span", {className: "glyphicon glyphicon-trash"}))
				)
			)
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
			React.render(React.createElement(CrawlerList, {data: data.hits.hits}), document.getElementById('crawler-list'));
		}).catch(function(e){
			var data = [];
			React.render(React.createElement(CrawlerList, {data: data}), document.getElementById('crawler-list'));
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
			React.render(React.createElement(SubscriptionList, {data: core}), document.getElementById('subscribe-list'));
		}).catch(function(e){
			console.log(e);
			//var data = [];
			//React.render(<SubscriptionList data={data} />, document.getElementById('subscribe-list'));
		});
	}

	})();
})
