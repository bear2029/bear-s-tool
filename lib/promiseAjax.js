var Promise = require('promise');
var $,beta = false;
if(!beta){
	$ = require('jquery');
}
var Ajax = {
	delete:function(url,data)
	{
		return this.post(url,data,'DELETE');
	},
	post:function(url,data)
	{
		var method = arguments[2] || 'POST';
		return new Promise(function(resolve,reject){
			if(beta){
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", function(res){
					try{
						resolve(JSON.parse(res.target.responseText));
					}catch(e){
						reject(new Error(e));
					}
				});
				oReq.addEventListener("error", reject);
				oReq.addEventListener("timeout", reject);
				oReq.open("POST", url);
				oReq.setRequestHeader('Content-type','application/json');
				oReq.send(JSON.stringify(data));
			}else{
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
			}
		});
	},
	get:function(url)
	{
		return new Promise(function(resolve,reject){
			if(beta){
				var oReq = new XMLHttpRequest();
				oReq.addEventListener("load", function(res){
					try{
						resolve(JSON.parse(res.target.responseText));
					}catch(e){
						reject(new Error(e));
					}
				});
				oReq.addEventListener("error", reject);
				oReq.addEventListener("timeout", reject);
				oReq.open("GET", url);
				oReq.setRequestHeader('Content-type','application/json');
				oReq.send();
			}else{
				$.ajax({
					method: "GET",
					url: url,
					contentType: 'application/json'
				}).done(function(msg) {
					resolve(msg);
				}).fail(function(jqXHR, textStatus, errorThrown){
					reject(new Error(errorThrown));
				});
			}
		});
	}
};

module.exports = Ajax;
