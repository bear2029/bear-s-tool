var React = require('react');
var $ = require('jquery');
var socket = io();
var Ajax = require('../../lib/promiseAjax');
var dropBoxHelper = require('../../lib/dropBoxHelper');

module.exports = React.createClass({
	getInitialState: function()
	{
		return this.props.data;
	},
	onSubmitComplete: function(data)
	{
		this.setState(data);
		this.render();
	},
	onClick: function(e)
	{
		var el = $(e.target);
		if(el.prop('tagName').toLowerCase() != 'a'){
			el = el.parentsUntil('td');
		}
		if(el.prop('tagName').toLowerCase() != 'a'){
			e.preventDefault();
			React.render(<Editor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#crawler-editor')[0]);
		}
	},
	componentDidMount: function()
	{
		var that = this;
		this.state.updating = false;
		socket.on('crawler',function(msg){
			if(msg.id == that.state._id){
				if(msg.msg == 'all done'){
					that.state.updating = false;
					that.state._source.count = msg.count;
					that.state._source.lastUpdate = msg.lastUpdate;
					that.state._source.lastIndex = msg.lastIndex;
					that.setState(that.state);
				}else if(msg.percentage){
					that.setState({'updating': true,'updatePercentage':msg.percentage});
				}
			}
		})
	},
	onEdit: function(e) { React.render(<SubscriptionEditor data={this.state} onSubmitComplete={this.onSubmitComplete} />, $('#subscribe-editor')[0]); },
	onUpdate: function(e) {
		if(this.state.updating){
			return;
		}
		socket.emit('crawler', {'subscriptionId':this.state._id});
		this.setState({'updating':true});
		this.setState({'updatePercentage':0});
	},
	onDelete: function(e)
	{/*{{{*/
		var that = this;
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/subscription/'+that.state._id)
		.then(function(){
			return Ajax.delete(searchHost+'/crawler/subscriptionItem/_query',{query:{match:{
				subscriptionId:that.state._id}
			}});
		})
		.then(function(){
			$(React.findDOMNode(that)).remove();
		})
		return false;
	},/*}}}*/
	onExportToDropBox: function(e) {
		if(this.state.updating){
			return;
		}
		var localContentFetcher = function(collectionName, missingFileName){
			return Ajax.get('/crawler/subscriptionItems/'+collectionName+'/'+missingFileName);
		}
		var collectionName = $(e.currentTarget).attr('data-collection-name');
		var lastLocalIndex = $(e.currentTarget).attr('data-last-index');
		this.setState({'updating':true});
		this.setState({'updatePercentage':0});
		dropBoxHelper.sync(collectionName, lastLocalIndex, localContentFetcher,function(i,n){
			this.setState({'updatePercentage':Math.round(100*i/n)});
		}.bind(this)).then(function(){
			this.setState({'updatePercentage':100});
			this.setState({'updating':false});
		}.bind(this)).catch(function(e){
			console.log('issue occured',e);
		});
	},
	render: function()
	{/*{{{*/
		var classes = 'update-cell';
		if(this.state.updating){
			classes += ' updating'
		}
		var href = "/subscription/"+this.state._source.collectionName+"/1.html";
		var progressStyle = {width: this.state.updatePercentage+'%'}
		return (
		<div className="item">
			<div><h3><a target="_blank" href={href}>{this.state._source.collectionName}</a></h3></div>
			<div><a target="_blank" className="remote" href={this.state._source.collectionUrl}>{this.state._source.collectionUrl}</a></div>
			<div>count: {this.state._source.count}</div>
			<div>last update: {this.state._source.lastUpdate}</div>
			<div className={classes}>
				<button className="btn btn-info btn-sm" onClick={this.onUpdate}>
					update <span className="glyphicon glyphicon-refresh"></span>
				</button>
				<div className="progress">
					<div style={progressStyle} className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">{this.state.updatePercentage}%</div>
				</div>
			</div>
			<div className="utils">
				<a className="btn btn-primary btn-sm" href={"/crawler/subscriptionItems/"+this.state._id+"/"+this.state._source.collectionName+".zip"} title="download">
					<span className="glyphicon glyphicon-floppy-save"></span>
				</a>
				<button className="btn btn-primary btn-sm" data-collection-name={this.state._source.collectionName} data-last-index={this.state._source.lastIndex} onClick={this.onExportToDropBox} title="export to dropbox">
					<span className="glyphicon glyphicon-cloud-download"></span>
				</button>
				<button className="btn btn-success btn-sm" onClick={this.onEdit} title="Edit">
					<span className="glyphicon glyphicon-pencil"></span></button>
				<button className="btn btn-danger btn-sm" onClick={this.onDelete} title="delete">
					<span className="glyphicon glyphicon-trash"></span>
				</button>
			</div>
		</div>
		);
	}/*}}}*/
});
