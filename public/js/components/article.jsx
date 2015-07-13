define([
	'underscore',
	'jquery',
	'react',
	'jsx!components/speechPlayer',
	'jsx!components/compactPaginator'
],function(_,$,React,Player,Paginator)
{
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
		render:function()
		{
			if(_.isString(this.state.body)){
				var ps = _.map(this.state.body.split("\n"),function(p,i){
					var pClass = this.state.speechHilightIndex == i ? 'speaking' : '';
					return <p key={i} className={pClass}>{p}</p>;
				}.bind(this));
			}
			return (
			<div>
				<h1>{this.state.title}</h1>
				<div id="top-utils">
					<div id="player"><Player store={this.props.playerStore} /></div>
					<Paginator store={this.props.store} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
				</div>
				<ol className="breadcrumb">
					<li><a href="/subscription/{this.state.collectionName}/1.html">{this.state.collectionName}</a></li>
					<li>{this.state.title}</li>
				</ol>
				<div className="content">{ps}</div>
				<Paginator store={this.props.store} prevIndex={this.state.prevIndex} nextIndex={this.state.nextIndex} />
			</div>
			);
		}
	})
})
