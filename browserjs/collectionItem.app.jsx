var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var bear = require('../lib/bear');
var Article = require('./components/article.jsx');
require('./ui/navi');

ReactDom.render(<Article />,$('#content')[0]);
