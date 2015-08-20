var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var HdUtilView = require('../view/hdUtil');
var SearchBarView = require('../view/searchBar');

var hdUtilView = new HdUtilView({id: '#header-utils'});
$('form.search-collection').each(function(i,e){
	new SearchBarView({el:$(e)});
});

var NaviList = Backbone.View.extend({
	initialize: function()
	{
		_.bindAll(this,'onToggle');
		$('.toggle',this.$el).on('click',this.onToggle);
	},
	onToggle: function()
	{
		$('body').toggleClass('navi-list-expend');
	}
});
$(document).ready(function(){
	var naviList = new NaviList({el: $('nav .navi-list')[0]});
});
