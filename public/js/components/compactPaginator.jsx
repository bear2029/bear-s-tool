define([
	'jquery',
	'react'
],function($,React)
{
	return React.createClass({
		render:function()
		{
			var PrevBtn, NextBtn;
			if (this.props.prevIndex){
				PrevBtn = <li><a href={this.props.prevIndex}>Previous</a></li>;
			}
			if (this.props.nextIndex){
				NextBtn = <li><a href={this.props.nextIndex}>Next</a></li>;
			}
			return (
			<nav><ul onClick={this.onPaging} className="pager">
				{PrevBtn}
				{NextBtn}
			</ul></nav>
			);
		},
		onPaging: function(e)
		{
			e.preventDefault();
			var el = $(e.target);
			var href = el.attr('href');
			if(href){
				this.props.store.navigate(href);
			}
		}
	})
})
