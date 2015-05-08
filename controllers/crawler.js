var fsp = require('fs-promise');
var striptags = require('striptags');
var request = require('request');
var cheerio = require('cheerio');
var batch = require('../lib/batch');
var gbk = require('gbk');
var elasticsearch = require('elasticsearch');
var Promise = require('promise');
var client, debug = false;
Number.prototype.padLeft = function(base,chr){
	var  len = (String(base || 10).length - String(this).length)+1;
	return len > 0? new Array(len).join(chr || '0')+this : this;
};
var formatDate = function(d)
{
	dformat = [ (d.getMonth()+1).padLeft(),
	d.getDate().padLeft(),
	d.getFullYear()].join('/')+ ' ' +
	[ d.getHours().padLeft(),
	d.getMinutes().padLeft(),
	d.getSeconds().padLeft()].join(':');
	return dformat;
};


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
	writeFile: function(data)
	{
		return fsp.writeFile(data.fileName,data.buff)
	},
	writeFiles: function(dataSet)
	{
		return Promise.all(data.map())
	},
	archive: function(req,res)
	{/*{{{*/
		var exec = require('child_process').exec, child;
		var fs = require('fs'),size = 5
		var dirpath = global.appRoot+'/tmp/crawler.'+req.params.id+'/';
		try{
			fs.mkdirSync(dirpath)
		}catch(e){}
		try{
			var files = fs.readdirSync(dirpath)
			_.map(files,function(path){
				fs.unlinkSync(dirpath+path)	
			})
		}catch(e){}
		client = new elasticsearch.Client({
			log: 'trace',
			host: 'localhost:9200'
		});
		client.search({
			index: 'crawler',
			type: 'subscriptionItem',
			body: {
				"query":{"match":{"collectionName":req.params.id}},
				sort:['index'],
				size: 3000
			}
		})
		.then(function(data){
			var dataSet = [];
			var items = _.reduce(data.hits.hits,function(items,item){
				items.push(item._source);
				return items
			},[]);
			var buff = ''
			for(var i=0; i<items.length; i++){
				buff += items[i].title + "\n" + items[i].body + "\n\n"
				if((i+1) % size == 0 || i == items.length-1){
					dataSet.push({fileNmae: dirpath+(i-size+1)+'-'+i+'.txt',buff: buff})
					buff = '';
				}
			}
			return self.writeFiles(dataSet)
		})
		.catch(function(e){
			res.status(400).send(e)
		})
		.done(function(){
			child = exec('cd '+global.appRoot+'/tmp/; zip '+req.params.id+' crawler.'+req.params.id+'/*',function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}else{
					res.sendfile(global.appRoot+'/tmp/'+req.params.id+'.zip')
				}
			});
		})
	},/*}}}*/
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
		var subscription = 'ss',
			crawler,
			existingItemUrls,
			itemTitlePerUrl = {},
			allItemUrls = []; // for index
		client = new elasticsearch.Client({
			//log: 'trace',
			host: 'localhost:9200'
		});
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
		.then(function(theSubscription){
			subscription = theSubscription
			io.emit('crawler',{'msg':'located subscription',subscription:subscription})
			return client.search({
				index: 'crawler',
				type: 'common',
				body: {"query":{"match":{"_id":subscription._source.crawlerId}}}
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
		.then(self.collectRemoteUrlsFromSearchedFields)

		// get remote collection
		.then(function(_existingItemUrls){
			existingItemUrls = _existingItemUrls
			var collectionUrl = subscription._source.collectionUrl,
			crawlerRule = JSON.parse(crawler._source.collectionRule)
			return self.fetch(collectionUrl,crawlerRule)
		})
		.then(function(data){
			io.emit('crawler',{'msg':'resolved remote collection page',data:data,existingItemUrls:existingItemUrls})
			var crawlerRule = JSON.parse(crawler._source.itemRule)
			if(!data.links || !data.links.length){
				return new Error('nothing returned from collection page')
			}
			if(debug) data.links = data.links.splice(0,12)
			data.links = _.reduce(data.links,function(list,item){
				item.link = self.combineUrl(item.link,subscription._source.collectionUrl)
				allItemUrls.push(item.link);
				itemTitlePerUrl[item.link] = item.title;
				for(var i=0; i<existingItemUrls.length; i++){
					if(existingItemUrls[i].match(new RegExp(item.link))){
						return list
					}
				}
				list.push(item)
				return list;
			},[])
			return self.fetchEveryItem(data,subscription,crawlerRule);
		})
		.then(function(fetchResults){return Promise.resolve(self.indexFetchedSubscriptionItems(client, subscription, allItemUrls, itemTitlePerUrl,fetchResults))})
		.then(_.partial( self.crawlComplete, allItemUrls))
		.catch(function(err){
			console.trace(err);
		})
	},
	crawlComplete: function(allItemUrls,data)
	{/*{{{*/
		io.emit('crawler',{'msg':'all done', lastUpdate: formatDate(new Date()), count: allItemUrls.length })
	},/*}}}*/
	indexFetchedSubscriptionItems: function(client, subscription, allItemUrls, itemTitlePerUrl, fetchResults){
		var promises = [];
		io.emit('crawler',{'msg':'resolved item pagese',count:fetchResults.length})
		var indexParams = _.reduce(fetchResults,function(list,itemData){
			var body = _.extend({
				index: allItemUrls.indexOf(itemData.remoteUrl),
				subscriptionId: subscription._id,
				collectionName: subscription._source.collectionName,
				title: itemTitlePerUrl[itemData.remoteUrl],
				lastUpdate: parseInt(new Date().getTime()/1000)
			},itemData);
			list.push([{index: 'crawler', type: 'subscriptionItem', body: body}]);
			return list;
		},[])
		return batch(indexParams,function(param){
			io.emit('crawler',{'msg':'indexing item',param:param})
			client.index(param)
		},10,0)
	},
	fetchEveryItem: function(data,subscription,crawlerRule)
	{/*{{{*/
		var items = [];
		var titlePerUrl = {};
		var loopCount = 0;
		io.emit('crawler',{'msg':'crawling '+data.links.length+' items'})
		for(var i=0; i<data.links.length; i++){
			var linkItem = data.links[i];
			items.push([linkItem.link,crawlerRule])
		}
		return batch(items,self.fetch,5,0);
	},/*}}}*/
	collectRemoteUrlsFromSearchedFields: function(existingItems){
		existingItemUrls = _.uniq(_.reduce(existingItems.hits.hits,function(urls,item){
			urls.push(item.fields.remoteUrl[0]); return urls;
		},[]))
		return existingItemUrls;
	}
}
module.exports = exports = self
