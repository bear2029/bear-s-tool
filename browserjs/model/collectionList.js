var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	initialize: function() {
		var collectionName = this.get('collection').name
		this.urlRoot = '/subscription/' + collectionName;
	}
});
