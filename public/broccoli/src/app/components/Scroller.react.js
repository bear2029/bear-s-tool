var React = require('react');
var Action = require('../actions/SampleActions');
var $ = require('jquery');

module.exports = React.createClass({
	render: function()
	{
		return (
		<fieldset onClick={this.onClick}>
			<button className="clear-button glyphicon glyphicon-plus-sign plus"></button>
			<button className="clear-button glyphicon glyphicon-minus-sign minus"></button>
		</fieldset>);
	},
	onClick: function(e)
	{
		var $el = $(e.target);
		if($el.hasClass('plus')){
			Action.plus();
		}else if($el.hasClass('minus')){
			Action.minus();
		}
	}
})
