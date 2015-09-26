var Promise = require('promise');
var redis = require("redis");
var name;

function Queue(_name) {
	name = _name;
}
Queue.prototype = {
	remove: function(targetIndex) {
		return this.allFromQueue()
			.then(function(all) {
				var client = redis.createClient();
				var theOneToRemove = JSON.stringify(all[targetIndex]);
				if (!theOneToRemove) {
					throw 'index of ' + targetIndex + ' not found';
				}
				client.lrem(name, 1, theOneToRemove, function(e, obj) {
					if (e) {
						//res.status(500).json(e);
						client.quit();
						throw e;
					} else {
						client.quit();
						return obj;
					}
				});
			});
	},
	push: function(data) {
		var client = redis.createClient();
		return new Promise(function(resolve, reject) {
			client.rpush(name, JSON.stringify(data), function(e, obj) {
				if (e) {
					throw e;
				}
				client.quit();
				console.log(obj);
				resolve(obj);
			});
		});
	},
	allFromQueue: function() {
		var client = redis.createClient();
		return new Promise(function(resolve, reject) {
			client.lrange(name, 0, 10000, function(e, obj) {
				client.quit();
				if (e) {
					return reject(e);
				}
				var out = _.reduce(obj, function(list, item) {
					list.push(JSON.parse(item));
					return list;
				}, []);
				resolve(out);
			});
		});
	}
};
module.exports = Queue;
