var Reflux = require('reflux');

var CrawlerActions = Reflux.createActions([
	"add",
	"del",
	"startEdit",
	"endEdit",
	"submitEdit",
	"validateUrl",
	'syncEditorState',
	"testScript"
]);

module.exports = CrawlerActions;
