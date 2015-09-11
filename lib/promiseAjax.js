var Promise = require('promise');
var $ = require('jquery');
var Ajax = {
	delete:function(url,data)
	{
		return this.post(url,data,'DELETE');
	},
	post:function(url,data)
	{
		var method = arguments[2] || 'POST';
		return new Promise(function(resolve,reject){
			$.ajax({
				method: method,
				url: url,
				data: JSON.stringify(data),
				processData: false,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(jqXHR.responseJSON));
			});
		});
	},
	get:function(url)
	{
		return new Promise(function(resolve,reject){
			$.ajax({
				method: "GET",
				url: url,
				contentType: 'application/json'
			}).done(function(msg) {
				resolve(msg);
			}).fail(function(jqXHR, textStatus, errorThrown){
				reject(new Error(errorThrown));
			});
		});
	}
};

module.exports = Ajax;
