var Ajax = require('../../lib/promiseAjax');
var _ = require('underscore');
var reflux = require('reflux');
var CrawlerAction = require('../actions/crawlerAction.js');
var bear = require('../../lib/bear');
var json2html = require('json-to-html');
var assign = require('object-assign');

var searchHost, editingCrawlerId;
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
		isItemUrlValid: null,
		collectionRule: '{"title":"$(\'h1\').text()","links":"_.reduce($(\'#tbchapterlist a\'),function(list,item){var el=$(item);var link={title:el.text(),link:el.attr(\'href\')};list.push(link);return list},[])"}',
		itemRule: '{"body":"_.reduce($(\'article p\'),function(sum,item){sum+=$(item).text()+\"\\n\";return sum;},\'\')"}'
	};
}
function getCurrentEditorState(id)
{
	// todo, validation status need to be regit
	return assign(getDefaultEditorState(),_.findWhere(data.crawlers,{id:id}));
}

var Store = reflux.createStore({
	listenables: CrawlerAction,
	init: function() {
		this.loadCrawler();
	},
	emitChange: function() {
		this.trigger(data);
	},
    	loadCrawler: function()
	{
		var collectionList;
		return Ajax.get('/novel-api/crawlers/')
		.then(function(res){
			 var items = _.map(res,function(_item){
				console.log(_item);
				var item = {
					id: _item.id,
					siteName: _item.name,
					collectionUrl: _item.test_list_url,
					itemUrl: _item.test_item_url,
					collectionRule: _item.list_url_pattern,
					itemRule: _item.item_url_pattern
				};
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
	syncEditorState: function(editorStateFromView)
	{
		data.editor = editorStateFromView;
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
	 	Ajax.delete('/novel-api/crawlers/'+id)
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
		this.emitChange();
	},
	displayErrorOnConsole: function(e){
		data.editor.isErrorOnConsole = true;
		data.editor.consoleHtml = e.message;
		this.emitChange();
	},
	submitEdit: function(formData)
	{
		var isNew = !formData.id, method = 'post';
		var _requestBody = _.reduce(formData,function(newObj,value,key){
			newObj[bear.dashToCamel(key)] = value;
			return newObj;
		},{});
		var requestBody = {
			id: _requestBody.id,
			name: _requestBody.siteName,
			test_list_url: _requestBody.collectionUrl,
			test_item_url: _requestBody.itemUrl,
			list_url_pattern: _requestBody.collectionRule,
			item_url_pattern: _requestBody.itemRule
		};
		console.log(formData,_requestBody,requestBody);
		data.editor = _.extend(data.editor,_requestBody);
		this.emitChange();
		var url = "/novel-api/crawlers";
		if(requestBody.id){
			url += '/' + requestBody.id;
			method = 'put';
		}
		return Ajax[method](url,requestBody)
		.then(function(res){
			if(isNew){
				data.crawlers.push(assign(requestBody,{id:res._id}));
			}
			data.editor.isEditing = false;
			editingCrawlerId = null;
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
