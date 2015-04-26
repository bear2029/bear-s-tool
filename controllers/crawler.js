var striptags = require('striptags');
var request = require('request');
var cheerio = require('cheerio');
var gbk = require('gbk');
var elasticsearch = require('elasticsearch');
var Promise = require('promise');


var self = 
{
	combineUrl: function(targetUrl,sourceUrl)
	{/*{{{*/
		if(targetUrl.match(/^https?:/)){
			return targetUrl
		}
		var prefix = ''
		var sourceUrlParts = _.object(
			['url','protocol','hostName','filePath','path','fileName'],sourceUrl
			.match(new RegExp('^(https?)://([^/]+)\/?((.*/)([^/]*))$'))
		)
		prefix = sourceUrlParts.protocol;
		if(targetUrl.match(/^\/\//)){
			return prefix + targetUrl
		}
		prefix += '://' + sourceUrlParts.hostName;
		if(targetUrl.match(/^\//)){
			return prefix + targetUrl
		}
		prefix += '/' + sourceUrlParts.path;
		return prefix + targetUrl
	},/*}}}*/
	fetch: function(url,rule)
	{/*{{{*/
		return new Promise(function(resolve,reject){
			try{
				gbk.fetch(url).to('string', function(error,body){
					if (!error) {
						var data = {}
						for(var key in rule){
							var $ = cheerio.load(''+body);
							try{
								data[key] = eval(rule[key])
							}catch(e){
								reject(new Error('parsing error: '+e));
							}
						}
						data.remoteUrl = url
						resolve(data);
					}else{
						reject(new Error('connection error: '+error));
					}
				})
			}catch(e){
				reject(new Error('unknown error: '+e));
			}
		});
	},/*}}}*/
	home: function(req,res)
	{
		res.render('crawlerHome',{});
	},
	subscribe: function(req,res)
	{
		res.render('crawlerSubscribe',{crawlerId:req.params.id});
	},
	scriptTester: function(req,res)
	{/*{{{*/
		try{
			var testUrl = req.body.testUrl;
			var testRule = req.body.testRule;
			self.fetch(testUrl,testRule)
			.then(function(data){
				res.send(util.inspect(data));
			})
			.catch(function(e){
				res.status(400).json('parsing error: '+e);
			})
		}catch(e){
			res.status(400).send('bad reuest (check your resquest body)')
		}
	},/*}}}*/
	crawl: function(io,obj)
	{
		var subscription,crawler,existingItemUrls;
		var client = new elasticsearch.Client({host: 'localhost:9200'});
		client.search({
			index: 'crawler',
			type: 'subscription',
			body: {"query":{"match":{"_id":obj.subscriptionId}}}
		}).then(function (resp) {
			var hits = resp.hits.hits;
			if(!hits.length){
				return new Error('subscription not found');
			}
			return hits[0];
		})
		.then(function(hit){
			subscription = hit
			io.emit('crawler',{'msg':'located subscription',subscription:subscription})
			return client.search({
				index: 'crawler',
				type: 'common',
				body: {"query":{"match":{"_id":hit._source.crawlerId}}}
			});
		})
		.then(function(resp){
			var hits = resp.hits.hits;
			if(!hits.length){
				return new Error('crawleer not found');
			}
			crawler = hits[0];
			io.emit('crawler',{'msg':'located crawler',crawler:crawler})
		})
		
		// get existing subscription
		.then(function(){
			return client.search({
				index: 'crawler',
				type: 'subscriptionItem',
				body: {
					"query":{"match":{"collectionName":subscription._source.collectionName}},
					size: 10000,
					fields:['remoteUrl']
				}
			});
		})
		.then(function(existingItems){
			existingItemUrls = _.uniq(_.reduce(existingItems.hits.hits,function(urls,item){
				urls.push(item.fields.remoteUrl[0]); return urls;
			},[]))
			io.emit('crawler',{'msg':'existing Items',data:existingItemUrls})
		})

		// get remote collection
		.then(function(){
			var collectionUrl = subscription._source.collectionUrl,
			crawlerRule = JSON.parse(crawler._source.collectionRule)
			return self.fetch(collectionUrl,crawlerRule)
		})
		.then(function(data){
			io.emit('crawler',{'msg':'resolved remote collection page',data:data})
			var crawlerRule = JSON.parse(crawler._source.itemRule)
			if(data.links && data.links.length){
				for(var i=0; i<data.links.length; i++){
					var linkItem = data.links[i];
					var itemUrl = self.combineUrl(linkItem.link,subscription._source.collectionUrl);
					var itemTitle = linkItem.title
					if(existingItemUrls.indexOf(itemUrl) >= 0){
						console.log('skipped '+itemUrl)
						continue;
					}
					self.fetch(itemUrl,crawlerRule)
					.then(function(itemData){
						var body = _.extend({
							subscriptionId: subscription._id,
							collectionName: subscription._source.collectionName,
							title: itemTitle
						},itemData);
						client.index({index: 'crawler', type: 'subscriptionItem', body: body});
						io.emit('crawler',{
							'msg':'resolved remote item page '+itemData.remoteUrl,
							progress:{index:i,total:data.links.length},
							data:body
						})
					})
				}
			}
		})
		.catch(function(err){
			console.trace(err.message);
			console.log(err);
		})
		//io.emit('crawler',{'msg':'from server','request':obj})
	},
}
module.exports = exports = self
