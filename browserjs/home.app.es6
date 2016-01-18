/*
import { createStore } from 'redux'
import './ui/navi';
var React = require('react');
var ReactDom = require('react-dom');
var HomeComponent = require('./components/home.jsx');
ReactDom.render(<HomeComponent />, document.getElementById('home-container'));
*/
import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux'
import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import HomeComponent from './components/home.jsx';

let store = createStore((state = 0, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
});

connect(
	state => {value: state.counter},
	dispatch => {
		onIncrement: () => dispatch(increment())
	}
)(HomeComponent)

render(
	<Provider store={store}>
		<HomeComponent />
	</Provider>,
	document.getElementById('home-container')
)

//render(<HomeComponent store={store} />, document.getElementById('home-container'));
