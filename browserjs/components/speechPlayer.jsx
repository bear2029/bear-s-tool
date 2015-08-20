var $ = require('jquery'),
	React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return this.props.store.state;
	},
	componentWillMount: function() {
		this.props.store.observe('statusChange', function() {
			this.setState(this.props.store.state);
		}.bind(this))
	},
	render: function() {
		return ( < div className = "player-core"
			onClick = {
				this.handleClick
			} >
			< button className = "btn" > < span className = "backward glyphicon glyphicon-backward" > < /span></button >
			< button className = "btn"
			disabled = {
				this.state.isPlaying && !this.state.isPausing
			} > < span className = "play glyphicon glyphicon-play" > < /span></button >
			< button className = "btn"
			disabled = {
				!this.state.isPlaying
			} > < span className = "pause glyphicon glyphicon-pause" > < /span></button >
			< button className = "btn"
			disabled = {
				!this.state.isPlaying
			} > < span className = "stop glyphicon glyphicon-stop" > < /span></button >
			< button className = "btn" > < span className = "forward glyphicon glyphicon-forward" > < /span></button >
			< /div>
		);
	},
	handleClick: function(e) {
		e.preventDefault();
		var el = $(e.target);
		if (el.prop('tagName').toLowerCase() == 'button') {
			el = $('span', el);
		}
		if (el.hasClass('play')) {
			this.props.store.play();
		} else if (el.hasClass('pause')) {
			this.props.store.pause();
		} else if (el.hasClass('stop')) {
			this.props.store.stop();
		}
	}
});
