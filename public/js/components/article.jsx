define([
	'underscore',
	'jquery',
	'react',
	'jsx!components/speechPlayer',
	'jsx!components/compactPaginator'
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
		componentDidMount: function()
		{
			resumeByHash.apply(this);
		},
		componentDidUpdate: function()
		{
			resumeByHash.apply(this);
		},
		render:function()
		{
			if(_.isString(this.state.body)){
				var ps = _.map(this.state.body.split("\n"),function(p,i){
					if(p.match(/^\s*$/)){
						return;
					}
					var id = 'paragraph-'+i;
					var hash = '#'+id;
					var pClass = this.state.speechHilightIndex == i ? 'speaking' : '';
					return <p key={i} id={id} className={pClass}>{p}<a onClick={this.onClickHash} href={hash}>#</a></p>;
				}.bind(this));
			}
			var collectionHref = "/subscription/"+this.state.collectionName+"/1.html";
			return (
			<div>
				<h1>{this.state.title}</h1>
				<div id="top-utils">
					<div id="player"><Player store={this.props.playerStore} /></div>
					<Paginator store={this.props.store} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
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
		onClickHash: function(e)
		{
			var el = $(e.target);
			if(el.attr('href')){
				this.props.store.track(el.attr('href'));
			}
		}
	})
})
