var date = require('s-date');
var _ = require('underscore');
var QueueController = require('../lib/redisQueue');
var queue = new QueueController('ip');

function digest(req) {
	var data = {
		ip: req.query.ip,
		time: new Date().getTime(),
		host: req.query.host
	};
	return data;
}

function cacheData(data) {
	return queue.push(data);
}

function dumpData() {
	return queue.allFromQueue();
}
var Collector = {
	post: function(req, res) {
		var diggestedData = digest(req)
		cacheData(diggestedData)
			.then(function(data) {
				res.json(data);
			})
			.catch(function(e) {
				console.log(e);
				res.status(500).json(e);
			});
	},
	display: function(req, res, next) {
		dumpData()
			.then(function(list) {
				req.vars = {
					list: _.map(list, function(item) {
						item.time = date('{yyyy}/{mm}/{dd} {hh24}:{Minutes}', new Date(item.time));
						return item;
					}).reverse()
				};
				res.templateName = 'ipCollector';
				next();
			})
			.catch(function(e) {
				res.status(500).json(e);
			});
	}
};
module.exports = Collector;
