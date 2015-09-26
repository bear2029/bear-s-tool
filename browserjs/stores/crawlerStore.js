var Ajax = require('../../lib/promiseAjax');
var _ = require('underscore');
var reflux = require('reflux');
var CrawlerActions = require('../actions/crawlerActions.js');
var bear = require('../../lib/bear');

var searchHost = '/es', editingCrawlerId;
var data = {
	crawlers: [],
	isEditing: false,
	isErrorOnConsole: null,
	consoleHtml: '',
	isCollectionUrlValid: null,
	isItemUrlValid: null
};

var bodyParagraphs = [];

var Store = reflux.createStore({
	listenables: CrawlerActions,
	init: function() {
		this.loadCrawler();
	},
    	status: function()
	{
		return data;
	},
	emitChange: function() {
		this.trigger(data);
	},
    	loadCrawler: function()
	{
		var collectionList;
		return Ajax.post(searchHost+'/crawler/common/_search',{size:1000})
		.then(function(res){
			 console.log('crawler loaded',res)
			 var items = _.map(_.filter(res.hits.hits,function(_item){
				if(_item._source && _item._source.siteName){
					return true;
				}
			}),function(_item){
				var item = {};
				item.id = _item._id;
				item = Object.assign(item,_item._source);
				return item;
			});
			data.crawlers = items;
			this.emitChange();
		}.bind(this)).catch(function(e){
			console.log('error occurred while fetch crawler:',e);
			return [];
		});
	},
	add: function()
	{
		data.isEditing = true;
		this.emitChange();
	},
	validateUrl: function(testType,regexString,url)
	{
		var isValid = false;
		var regex = new RegExp(regexString);
		isValid = url.match(regex);
		switch(testType){
			case 'list':
				data.isCollectionUrlValid = isValid;
				break;
			case 'item':
				data.isItemUrlValid = isValid;
				break;
			default: 
				throw new Error('Un-expected test type: "'+testType+'"');
		}
		this.emitChange();
	},
	del: function(id)
	{
		//todo
		this.emitChange();
	},
	startEdit: function(id)
	{
		data.isEditing = true;
		this.emitChange();
	},
	testScript: function(url,rule)
	{
		try{
			rule = JSON.parse(rule);
			console.log(url,rule)
			Ajax.post('/crawler/scriptTester',{
				testUrl: url,
				testRule: rule
			}).then(this.outputResultOnConsole ,this.displayErrorOnConsole);
		}catch(e){
			this.displayErrorOnConsole(e)
		}
	},   
	outputResultOnConsole: function(e){
		data.isErrorOnConsole = false
		data.consoleHtml = JSON.stringify(e);
		this.emitChange();
	},
	displayErrorOnConsole: function(e){
		data.isErrorOnConsole = true;
		data.consoleHtml = e.message;
		this.emitChange();
	},
	submitEdit: function(formData)
	{
		console.log(1,data.crawlers.length);
		var requestBody = _.reduce(formData,function(newObj,value,key){
			newObj[bear.dashToCamel(key)] = value;
			return newObj;
		},{});
		var url = searchHost+"/crawler/common";
		if(requestBody.id){
			url += '/' + requestBody.id;
		}
		return Ajax.post(url,requestBody)
		.then(function(res){
			data.isEditing = false;
			editingCrawlerId = null;
			console.log('new crawler added:',res);
		}.bind(this))
		.then(bear.wait)
		.then(this.loadCrawler)
		.catch(function(e){
			console.log('catch',e);
		})
	},
	endEdit: function()
	{
		data.isEditing = false;
		editingCrawlerId = null;
		this.emitChange();
	},
	state: function() {
		return data;
	}
});

// Store.init();

module.exports = Store;
