import "babel-polyfill";
import fetch from 'isomorphic-fetch';
import {toggleClass,isLoginPage,getReferralFromQuery} from '../../lib/bear2.es6';

export default (state, action) => {
	switch (action.type) {
		case 'navi/modalSwitchToSignin':
			return Object.assign({},state,{onSignin:true})
		case 'navi/modalSwitchToSignup':
			return Object.assign({},state,{onSignin:false})
		case 'navi/toggleList':
			toggleClass(document.getElementsByTagName('body')[0],'navi-list-expend');
		case 'navi/hideSignInModal':
			return Object.assign({},state,{displaySignInModal:false});
		case 'navi/modal/showError':
			return Object.assign({},state, {errors: action.errors});
		case 'navi/modal/loggedIn':
			return Object.assign({},state,{displaySignInModal:false, signedIn: true});
		case 'navi/login':
			return Object.assign({},state,{displaySignInModal:true});
		case 'navi/modalSubmit':
			if (action.params['re-pwd']) {
				if (action.params['re-pwd'] != action.params['pwd']) {
					return Object.assign({},state,{errors:['password does not match']})
				}
			}
			fetch(action.url,{
				method: 'POST',
				body: JSON.stringify(action.params),
				headers:{
					Accepts: "application/json",
					contentType: "application/json"
				}
			}).then(result => {
				if (isLoginPage()) {
					location.href = getReferralFromQuery();
				} else {
					//todo: find a better way
					store.dispatch({type:'navi/modal/loggedIn'});
				}
			}).catch(error => {
				//todo: find a better way
				error = typeof error !== 'string' ? error.toString() : error;
				store.dispatch({type:'navi/modal/showError',errors:[error]});
			});
		case 'navi/logout':
		default:
			return state;
	}
}
