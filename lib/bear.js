Number.prototype.padLeft = function(base,chr){
	var  len = (String(base || 10).length - String(this).length)+1;
	return len > 0? new Array(len).join(chr || '0')+this : this;
};
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
	formatDate: function(d)
	{
		dformat = [ (d.getMonth()+1).padLeft(),
		d.getDate().padLeft(),
		d.getFullYear()].join('/')+ ' ' +
		[ d.getHours().padLeft(),
		d.getMinutes().padLeft(),
		d.getSeconds().padLeft()].join(':');
		return dformat;
	},
	dashToCamel: function(dash)
	{
		var _ = require('underscore');
		var parts = dash.split('-');
		var camel = _.map(parts,function(part,i){
			if(i === 0){
				return part;
			}
			return part.replace(part.charAt(0),part.charAt(0).toUpperCase())
		}).join('');
		return camel;
	},
	wait: function()
	{
		var Promise = require('promise');
		return new Promise(function(resolve,reject){
			setTimeout(function(){
				resolve();
			},500);
		});
	}
};
module.exports = exports = bear;
