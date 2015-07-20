/*
10.0.0.26:9200/tracking
{
	"mappings" : {
		"page" : {
			"properties" : {
				"memberId" : { "type" : "string", "index" : "not_analyzed" },
				"url":{ "type": "string", "index": "not_analyzed" }
			},
			"_timestamp": { "enabled": "true", "store": "yes" }
		}
	}
}
*/


var elasticsearch = require('elasticsearch');
var Promise = require('promise');
var client = new elasticsearch.Client({
	//log: 'trace',
	host: 'localhost:9200'
});
var TrackingStorage =
{
	track: function(url,memberId)
	{
		return client.index({
			index: 'tracking',
			type: 'page',
			body: {
				url: url,
				memberId: memberId
			}
		});
	},
	findLastArticle: function(memberId,collectionName)
	{
		var body = {
			"query":{
				"filtered":{
					"filter":{
						"bool":{
							"must":[
								{"regexp":{"url":"https?://[^/]+/subscription/"+encodeURIComponent(collectionName)+"/item/[0-9]+.html.*"}},
								{"term":{"memberId":memberId}}
							]
						}    
					}
				}
			},
			"fields":["_timestamp","url","memberId"],
			"size": 10,
			"sort": {"_timestamp":"desc"}
		};
		return client.search({
			index: 'tracking',
			type: 'page',
			body: body
		});
	}
};
module.exports = exports = TrackingStorage;
