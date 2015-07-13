define([],function(){
	return {
		events: {},
		trigger: function(eventName,params)
		{
			if(!this.events[eventName] && !_.isArray(this.events[eventName])){
				return;
			}
			_.each(this.events[eventName],function(fn){
				fn();
			});
		},
		observe: function(eventName,callBack)
		{
			if(!this.events[eventName]){
				this.events[eventName] = [callBack];
			}else{
				this.events[eventName].push(callBack);
			}
		},
		stopObserving: function(eventName,callBack)
		{
			if(!this.events[eventName]){
				return;
			}
			if(!callBack){
				delete this.events[eventName];
			}
			var i = this.events[eventName].indexOf(callBack);
			if(i){
				this.events[eventName].splice(i,1);
			}
		}
	}
});
