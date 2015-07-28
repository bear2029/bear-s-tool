define([
	'underscore',
	'jquery',
	'react',
	pageData.env === 'prod' ? 'components/speechPlayer' : 'jsx!components/speechPlayer',
	pageData.env === 'prod' ? 'components/compactPaginator' : 'jsx!components/compactPaginator'
],function(_,$,React,Player,Paginator)
{
	function resumeByHash()
	{
		if(location.hash === ''){
			return;
		}
		var top = $(location.hash).offset().top;
		$(document).scrollTop(top);
	}
	return React.createClass({

		getInitialState: function()
		{
			this.props.store.observe('pageChange',function(){
				scrollTo(0,0);
				this.setState(this.props.store.state);
			}.bind(this));
			this.props.store.observe('change',function(){
				this.setState(this.props.store.state);
			}.bind(this));
			return this.props.store.state;
		},
		disappear: function()
		{
			$('#content').removeClass('appear');
		},
		componentDidMount: function()
		{
			$('#content').addClass('appear');
			resumeByHash.apply(this);
		},
		componentDidUpdate: function()
		{
			$('#content').addClass('appear');
			resumeByHash.apply(this);
		},
		render:function()
		{
			if(_.isString(this.state._body)){
				var ps = _.map(this.state._body.split("\n"),function(p,i){
					if(p.match(/^\s*$/)){
						return;
					}
					var id = 'paragraph-'+i;
					var hash = '#'+id;
					var pClass = this.state.speechHilightIndex == i ? 'speaking' : '';
					return React.createElement("p", {key: i, id: id, className: pClass}, p, React.createElement("a", {onClick: this.onClickHash, href: hash}, "#"));
				}.bind(this));
			}
			var collectionHref = "/subscription/"+this.state.collectionName+"/1.html";
			var mainClass = this.state.displayLayout == this.props.store.DISPLAY_LAYOUT.VERTICAL ? 'vertical' : 'horizontal';
			return (
			React.createElement("div", {id: "article", className: mainClass}, 
				React.createElement("h1", null, this.state.title), 
				React.createElement("div", {id: "top-utils"}, 
					React.createElement("div", {id: "player"}, React.createElement(Player, {store: this.props.playerStore})), 
					React.createElement(Paginator, {store: this.props.store, prevIndex: this.state.prevIndex, nextIndex: this.state.nextIndex}), 
					React.createElement("div", {className: "btn-group", role: "group", "aria-label": "..."}, 
						React.createElement("button", {onClick: this.onChangeLayout, "data-value": this.props.store.DISPLAY_LAYOUT.HORIZONTAL, type: "button", className: "btn btn-default active"}, 
							React.createElement("span", {className: "glyphicon glyphicon-text-width"}), " 橫書"
						), 
						React.createElement("button", {onClick: this.onChangeLayout, "data-value": this.props.store.DISPLAY_LAYOUT.VERTICAL, type: "button", className: "btn btn-default"}, 
							React.createElement("span", {className: "glyphicon glyphicon-text-height"}), " 直書"
						)
					)
				), 
				React.createElement("ol", {className: "breadcrumb"}, 
					React.createElement("li", null, React.createElement("a", {href: collectionHref}, this.state.collectionName)), 
					React.createElement("li", null, this.state.title)
				), 
				React.createElement("div", {className: "content"}, ps), 
				React.createElement(Paginator, {store: this.props.store, prevIndex: this.state.prevIndex, nextIndex: this.state.nextIndex})
			)
			);
		},
		onChangeLayout: function(e)
		{
			var $el = $(e.currentTarget);
			var val = $el.attr('data-value');
			if(val !== null){
				this.props.store.setLayout(val);
			}
		},
		onClickHash: function(e)
		{
			var el = $(e.target);
			if(el.attr('href')){
				this.props.store.track(el.attr('href'));
			}
		}
	})
})
