var $ = require ('jquery'), React = require('react');
var Action = require('../actions/compactPaginatorAction');

module.exports = React.createClass({

	render: function() {
		var PrevBtn, NextBtn;
		if (this.props.prevIndex) {
			PrevBtn = (
			<li><a href={this.props.prevIndex}>
				<span className="sprite glyphicon glyphicon-chevron-left"></span>
				<span className="text">Previous</span>
			</a></li>
			);
		}
		if (this.props.nextIndex) {
			NextBtn = (
			<li><a href={this.props.nextIndex}>
				<span className="sprite glyphicon glyphicon-chevron-right"></span>
				<span className="text">Next</span>
			</a></li>
			);
		}
		return ( 
		<nav>
			<ul onClick={this.onPaging} className="pager">
				{PrevBtn} 
				{NextBtn} 
			</ul>
		</nav>
		);
	},
	onPaging: function(e) {
		e.preventDefault();
		var el = $(e.target);
		if(e.target.tagName.toLowerCase() !== 'a'){
			el = el.parentsUntil('li');
		}
		var href = el.attr('href');
		if (href) {
			Action.changePage(href);
		}
	}
});
