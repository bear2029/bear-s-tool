import React from 'react';
import LoginModal from './loginModalComponent.jsx';

const List = ({hosts,dispatcher}) => {
	console.log(hosts)
	function onClickToggler(){
		dispatcher({type:'navi/toggleList'});
	}
	return (
	<div className="navi-list">
		<a className="toggle" onClick={onClickToggler}>
			<figure></figure>
			<figure></figure>
			<figure></figure>
		</a>
		<ul className="list-unstyled">
			<li><a href="/name">name ganerator</a></li>
			<li><a href="/chat.html">chatroom</a></li>
			<li><a href="/dataUriConverter">Data URI converter</a></li>
			<li><a href="/broccoliDemo">Broccoli Demo</a></li>
			<li><a href="/prefixerDemo">Prefixer</a></li>
			<li><a href={`${hosts.https}/crawler`}>crawler</a></li>
			<li><a href="/file">file</a></li>
			<li><a href="/ipCollector">IP Collection</a></li>
			<li><a href="/subscription">Subscription</a></li>
			<li><a href="/tubes">Tubes</a></li>
		</ul>
	</div>
	);
}
const LoginButtons = ({dispatcher}) => {
	const onLogin = e => {
		e.preventDefault();
		dispatcher({type:'navi/login'});
	}
	const onLogout = e => {
		e.preventDefault();
		dispatcher({type:'navi/logout'});
	}
	return (
	<div id="header-utils" className="login-buttons {signedIn ? 'signed-in' : ''}">
		<a className="login" href="/member/signin" onClick={onLogin}>Login</a>
		<a className="logout" href="/member/signout" onClick={onLogout}>Logout</a>
	</div>
	);
}
export default ({state,dispatcher}) => {
	return (
	<nav className="row" id="navi">
		<List hosts={state.hosts} dispatcher={dispatcher} />
		<div className="logo">
			<a className="" href="/">Bear's tool</a>
		</div>
		<LoginButtons signedIn={state.signedIn} dispatcher={dispatcher} />
		<LoginModal dispatcher={dispatcher} onSignin={state.onSignin} host={state.host} errors={state.errors} displaySignInModal={state.displaySignInModal} />
	</nav>
	);
}
