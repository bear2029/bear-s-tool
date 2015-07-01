define([
	'jquery',
	'backbone',
	'underscore'
],function($,Backbone,_){
	'use strict'
	return Backbone.View.extend({
		events:{
			'submit': function(e){
				e.preventDefault()
				var url = this.$el.attr('action') + '/'
				url += encodeURIComponent(this.$el[0].elements.term.value)
				url += '/1.html';
				location.pathname = url;
			}
		}
	})
})
