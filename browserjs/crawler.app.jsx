var React = require('react');
var Ajax = require('../lib/promiseAjax');
var $ = require('jquery');
var _ = require('underscore');
var bear = require('../lib/bear');
var CrawlerList = require('./components/crawlerList.jsx')
var SubscriptionList = require('./components/subscriptionList.jsx')
require('./ui/navi');


//searchHost = '//'+location.hostname+':9200';
searchHost = '/es';



if($('#crawler-list').length){
	React.render(<CrawlerList />, document.getElementById('crawler-list'));
	//React.render(<CrawlerList data={data} />, document.getElementById('crawler-list'));
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
						"lastIndex": { "max": { "field": "index" } },
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
				if(item && item.key == coreItem._id){
					coreItem._source.count = item.doc_count;
					coreItem._source.lastUpdate = bear.formatDate(new Date(item.lastUpdate.value));
					coreItem._source.lastIndex = item.lastIndex.value;
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
