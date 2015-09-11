var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var articleStore = require('../stores/articleStore');
//var Player = require('./speechPlayer.jsx');
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
function getState() {
	return articleStore.state();
}

module.exports = React.createClass({

	getInitialState: function() {
		return getState();
	},
	onChange: function() {
		this.setState(getState());
	},
	componentWillUnMount: function() {
		articleStore.removeChangeListener(this.onChange);
	},
	componentDidMount: function() {
		articleStore.addChangeListener(this.onChange);
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
		var isVertical = this.state.displayLayout == articleStore.DISPLAY_LAYOUT.VERTICAL;
		var mainClass = (isVertical ? 'vertical ' : 'horizontal ') + (this.state.appear ? 'appear' : '');
		var horizontalButtonClass = "btn btn-default" + (isVertical ? "" : ' active')
		var verticalButtonClass = "btn btn-default" + (isVertical ? ' active' : '')
		var layoutController = (
		<div id="layout-controller" className="btn-group" role="group" aria-label= "..." >
			<button onClick={this.onChangeLayout} data-value={articleStore.DISPLAY_LAYOUT.HORIZONTAL} type="button" className={horizontalButtonClass}>
				<span className="glyphicon glyphicon-text-width"></span>橫書
			</button>
			<button onClick={this.onChangeLayout} data-value={articleStore.DISPLAY_LAYOUT.VERTICAL} type="button" className={verticalButtonClass}>
				<span className="glyphicon glyphicon-text-height"></span>直書 
			</button>
		</div>
		);
		return ( 
		<div id="article" className={mainClass}>
			<h1>{this.state.title}</h1>
			<div id="top-utils">
				<div id="player">
					{/*<Player store={this.props.playerStore} />*/}
				</div >
				<Paginator store={articleStore} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
			</div>
			<ol className="breadcrumb">
				<li><a href={collectionHref}>{this.state.collectionName}</a></li>
				<li>{this.state.title}</li>
			</ol>
			<div className="content">{ps}</div>
		</div>
		);
	},
	onChangeLayout: function(e) {
		var $el = $(e.currentTarget);
		var val = $el.attr('data-value');
		if (val !== null) {
			articleStore.setLayout(val);
		}
	},
	onClickHash: function(e) {
		var el = $(e.target);
		if (el.attr('href')) {
			articleStore.track(el.attr('href'));
		}
	}
});
