var redis = require('redis'),
client = redis.createClient();

var controller = {
	default: function (req, res, next) {
		console.log(12312313);
		res.render(req.path.substr(1,req.path.length-1),{
			req: req
		});
	},
	dictionaryWrapper: function(req,res)
	{/*{{{*/
		var redis = require("redis");
		var client = redis.createClient();
		var cacheKey = 'get:'+req.path;
		client.get(cacheKey,function(error,cache){
			if(!error && cache){
				console.log('from client');
				res.json(JSON.parse(cache));
				client.quit()
				return
			}
			var words = req.params.words.split('');
			var requests = _.reduce(words,function(list,word){
				list.push(bear.promiseFetch('https://www.moedict.tw/a/'+word+'.json'));
				return list
			}.bind(this),[])
			Promise.all(requests)
			.then(function (body) {
				var json = _.reduce(body,function(list,item){
					item = item.replace(/[`~]/g,'')
					item = JSON.parse(item);
					list[item.t] = item
					return list
				},{})
				client.set(cacheKey,JSON.stringify(json));
				console.log('set client',cacheKey,JSON.stringify(json)); 
				client.quit()
				res.json(json)
			})
			.catch(function(e){
				res.status(400).json({});
			})
		}.bind(this))
	},/*}}}*/
	home: function (req, res, next) {
		var subscription = require('../lib/subscription')
		subscription.getAllSubscriptionByUpdate()
		.then(function(o){
			//res.json(o);return;
			res.render('home',{
				req: req,
				title:'home page2',
				headerTitle: 'Welcome to Ecomerce',
				summaries: o,
			})
		})
		.catch(function(e){
			console.log(e)
			res.status(400).send('something wrong')
		})
	},
	allFromQueue: function(name)
	{
		var redis = require("redis"),
		client = redis.createClient();
		return new Promise(function(resolve,reject){
			client.lrange(name,0,100,function(e,obj){
				client.quit();
				if(e){
					return reject(e)
				}
				var out = _.reduce(obj,function(list,item){
					list.push(JSON.parse(item));
					return list;
				},[])
				resolve(out);
			})
		})
	},
	dumpQueue: function(req,res)
	{
		this.allFromQueue(req.params.name)
		.then(function(out){
			for(var i=0; i<out.length; i++){
				out[i].id = i;
			}
			res.json(out);
		})
	},
	removeFromQueue: function(req,res)
	{
		this.allFromQueue(req.params.name)
		.then(function(all){
			var theOneToRemove = JSON.stringify(all[req.params.index]);
			if(!theOneToRemove){
				res.status(404).send('index of '+req.params.index + ' not found');
				return;
			}
			client.lrem(req.params.name,1,theOneToRemove,function(e,obj){
				if(e){
					res.status(500).json(e);
				}else{
					res.json(obj);
				}
			})
		})
	},
	pushQueue: function(req,res)
	{
		var redis = require("redis"),
		client = redis.createClient();
		client.rpush(req.params.name, JSON.stringify(req.body),function(e,obj){
			if(e){
				res.json(e);
				return;
			}
			res.json(obj);
			client.quit();
		});
		return;
	},
	name: function (req, res, next) {
		res.render('name',{
			req: req,
			title:'home page2',
			headerTitle: 'Welcome to Ecomerce',
			vowels: ['ey','y','a','o','u','ine','ia','ai'],
			consonants: ['b','p','m','f','d','t','n','l','g','k','h','ch','sh','z','ts','s','tr','j'],
			nameBases:require('../lib/nameBase')
		});
	}
};

module.exports = exports = controller;
