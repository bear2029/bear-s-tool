var redis = require('redis'),
	client = redis.createClient();

var controller = {
	dictionaryWrapper: function(req, res) { /*{{{*/
		var redis = require("redis");
		var client = redis.createClient();
		var cacheKey = 'get:' + req.path;
		client.get(cacheKey, function(error, cache) {
			if (!error && cache) {
				console.log('from client');
				res.json(JSON.parse(cache));
				client.quit()
				return
			}
			var words = req.params.words.split('');
			var requests = _.reduce(words, function(list, word) {
				list.push(bear.promiseFetch('https://www.moedict.tw/a/' + word + '.json'));
				return list
			}.bind(this), [])
			Promise.all(requests)
				.then(function(body) {
					var json = _.reduce(body, function(list, item) {
						item = item.replace(/[`~]/g, '')
						item = JSON.parse(item);
						list[item.t] = item
						return list
					}, {})
					client.set(cacheKey, JSON.stringify(json));
					console.log('set client', cacheKey, JSON.stringify(json));
					client.quit()
					res.json(json)
				})
				.catch(function(e) {
					res.status(400).json({});
				})
		}.bind(this))
	},
	/*}}}*/
	home: function(req, res, next) {
		var subscription = require('../lib/subscription')
		req.templateName = 'home';
		subscription.getAllSubscriptionByUpdate()
			.then(function(o) {
				//res.json(o);return;
				req.vars = {
					headerTitle: 'Welcome to Ecomerce',
					summaries: o
				};
				return subscription.getCollections();
			})
			.then(function(o){
				req.vars.collections = [];
				if(o.hits.total > 0){
					req.vars.collections = o.hits.hits;
				}
				next();
			})
			.catch(function(e) {
				console.log(e)
				res.status(400).send('something wrong')
			})
	},
	dumpQueue: function(req, res) {
		var QueueController = require('../lib/redisQueue');
		var queueController = new QueueController(req.params.name);
		console.log(queueController);
		queueController.allFromQueue()
			.then(function(out) {
				for (var i = 0; i < out.length; i++) {
					out[i].id = i;
				}
				res.json(out);
			})
			.catch(function(e) {
				res.status(404).send('bad');
			})
	},
	removeFromQueue: function(req, res) {
		var QueueController = require('../lib/redisQueue');
		var queueController = new QueueController(req.params.name);
		queueController.remove(req.params.index)
			.then(function(obj) {
				res.json(obj);
			})
			.catch(function(e) {
				console.log(e);
				res.status(500).json(e);
			});
	},
	pushQueue: function(req, res) {
		var QueueController = require('../lib/redisQueue');
		var queueController = new QueueController(req.params.name);
		queueController.push(req.body)
			.then(res.json)
			.catch(function(e) {
				res.json(e);
			})
	},
	name: function(req, res, next) {
		res.render('name', {
			req: req,
			title: 'home page2',
			headerTitle: 'Welcome to Ecomerce',
			vowels: ['ey', 'y', 'a', 'o', 'u', 'ine', 'ia', 'ai'],
			consonants: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'ch', 'sh', 'z', 'ts', 's', 'tr', 'j'],
			nameBases: require('../lib/nameBase')
		});
	}
};

module.exports = exports = controller;
