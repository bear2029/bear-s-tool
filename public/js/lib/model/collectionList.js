define([
	'backbone',
	'underscore'
],
function(Backbone,_){
	return Backbone.Model.extend({
		initialize: function(){
			var collectionName = this.get('collection').name
			this.urlRoot = '/subscription/'+collectionName;
		}
	})
})
