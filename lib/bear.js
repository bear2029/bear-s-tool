var allHosts = {
	dev: {
		http: 'http://bear.ddns.net:8080',
		https: 'https://bear.ddns.net:8081'
	},
	prod: {
		http: 'http://bear.ddns.net',
		https: 'https://bear.ddns.net'
	}
};
var bear = {
	observe: function(el, eventName) {
		var Promise = require('promise');
		return new Promise(function(resolve, reject) {
			el.on(eventName, function(e) {
				resolve(el, e);
			});
		});
	},
	isLoginPage: function() {
		// /member/signin
		return location.pathname.match(/^\/member\/signin/) !== null;
	},
	promiseFetch: function(url) {
		var Promise = require('promise');
		var request = require('request');
		return new Promise(function(resolve, reject) {
			request(url, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					resolve(body);
				} else {
					reject(error);
				}
			});
		});
	},
	getHosts: function(env) {
		return allHosts[env];
	},
};
module.exports = exports = bear;
