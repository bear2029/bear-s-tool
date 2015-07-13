define([
	'jquery',
	'underscore',
	'lib/store'
],function($,_,store)
{
	var data;
	function convertUrl(href,keepExtension)
	{
		var pageNum;
		if(!keepExtension){
			pageNum = href.replace(/(.*\/)*(\d+)\.html/,'$2');
		}else{
			pageNum = href;
		}
		return location.pathname.replace(/\d+\.html$/,pageNum);
	}
	var bodyParagraphs = [];
	return _.extend({
		data: {},
		init: function(initData,appRouter)
		{
			this.appRouter = appRouter;
			data = initData;
			this.appRouter.on('route:article',function(name,pg){this.fetchNewPage(pg);}.bind(this));
		},
		navigate: function(href)
		{
			this.appRouter.navigate(convertUrl(href,true));
			this.fetchNewPage(href);
		},
		hilight: function(index)
		{
			data.speechHilightIndex = index;
			this.trigger('change');
		},
		dehilight: function(index)
		{
			data.speechHilightIndex = -1;
			this.trigger('change');
		},

		gotoNextPage: function()
		{
			//todo, expected promise
		},
		fetchNewPage: function(href)
		{
			// expecting 1.html
			$.ajax({
				method: 'get',
				url: convertUrl(href)
			})
			.then(function(_data){
				data = _.clone(_data);
				this.trigger('pageChange');
			}.bind(this));
		},
		get state(){
			return data;
		},
		get bodyParagraphs(){
			if(this.state.body && _.isString(this.state.body)){
				bodyParagraphs = this.state.body.split("\n");
			}
			return bodyParagraphs;
		}
	},store);
})
