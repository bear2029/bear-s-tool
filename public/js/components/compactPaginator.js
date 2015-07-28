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
				PrevBtn = React.createElement("li", null, React.createElement("a", {href: this.props.prevIndex}, "Previous"));
			}
			if (this.props.nextIndex){
				NextBtn = React.createElement("li", null, React.createElement("a", {href: this.props.nextIndex}, "Next"));
			}
			return (
			React.createElement("nav", null, React.createElement("ul", {onClick: this.onPaging, className: "pager"}, 
				PrevBtn, 
				NextBtn
			))
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
