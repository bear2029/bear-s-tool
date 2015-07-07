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
		}
	};
	return core;
});