define([
	'jquery',
	'backbone',
	'underscore'
],function($,backbone,_){
	return Backbone.Model.extend({
		defaults:{
			total: 100,
			index: 1,
			size: 5
		},
		objectForRender: function()
		{
			var vars = {}, links = []
			var index = this.get('index');
			var total = this.get('total');
			var size = this.get('size');
			vars.total = total;
			if(index>1){
				vars.prev = parseInt(index-1)+'.html'
			}
			if(index<total){
				vars.next = parseInt(index+1)+'.html'
			}
			var begin = Math.max(1,index-Math.floor(size/2))
			var end = Math.min(begin+size-1,total)
			if(end==total){
				begin = Math.max(1,end-size+1);
			}
			for(i=begin; i<=end; i++){
				links.push({
					content: i,
					href: i+'.html',
					class: i == index ? 'active' : ''
				})
			}
			vars.links = links;
			return vars;
		}
	})
})

