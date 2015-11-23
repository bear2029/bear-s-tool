var redis = require('redis'),
	client = redis.createClient();

var controller = {
	dictionaryWrapper: function(req, res) { /*{{{*/
		var bear = require('../lib/bear');
		var words = req.params.words.split('');
		var requests = _.reduce(words, function(list, word) {
			console.log('fetching: https://www.moedict.tw/a/' + encodeURI(word) + '.json');
			list.push(bear.promiseFetch('https://www.moedict.tw/a/' + encodeURI(word) + '.json'));
			return list
		}.bind(this), []);
		Promise.all(requests).then(function(body) {
			console.log(120);
			var json = _.reduce(body, function(list, item) {
				console.log(121);
				item = item.replace(/[`~]/g, '')
				console.log(122);
				try{
					item = JSON.parse(item);
				}catch(e){
					console.log('json decode error',e,item);
				}
				console.log(123);
				list[item.t] = item
				console.log(124);
				return list
			}, {})
			res.json(json)
		})
		.catch(function(e) {
			console.trace(e)
			res.status(400).json({});
		})
	},
	/*}}}*/
	home: function(req, res, next) {
		req.templateName = 'home';
		next();
	},
	dumpQueue: function(req, res) {
		var QueueController = require('../lib/redisQueue');
		var queueController = new QueueController(req.params.name);
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
