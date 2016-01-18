var React = require('react');
var render = require('react-dom').render;
var RouterUtils = require('react-router');
var Router = RouterUtils.Router;
var Route = RouterUtils.Route;
var Link = RouterUtils.Link;
var browserHistory = RouterUtils.browserHistory;

var IndexComponent = require('./components/Tube/IndexComponent.jsx');
var TubeComponent = React.createClass({
	render: function()
	{
		return (
		<div>
			this is a dummy component for detail
		</div>
		);
	}
});
var NoMatch = React.createClass({
	render: function()
	{
		return (
		<div>
			no shit
		</div>
		);
	}
});


render((
<Router history={browserHistory}>
	<Route path="/" component={IndexComponent}/>
	<Route path="/tube/:tubeId" component={TubeComponent}/>
	<Route path="*" component={NoMatch}/>
</Router>
), document.getElementById('app-container'))
