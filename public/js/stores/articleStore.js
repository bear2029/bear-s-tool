define([
	'jquery',
	'underscore',
	'lib/tracker',
	'lib/store'
],function($,_,tracker,store)
{
	var data;
	function formalizeUrl(href,keepExtension)
	{
		if(href.match(/^#/)){
			return location.pathname + href;
		}

		var pageNum = href.replace(/(.*\/)*(\d+)(\.html)*.*$/,'$2');
		if(keepExtension){
			pageNum += '.html'
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
			tracker.track();
		},
		navigate: function(href)
		{
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
			if(pageData.nextIndex){
				return fetchNewPage(pageData.nextIndex);
			}else{
				return Promise.reject('next page is not avaialbe');
			}
		},
		fetchNewPage: function(href)
		{
			// expecting 1.html
			return $.ajax({
				method: 'get',
				url: formalizeUrl(href)
			})
			.then(function(_data){
				data = _.clone(_data);
				this.trigger('pageChange');
				this.appRouter.navigate(formalizeUrl(href,true));
				tracker.track();
			}.bind(this));
		},
		track: function(url)
		{
			tracker.track(location.protocol+'//'+location.hostname+':'+location.port+formalizeUrl(url,true));
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
