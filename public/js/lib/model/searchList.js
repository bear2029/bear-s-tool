define([
	'backbone',
	'underscore'
],
function(Backbone,_){
	return Backbone.Model.extend({
		initialize: function(){
			var term = this.get('term')
			this.urlRoot = '/searchCollection/'+term;
		}
	})
})
