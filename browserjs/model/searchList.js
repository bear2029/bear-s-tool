var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
	initialize: function(){
		var term = this.get('term')
		var collectionName = this.get('collectionName')
		this.urlRoot = '/searchCollection/'+collectionName+'/'+term;
	}
});
