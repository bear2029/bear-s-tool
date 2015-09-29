var Ajax = require('../../lib/promiseAjax');
var _ = require('underscore');
var reflux = require('reflux');
var CrawlerActions = require('../actions/crawlerActions.js');
var bear = require('../../lib/bear');
var json2html = require('json-to-html');

var searchHost = '/es', editingCrawlerId;
var data = {
	crawlers: [],
	consoleHtml: '',
	editor: getDefaultEditorState()
};

var bodyParagraphs = [];
function getDefaultEditorState()
{
	// todo add default crawler shit
	return {
		isEditing: false,
		consoleHtml: '',
		isErrorOnConsole: null,
		isCollectionUrlValid: null,
		isItemUrlValid: null
	};
}
function getCurrentEditorState(id)
{
	// todo, validation status need to be regit
	return Object.assign(getDefaultEditorState(),_.findWhere(data.crawlers,{id:id}));
}

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
			 var items = _.map(_.filter(res.hits.hits,function(_item){
				if(_item._source && _item._source.siteName){
					return true;
				}
			}),function(_item){
				var item = {};
				item = Object.assign(item,_item._source);
				item.id = _item._id;
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
		data.editor = getDefaultEditorState();
		data.editor.isEditing = true;
		this.emitChange();
	},
	startEdit: function(id)
	{
		data.editor = getCurrentEditorState(id);
		data.editor.isEditing = true;
		this.emitChange();
	},
	validateUrl: function(testType,regexString,url)
	{
		var isValid = false;
		var regex = new RegExp(regexString);
		isValid = url.match(regex);
		switch(testType){
			case 'collection':
				data.editor.isCollectionUrlValid = isValid;
				break;
			case 'item':
				data.editor.isItemUrlValid = isValid;
				break;
			default: 
				throw new Error('Un-expected test type: "'+testType+'"');
		}
		this.emitChange();
	},
	del: function(id)
	{
	 	Ajax.delete(searchHost+'/crawler/common/'+id)
		.then(function(){
			data.crawlers = _.filter(data.crawlers,function(crawler){
				return crawler.id !== id;
			});
			this.emitChange();
		}.bind(this));
	},
	testScript: function(url,rule)
	{
		try{
			rule = JSON.parse(rule);
			Ajax.post('/crawler/scriptTester',{
				testUrl: url,
				testRule: rule
			}).then(this.outputResultOnConsole ,this.displayErrorOnConsole);
		}catch(e){
			this.displayErrorOnConsole(e)
		}
	},   
	outputResultOnConsole: function(e){
		data.editor.isErrorOnConsole = false
		data.editor.consoleHtml = json2html(e);
		console.log(data.editor.consoleHtml);
		this.emitChange();
	},
	displayErrorOnConsole: function(e){
		data.editor.isErrorOnConsole = true;
		data.editor.consoleHtml = e.message;
		this.emitChange();
	},
	submitEdit: function(formData)
	{
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
			data.editor.isEditing = false;
			editingCrawlerId = null;
			data.crawlers.push(Object.assign(requestBody,{id:res._id}));
			this.emitChange();
		}.bind(this))
		.catch(function(e){
			console.log('catch',e);
		})
	},
	endEdit: function()
	{
		data.editor.isEditing = false;
		editingCrawlerId = null;
		this.emitChange();
	},
	state: function() {
		return data;
	}
});

// Store.init();

module.exports = Store;
