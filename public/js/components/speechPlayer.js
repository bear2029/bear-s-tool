define([
	'jquery',
	'react'
],function($,React)
{
	return React.createClass({
		getInitialState: function()
		{
			return this.props.store.state;
		},
		componentWillMount: function()
		{
			this.props.store.observe('statusChange',function(){
				this.setState(this.props.store.state);
			}.bind(this))
		},
		render: function()
		{
			return (
			React.createElement("div", {className: "player-core", onClick: this.handleClick}, 
				React.createElement("button", {className: "btn"}, React.createElement("span", {className: "backward glyphicon glyphicon-backward"})), 
				React.createElement("button", {className: "btn", disabled: this.state.isPlaying && !this.state.isPausing}, React.createElement("span", {className: "play glyphicon glyphicon-play"})), 
				React.createElement("button", {className: "btn", disabled: !this.state.isPlaying}, React.createElement("span", {className: "pause glyphicon glyphicon-pause"})), 
				React.createElement("button", {className: "btn", disabled: !this.state.isPlaying}, React.createElement("span", {className: "stop glyphicon glyphicon-stop"})), 
				React.createElement("button", {className: "btn"}, React.createElement("span", {className: "forward glyphicon glyphicon-forward"}))
			)
			);
		},
		handleClick: function(e)
		{
			e.preventDefault();
			var el = $(e.target);
			if(el.prop('tagName').toLowerCase() == 'button'){
				el = $('span',el);
			}
			if(el.hasClass('play')){
				this.props.store.play();
			}else if(el.hasClass('pause')){
				this.props.store.pause();
			}else if(el.hasClass('stop')){
				this.props.store.stop();
			}
		}
	});
});
