import $ from 'jquery';
import bear from '../../lib/bear.js';

function getReferralFromQuery() {
	var matches = location.search.match(/[?&]referral=([^&]+)/);
	if (matches) {
		return decodeURIComponent(matches[1]);
	}
}

export default (state, action) => {
	console.log(state);
	switch (action.type) {
		case 'navi/modalSwitchToSignin':
			return Object.assign({},state,{onSignin:true})
		case 'navi/modalSwitchToSignup':
			return Object.assign({},state,{onSignin:false})
		case 'navi/toggleList':
			$('body').toggleClass('navi-list-expend');
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
			$.ajax({
				url: action.url,
				data: JSON.stringify(action.params),
				type: 'POST',
				accepts: "application/json; charset=utf-8",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: result => {
					if (bear.isLoginPage()) {
						location.href = getReferralFromQuery();
					} else {
						//todo: find a better way
						store.dispatch({type:'navi/modal/loggedIn'});
					}
				},
				error: (req, code, message) => {
					//todo: find a better way
					store.dispatch({type:'navi/modal/showError',errors:[message]});
				}
			});
		case 'navi/logout':
		default:
			return state;
	}
}
