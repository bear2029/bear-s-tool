var React = require('react');
var ReactDom = require('react-dom');
var Ajax = require('../lib/promiseAjax');
var $ = require('jquery');
var _ = require('underscore');
var bear = require('../lib/bear');
require('./ui/navi');

if($('#crawler-list').length){
	var CrawlerList = require('./components/crawlerList.jsx')
	ReactDom.render(<CrawlerList />, document.getElementById('crawler-list'));
}else if($('#subscribe-list').length && crawlerId){
	var SubscriptionList = require('./components/subscriptionList.jsx')
	ReactDom.render(<SubscriptionList />, document.getElementById('subscribe-list'));
}
