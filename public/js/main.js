require.config({
	jsx: {
		fileExtension: '.jsx'
	},
	paths: {
		//modernizr: 'modernizr.custom.56433.js',
		react: "../vendor/react-with-addons",
		JSXTransformer: "../vendor/JSXTransformer",
		bear: 'lib/bear',
		handlebars: '../vendor/handlebars',
		jquery: '../vendor/jquery.min',
		underscore: '../vendor/underscore-min',
		backbone: '../vendor/backbone'
	}
});

var isCollectionItemPage = location.pathname.match(/^\/subscription\/.*\/item\/\d+.html$/);
var isCollectionPage = !isCollectionItemPage && location.pathname.match(/^\/subscription\//);
var isSearchPage = location.pathname.match(/^\/searchCollection\//);
var init,paths = ['jquery','lib/view/hdUtil','lib/view/searchBar'];
if(isCollectionItemPage){
	paths.push('jsx!collectionItem');
	init = _.partial(require,'collectionItem');
}else if(isCollectionPage){
	paths.push('collection');
	init = _.partial(require,'collection');
}else if(isSearchPage){
	paths.push('search');
	init = _.partial(require,'seach');
}

requirejs(paths, function($,HdUtilView,SearchBarView) {
	var hdUtilView = new HdUtilView({id: '#header-utils'});
	$('form.search-collection').each(function(i,e){
		new SearchBarView({el:$(e)});
	});
	if(init){
		init();
	}
});
