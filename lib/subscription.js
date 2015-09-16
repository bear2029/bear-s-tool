var elasticsearch = require('elasticsearch');
var _ = require('underscore');
var Promise = require('promise');
function Subscription(){
	try{
		this.client = new elasticsearch.Client({
			//log: 'trace',
			host: 'localhost:9200'
		});
	}catch(e){
		console.log('fail to connect to elasticsearch');
	}
}
Subscription.prototype =
{
	getSearchResult: function(collectionName, term,pg,size)
	{
		var body = {
			size: size,
			from: size*(pg-1),
			min_score: 0.01,
			query:{
				filtered:{
					query: {bool:{should:[
						{match:{title:{query: term, type: 'phrase', boost: 2}}},
						{match:{body:{query:term,type:'phrase'}}}
					]}}
				}
			},
			sort:['index','_score']
		};
		if(collectionName !== 'All'){
			body.query.filtered.filter = {term:{collectionName:collectionName}};
		}
		//return console.log(JSON.stringify({
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: body
		});
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
	getSubscriptionItemById: function(itemId)
	{
		return this.client.get({
			index: 'crawler',
			type: 'subscriptionItem',
			id: itemId
		});
	},
	getSubscriptionItem: function(collectionName,index)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				size: 1,
				query:{
					filtered:{
						query:{
							match:{collectionName: collectionName}
						},
						filter:{
							term:{index: index}
						}
					}
				}
			}
		});
	},
	getSubscriptionItemByRange: function(collectionName,fromIndex,toIndex)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				size: toIndex-fromIndex+1,
				sort :[{"index":"asc"}],
				query:{
					filtered:{
						query:{
							match:{collectionName: collectionName}
						},
						filter:{
							range:{
								index: {
									gte: fromIndex,
									lte: toIndex
								}
							}
						}
					}
				}
			}
		});
	},
	getCollections: function(collectionName)
	{
		return this.client.search({
			index: 'crawler',
			type: 'subscription'
		});
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
