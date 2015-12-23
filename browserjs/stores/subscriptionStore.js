var Ajax = require('../../lib/promiseAjax');
var bear = require('../../lib/bear');
var Reflux = require('reflux');
var SubscriptionAction = require('../actions/subscriptionAction.js');
var searchHost = '/es';
var crawlerId,core = {items:[],editor:{isEditing:false}};
var _ = require('underscore');

function fetchCrawlerIdFromUrl()
{
	if(!location || !location.pathname){
		return;
	}
	var parts;
	// path: /crawler/subscribe/AU3m6aGTQLx8RJ42Q9ra
	if((parts = location.pathname.match(/^\/crawler\/subscribe\/([0-9A-Za-z]+)$/))){
		return parts[1];
	}
}

var Store = Reflux.createStore({
	listenables: SubscriptionAction,
	add: function()
	{
		core.editor.isEditing = true;
		core.editor.collectionName = '';
		core.editor.collectionUrl = '';
		core.editor.subscriptionId = null;
		core.editor.crawlerId = window.crawlerId;
		this.trigger(core);
	},
	edit: function(subscriptionId)
	{
		var item = _.find(core.items,function(item){return item._id === subscriptionId});
		if(!item){
			return;
		}
		core.editor.isEditing = true;
		core.editor.collectionName = item.name;
		core.editor.collectionUrl = item.remoteUrl;
		core.editor.subscriptionId = subscriptionId;
		core.editor.crawlerId = crawlerId;
		this.trigger(core);
	},
	del: function(subscriptionId)
	{
		// todo
	},
	closeEditor: function()
	{
		core.editor.isEditing = false;
		this.trigger(core);
	},
	editorSubmit: function(formBody,subscriptionId)
	{
		// todo
		var url = searchHost+"/crawler/subscription/";
		if(subscriptionId){
			url += subscriptionId;
		}
		Ajax.post(url,formBody)
		.then(this.onEditorSubmitResponded)
		.then(function(res) {
			var item = _.find(core.items,function(item){return item._id === subscriptionId});
			if(!item){
				item = {_id: res._id};
				core.items.push(item);
			}
			item.name = formBody.collectionName;
			item.remoteUrl = formBody.collectionUrl;
			this.closeEditor();
		}.bind(this))
		.catch(function(e){
			console.log('catch',e);
		});
	},
	update: function(itemId)
	{
		// todo
	},
	syncOnDropbox: function(itemId)
	{
		// todo
	},
	_fetchItemMeta: function(){
		return Ajax.post(searchHost+'/crawler/subscriptionItem/_search',{
			"size": 0,
			"fields":["_timestamp"],
			"aggs": {
				"group_by_collection": {
					"terms": { "field": "subscriptionId" },
					"aggs": {
						"lastIndex": { "max": { "field": "index" } },
						"lastUpdate": { "max": { "field": "_timestamp" } }
					}
				}
			}
		})
	},
	_assignMetaOnCoreItems: function(data){
		var itemGroup = data.aggregations.group_by_collection.buckets;
		_.each(core.items,function(coreItem){
			coreItem.id = coreItem._id;
			coreItem.name = coreItem._source.collectionName;
			coreItem.remoteUrl = coreItem._source.collectionUrl;
			coreItem.crawlerId = coreItem._source.crawlerId;
			delete coreItem._source;
			_.each(itemGroup,function(item){
				// todo, why item.key got F up
				if(item && item.key.toLowerCase() == coreItem._id.toLowerCase()){
					coreItem.count = item.doc_count;
					coreItem.lastUpdate = bear.formatDate(new Date(item.lastUpdate.value));
					coreItem.lastIndex = item.lastIndex.value;
				}
			})
		})
	},
	loadItems: function(){
		return Ajax.get(searchHost+'/crawler/subscription/_search?size=1000&q=crawlerid='+crawlerId)
		.then(function(data){core.items = data.hits.hits;})
		.then(this._fetchItemMeta)
		.then(this._assignMetaOnCoreItems)
	},
	init: function(/*[crawlerId]*/)
	{
		crawlerId = arguments[0] ? arguments[0] : null;
		if(!crawlerId){
			crawlerId = fetchCrawlerIdFromUrl();
		}
		if(!crawlerId){
			if(window && window.crawlerId){
				crawlerId = window.crawlerId;
			}else{
				return;
			}
		}
		return this.loadItems()
		.then(function() {
			this.trigger(core);
		}.bind(this))
		.catch(function(e){
			console.log(e);
			//var data = [];
			//React.render(<SubscriptionList data={data} />, document.getElementById('subscribe-list'));
		});
	},
	state: function()
	{
		return core;
	}
});
module.exports = Store;
