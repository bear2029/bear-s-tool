require.config({
	paths: {
		//modernizr: 'modernizr.custom.56433.js',
		bear: 'lib/bear',
		handlebars: 'handlebars-v3.0.3',
		jquery: 'jquery-2.1.3.min',
		underscore: 'underscore-min',
		backbone: 'backbone'
	}
});

var isCollectionPage = location.pathname.match(/^\/subscription\//)
var isSearchPage = location.pathname.match(/^\/searchCollection\//)
var init,paths = ['jquery','lib/view/hdUtil','lib/view/searchBar'];
if(isCollectionPage){
	paths.push('collection')
	init = _.partial(require,'collection')
}else if(isSearchPage){
	paths.push('search')
	init = _.partial(require,'seach')
}

requirejs(paths, function($,HdUtilView,SearchBarView) {
	var hdUtilView = new HdUtilView({id: '#header-utils'})
	$('form.search-collection').each(function(i,e){
		new SearchBarView({el:$(e)})
	})
	if(init){
		init()
	}
});
