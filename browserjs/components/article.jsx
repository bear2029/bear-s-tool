var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var Player = require('./speechPlayer.jsx');
var Paginator = require('./compactPaginator.jsx');

function appear() {
	$('#content').addClass('appear');
}

function disappear() {
	$('#content').removeClass('appear');
}

function resumeByHash() {
	if (location.hash === '') {
		return;
	}
	var top = $(location.hash).offset().top;
	$(document).scrollTop(top);
}

module.exports = React.createClass({

	getInitialState: function() {
		this.props.store.observe('pageChange', function() {
			scrollTo(0, 0);
			this.setState(this.props.store.state);
		}.bind(this));
		this.props.store.observe('change', function() {
			if (this.props.store.state.loading) {
				console.log(111);
				disappear();
			}
			this.setState(this.props.store.state);
		}.bind(this));
		return this.props.store.state;
	},
	componentDidMount: function() {
		appear();
		resumeByHash.apply(this);
	},
	componentDidUpdate: function() {
		appear();
		resumeByHash.apply(this);
	},
	render: function() {
		if (_.isString(this.state._body)) {
			var ps = _.map(this.state._body.split("\n"), function(p, i) {
				if (p.match(/^\s*$/)) {
					return;
				}
				var id = 'paragraph-' + i;
				var hash = '#' + id;
				var pClass = this.state.speechHilightIndex == i ? 'speaking' : '';
				return (
				<p key={i} id={id} className={pClass}>
					<span>{p}</span>
					<a onClick={this.onClickHash} href={hash}>#</a><br />
				</p>);
			}.bind(this));
		}
		var collectionHref = "/subscription/" + this.state.collectionName + "/1.html";
		var isVertical = this.state.displayLayout == this.props.store.DISPLAY_LAYOUT.VERTICAL;
		var mainClass = (isVertical ? 'vertical ' : 'horizontal ') + (this.state.appear ? 'appear' : '');
		var horizontalButtonClass = "btn btn-default" + (isVertical ? "" : ' active')
		var verticalButtonClass = "btn btn-default" + (isVertical ? ' active' : '')
		return ( 
		<div id="article" className={mainClass}>
			<h1>{this.state.title}</h1>
			<div id="top-utils">
				<div id="player">
					<Player store={this.props.playerStore} />
				</div >
				<Paginator store={this.props.store} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
				<div className="btn-group" role="group" aria-label= "..." >
					<button onClick={this.onChangeLayout} data-value={this.props.store.DISPLAY_LAYOUT.HORIZONTAL} type="button" className={horizontalButtonClass}>
						<span className="glyphicon glyphicon-text-width"></span>橫書
					</button>
					<button onClick={this.onChangeLayout} data-value={this.props.store.DISPLAY_LAYOUT.VERTICAL} type="button" className={verticalButtonClass}>
						<span className="glyphicon glyphicon-text-height"></span>直書 
					</button>
				</div>
			</div>
			<ol className="breadcrumb">
				<li><a href={collectionHref}>{this.state.collectionName}</a></li>
				<li>{this.state.title}</li>
			</ol>
			<div className="content">{ps}</div>
			<Paginator store={this.props.store} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
		</div>
		);
	},
	onChangeLayout: function(e) {
		var $el = $(e.currentTarget);
		var val = $el.attr('data-value');
		if (val !== null) {
			this.props.store.setLayout(val);
		}
	},
	onClickHash: function(e) {
		var el = $(e.target);
		if (el.attr('href')) {
			this.props.store.track(el.attr('href'));
		}
	}
});
