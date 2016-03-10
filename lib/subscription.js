var fetch = require('isomorphic-fetch');
var _ = require('underscore');
var Promise = require('promise');
var Subscription = function(){};
Subscription.prototype =
{
	getSearchResult: function(collectionName, term, pg, size)
	{
		// todo, re-enable search
	},
	summaryHilight: function(term,body)
	{
		var count = 2, trailingLength = 20;
		var matches = body.match(new RegExp('.{0,'+trailingLength+'}'+term+'.{0,'+trailingLength+'}','g'));
		var decoratedMatches = _.map(matches,function(item){
			if(count-- >0){
				return item.replace(term,'<em>'+term+'</em>').replace(/[^?,？。，]$/,'...');
			}
		});
		return decoratedMatches;
	},
	getAllSubscriptionByUpdate: function()
	{
		var that = this;
		return this.getItemsByUpdate()
		.then(function(obj){
			var promises = _.reduce(obj.aggregations.group_by_collection.buckets,function(list,item){
				list.push(that.getItemsByCollectionId(item.key,5));
				return list;
			},[]);
			return Promise.all(promises);
		})
		.then(function(list){
			return _.reduce(list,function(list,item){
				var _itemsPerCollection = item.hits.hits;
				var collectionName;
				var itemsPerCollection = _.reduce(_itemsPerCollection,function(_list,_item){
					var titles = that.itemNameParts(_.first(_item.fields.title));
					var article = {
						id: _item._id,
						index: _.first(_item.fields.index),
						title: titles.title,
						chapter: titles.chapter
					};
					collectionName = _item.fields.collectionName;
					_list.push(article);
					return _list;
				},[]);
				list[collectionName] = itemsPerCollection;
				return list;
			},{});
		});
	},
	getSubscriptionItem: function(bookId,index)
	{
		return fetch('/novel-api/books/'+bookId+'/chapters/'+index);
	},
	getSubscriptionItemByRange: function(bookId,from,to)
	{
		return fetch('/novel-api/books/'+bookId+'?from='+from+'&to='+to);
	},
	getCollections: function(bookId)
	{
		return fetch('/novel-api/books/'+bookId);
	},
	getCollectionByName: function(collectionName)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscription',
			body: {
				"query":{
					"match":{"collectionName":collectionName}
				},
				"size": 1
			}
		});
	},
	getItemsByCollectionName: function(collectionName,count,from)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				"query":{
					"match":{"collectionName":collectionName}
				},
				"fields":["title","collectionName","index"],
				"sort" :[{"index":"asc"}],
				"from": from,
				"size": count
			}
		});
	},
	getItemsByCollectionId: function(collectionId,count)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				"query":{
					"match":{"subscriptionId":collectionId}
				},
				"fields":["title","collectionName","index"],
				"sort" :[{"_timestamp":"desc"}],
				"size": count
			}
		});
	},
	getItemsByUpdate: function()
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				"size": 0,
				"aggs": {
					"group_by_collection": {
						"terms": { "field": "subscriptionId", "size": 10 },
						"aggs": {
							"lastUpdate": { "max": { "field": "_timestamp" } }
						}
					}
				}
			}
			
		});
	},
	itemNameParts: function(_title)
	{
		var titleMatches = _title.match(/^(第[零一二三四五六七八九十百千]+章) *(.+)$/);
		if(!titleMatches){
			titleMatches = _title.match(/^(\d+)、 *(.+)$/);
		}
		var title = titleMatches && titleMatches[2] ? titleMatches[2] : _title;
		return {
			title: title,
			chapter: titleMatches ? titleMatches[1] : '',
		};
	}
};
module.exports = exports = new Subscription();
