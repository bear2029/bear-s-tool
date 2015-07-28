require.config({
	jsx: {
		fileExtension: '.jsx'
	},
	paths: {
		//modernizr: 'modernizr.custom.56433.js',
		jsx: "../vendor/jsx",
		text: "../vendor/text",
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
var isCrawlerPage = location.pathname.match(/^\/crawler/);
var init,paths = ['jquery','lib/view/hdUtil','lib/view/searchBar'];
var pageData = pageData || {};
if(isCollectionItemPage){
	if(pageData.env == 'prod'){
		paths.push('collectionItem');
	}else{
		paths.push('jsx!collectionItem');
	}
	init = _.partial(require,'collectionItem');
}else if(isCollectionPage){
	paths.push('collection');
	init = _.partial(require,'collection');
}else if(isSearchPage){
	paths.push('search');
	init = _.partial(require,'seach');
}else if(isCrawlerPage){
	if(pageData.env == 'prod'){
		paths.push('crawler');
	}else{
		paths.push('jsx!crawler');
	}
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
