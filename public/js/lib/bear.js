define([
	'jquery'
],function($)
{
	var core = {
		observe: function(el,eventName){
			return new Promise(function(resolve,reject){
				el.on(eventName,function(e){
					resolve(el,e);
				});
			});
		},
		isLoginPage: function()
		{
			// /member/signin
			return location.pathname.match(/^\/member\/signin/) !== null;
		}
	};
	return core;
});
