define([
	'backbone',
	'underscore'
],
function(Backbone,_){
	return Backbone.Model.extend({
		initialize: function(){
			var term = this.get('term')
			var collectionName = this.get('collectionName')
			this.urlRoot = '/searchCollection/'+collectionName+'/'+term;
		}
	})
})
