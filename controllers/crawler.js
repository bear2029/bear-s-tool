var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var gbk = require('gbk');
var elasticsearch = require('elasticsearch');
var Promise = require('promise');

function fetch (url,rule)
{
	return new Promise(function(resolve,reject){
		try{
			gbk.fetch(url).to('string', function(error,body){
				if (!error) {
					var data = {}
					var $ = cheerio.load(body);
					for(var key in rule){
						try{
							data[key] = eval(rule[key])
						}catch(e){
							reject(new Error('parsing error: '+e));
						}
					}
					resolve(data);
				}else{
					reject(new Error('connection error: '+error));
				}
			})
		}catch(e){
			reject(new Error('unknown error: '+e));
		}
	});
}

module.exports = {
	home: function(req,res)
	{
		res.render('crawlerHome',{});
	},
	subscribe: function(req,res)
	{
		res.render('crawlerSubscribe',{crawlerId:req.params.id});
	},
	scriptTester: function(req,res)
	{
		try{
			var testUrl = req.body.testUrl;
			var testRule = req.body.testRule;
			console.log(testRule)
			//request({url: testUrl,gzip: true}, function (error, response, body) {
			gbk.fetch(testUrl).to('string', function(error,body){
				//body = gbk.toString('utf-8', body);
				if (!error) {
					var data = {}
					var $ = cheerio.load(body);
					for(var key in testRule){
						//console.log(testRule[key]);
						try{
							data[key] = eval(testRule[key])
							console.log(data[key]);
						}catch(e){
							res.status(400).json('parsing error: '+e);
							return
						}
					}
					res.json(util.inspect(data));
				}else{
					res.status(400).json(error);
				}
			})
		}catch(e){
			res.status(400).send('bad reuest (check your resquest body)')
		}
	},
	crawl: function(io,obj)
	{
		var subscription,crawler;
		var client = new elasticsearch.Client({host: 'localhost:9200',log: 'trace'});
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
		.then(function(){
			var collectionUrl = subscription._source.collectionUrl,
			crawlerRule = JSON.parse(crawler._source.collectionRule)
			return fetch(collectionUrl,crawlerRule)
		})
		.then(function(data){
			io.emit('crawler',{'msg':'resolved remote collection page',data:data})
			if(data.links && data.links.length){
				for(var i=0; i<data.links.length; i++){
					//todo
					console.log(data.links[i]);
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
