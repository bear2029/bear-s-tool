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

function transform(text)
{
	var lines = text.split(/\n/)
		.map(line=>line.replace(/^\s*/,''))
		.filter(line => {return line.search(/^create\s+/) > -1})
		.map(line=>{
			var path = line.match(/^create\s+(.*)$/)[1];
			var script = `docker cp dev_synack_1:/home/syn/synack/${path} ${path};`;
			return script;
		});	
	console.log(lines);
	return lines.join("\n");
}

const store = createStore((state = {},action)=>{
	switch(action.type){
		case 'transform':
			return {output: transform(action.input)};
		default:
			return state;
	}
});

const DockerFilerCopyScriptGeneratorComponent = () => {
	let onChange = e => {
		store.dispatch({
			type: 'transform',
			input: e.target.value
		})
	};
	return (
	<div className="docker-copy-script-generator">
		<textarea className="input" onChange={onChange} onKeyup={onChange}></textarea>
		<textarea className="output" value={store.getState().output}></textarea>
	</div>
	)
};

const _render = () => {
	render(
		<DockerFilerCopyScriptGeneratorComponent />,
		document.getElementById('home-container')
	)
}
_render();
store.subscribe(_render);
