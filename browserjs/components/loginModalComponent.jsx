import $ from 'jquery'
import React from 'react';
export default ({dispatcher,onSignin,host,errors,displaySignInModal}) => {
	function onSubmit (e) {
		e.preventDefault(e);
		dispatcher({
			type:'navi/modalSubmit', 
			url: $(e.target).attr('action'),
			params: $(e.target).serializeArray().reduce(function(list, item) {
				list[item.name] = item.value;
				return list
			},{})
		});
	}
	function onClose(e) {
		e.preventDefault();
		dispatcher({type:'navi/hideSignInModal'});
	}
	function onToggleTab(e){
		e.preventDefault();
		if(e.target.innerHTML === 'Log in'){
			dispatcher({type:'navi/modalSwitchToSignin'});
		}else if(e.target.innerHTML === 'Sign up'){
			dispatcher({type:'navi/modalSwitchToSignup'});
		}
	}
	let mainClass = 'login popup';
	if(displaySignInModal){
		mainClass += ' appear'
	}
	if(onSignin){
		mainClass += ' on-signin'
	}else{
		mainClass += ' on-signup'
	}
	return (
	<div className={mainClass}>
		<ul className="nav nav-tabs" onClick={onToggleTab}>
			<li role="presentation" className={onSignin ? 'active' : ''}><a href="#">Log in</a></li>
			<li role="presentation" className={onSignin ? 'active' : ''}><a href="#">Sign up</a></li>
		</ul>
		<form method="post" className="signin-section" action={host+'/member/signin'} onSubmit={onSubmit} onReset={onClose}>
			<h3>Sign In</h3>
			<div className="form-group">
				<input type="email" name="email" className="form-control" id="exampleInputEmail1" placeholder="Email" required />
			</div>
			<div className="form-group">
				<input type="password" name="pwd" className="form-control" id="exampleInputPassword1" placeholder="Password" required />
			</div>
			<div className="checkbox">
				<label htmlFor="login-save-me">
				<input type="checkbox" id="login-save-me" name="login-save-me" />
				Remember me
				</label>
			</div>
			<div className="errors">
			{errors.map((e,i)=>(
				<p key={`login-error-${i}`} className="error">{e}</p>
			))}
			</div>
			<input type="submit" name="signup" value="login" className="btn primary"/>
			<button type="reset" className="btn secondary">Close</button>
		</form>
		<form className="signup-section" action={host+'/member/signup'} onSubmit={onSubmit} onReset={onClose}>
			<h3>Sign Up</h3>
			<div className="form-group">
				<input name="firstname" className="form-control" placeholder="first name" required />
			</div>
			<div className="form-group">
				<input name="lastname" className="form-control" placeholder="last name" required />
			</div>
			<div className="form-group">
				<input type="email" name="email" className="form-control" id="exampleInputEmail1" placeholder="Email" required />
			</div>
			<div className="form-group">
				<input type="password" name="pwd" className="form-control" id="exampleInputPassword1" placeholder="Password" required />
			</div>
			<div className="form-group">
				<input type="password" name="re-pwd" className="form-control" id="exampleInputPassword1" placeholder="Re-enter Password" required />
			</div>
			<div className="errors">
			{errors.map((e,i)=>(
				<p key={`login-error-${i}`} className="error">{e}</p>
			))}
			</div>
			<input type="submit" name="signup" value="signup" className="btn primary"/>
			<button type="reset" className="btn secondary">Close</button>
		</form>
	</div>
	);
}

