import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux'
require('../public/css/crawler.scss');

let crawlerList = document.getElementById('crawler-list');
let subscriptionList = document.getElementById('subscribe-list');
if(crawlerList){
	var CrawlerList = require('./components/crawlerList.jsx')
	render(<CrawlerList />, document.getElementById('crawler-list'));
}else if(subscriptionList && crawlerId){
	var SubscriptionList = require('./components/subscriptionList.jsx')
	render(<SubscriptionList />, document.getElementById('subscribe-list'));
}
