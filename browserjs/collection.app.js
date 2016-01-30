import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux'
import NaviComponent from './components/navi.jsx';
import naviReducer from './stores/naviReducer.es6';

var $ = require('jquery');
var isSearchPage = location.pathname.match(/^\/searchCollection\//);
var CollectionListView = require('./view/collectionList');
require('./ui/navi');

if (isSearchPage) {
	var SearchListModel = require('./model/searchList');
	var searchListModel = new SearchListModel(app);
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: searchListModel
	});
} else {
	var CollectionListModel = require('./model/collectionList');

	var collectionListModel = new CollectionListModel(app);
	var collectionListView = new CollectionListView({
		el: $('#collection-list'),
		model: collectionListModel
	});
}

let initialState = {
	navi:{
		onSignin: true,
		errors: [],
		host: '',
		signedIn:false, // todo
		displaySignInModal: false
	}
}

if (location.port.match(/808\d/)) {
	initialState.navi.host = 'https://' + location.hostname + ':8081';
} else {
	initialState.navi.host = 'https://' + location.hostname;
}

window.store = createStore((state=initialState,action)=>{
	switch(action.type){
		default:
			if(action.type.search(/^navi\//) > -1){
				return Object.assign({},state,{
					navi: naviReducer(state.navi,action)
				});
			}
			return state;
	}
});

const _render = () => {
	render(
		<NaviComponent state={store.getState().navi} dispatcher={store.dispatch} />,
		document.getElementById('navi-container')
	)
}
_render();
store.subscribe(_render);
