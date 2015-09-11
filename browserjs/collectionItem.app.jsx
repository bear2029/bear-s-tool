var React = require('react');
var $ = require('jquery');
var bear = require('../lib/bear');
var Article = require('./components/article.jsx');
require('./ui/navi');

React.render(<Article />,$('#content')[0]);
