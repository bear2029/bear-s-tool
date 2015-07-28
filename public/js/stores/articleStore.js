define([
	'jquery',
	'underscore',
	'lib/tracker',
	'lib/store',
	'lib/storageWrapper'
],function($,_,tracker,store,storage)
{
	var data, loading = false;
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
		DISPLAY_LAYOUT:{
			'VERTICAL': 1,
			'HORIZONTAL': 0
		},
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
			loading = true;
			this.trigger('change');
			// expecting 1.html
			return $.ajax({
				accepts: 'application/json; charset=utf-8',
				method: 'get',
				url: formalizeUrl(href)
			})
			.then(function(_data){
				loading = false;
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
		setLayout: function(val)
		{
			if(storage.isWorking()){
				storage.set(storage.STORAGE_DISPLAY_LAYOUT,val);
				this.trigger('change');
			}
		},
		getLayout: function()
		{
			var layout = this.DISPLAY_LAYOUT.HORIZONTAL;
			if(storage.isWorking()){
				layout = storage.get(storage.STORAGE_DISPLAY_LAYOUT);
				if(!layout || layout == 'undefined'){
					layout = this.DISPLAY_LAYOUT.HORIZONTAL;
					storage.set(storage.STORAGE_DISPLAY_LAYOUT,layout);
				}
			}
			return layout;
		},
		get state(){
			data.loading = loading;
			data.displayLayout = this.getLayout();
			return data;
		},
		get bodyParagraphs(){
			if(this.state._body && _.isString(this.state._body)){
				bodyParagraphs = this.state._body.split("\n");
			}
			return bodyParagraphs;
		}
	},store);
})
