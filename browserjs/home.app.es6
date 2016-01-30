import React from 'react';
import {render} from 'react-dom';
import { createStore } from 'redux'
import HomeComponent from './components/home.jsx';
import NaviComponent from './components/navi.jsx';
import naviReducer from './stores/naviReducer.es6';
import {transform} from '../lib/bear2.es6';
require('../public/css/dockerUtils.scss');

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
		case 'dockerHelper/transform':
			return Object.assign({},state,{output: transform(action.input)});
		default:
			if(action.type.search(/^navi\//) > -1){
				return Object.assign({},state,{
					navi: naviReducer(state.navi,action)
				});
			}
			return state;
	}
});

const DockerFilerCopyScriptGeneratorComponent = ({output,dispatcher}) => {
	let onChange = e => {
		dispatcher({ type: 'dockerHelper/transform', input: e.target.value })
	};
	return (
	<div className="docker-copy-script-generator">
		<textarea className="input" onChange={onChange} onKeyup={onChange}></textarea>
		<textarea className="output" value={output}></textarea>
	</div>
	)
};

const _render = () => {
	render(
		<NaviComponent state={store.getState().navi} dispatcher={store.dispatch} />,
		document.getElementById('navi-container')
	)
	render(
		<DockerFilerCopyScriptGeneratorComponent output={store.getState().output} dispatcher={store.dispatch} />,
		document.getElementById('main-container')
	)
}
_render();
store.subscribe(_render);
