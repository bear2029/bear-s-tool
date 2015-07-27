// http://broccoliplugins.com/
var funnel = require('broccoli-funnel')
var mergeTrees = require('broccoli-merge-trees');
var browserify = require('broccoli-fast-browserify');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');

var scssTree = compileSass(['src/css'], 'a.scss', 'css/a.css');
var cssTree = funnel('src/css',{
	include: [new RegExp('.*\.css')],
	destDir: 'css'
})
var cssTrees = autoprefixer(mergeTrees([scssTree,cssTree]));

var jsTree = funnel('src/app',{
	destDir: 'js',
	include: [new RegExp('.*\.jsx')]
})
var jsDoneTree = browserify(jsTree,{
	bundles: {
		"js/app.js": {
			transform: require('reactify'),
			entryPoints: ['*/app.jsx']
		}
	}
	//bundleExtension: ".bundle"
});

module.exports = mergeTrees([jsDoneTree,cssTrees]);
