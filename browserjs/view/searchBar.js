var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var storageWrapper = require('../../lib/storageWrapper');

var SearchBarView = Backbone.View.extend({
	initialize: function() {
		var lastSearchedCollection, $selector = $(this.$el[0].elements.collection);
		if (!$selector) {
			return;
		}
		lastSearchedCollection = storageWrapper.get('lastSearchedCollection');
		if (lastSearchedCollection) {
			$selector.val(lastSearchedCollection);
			console.log('init', $selector, lastSearchedCollection);
		}
	},
	events: {
		'change': function(e) {
			e.preventDefault();
			var $el = $(e.target);
			if ($el.attr('name') === 'collection') {
				storageWrapper.set('lastSearchedCollection', $el.val());
			}
		},
		'submit': function(e) {
			e.preventDefault();
			var url = this.$el.attr('action') + '/';
			var collectionName = $(this.$el[0].elements.collection).val();
			url += collectionName + '/';
			url += encodeURIComponent(this.$el[0].elements.term.value);
			url += '/1.html';
			location.pathname = url;
		}
	}
});
module.exports = SearchBarView;
