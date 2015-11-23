var Reflux = require('reflux');

var subscriptionActions = Reflux.createActions([
	"edit",
	"add",
	"del",
	"closeEditor",
	"editorSubmit",
	'update',
	'syncOnDropbox'
]);

module.exports = subscriptionActions;
