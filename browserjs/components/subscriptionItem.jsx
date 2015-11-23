var React = require('react');
var ReactDom = require('react-dom');
var SubscriptionAction = require('../actions/subscriptionAction');
var $ = require('jquery');
var socket = io();
var Ajax = require('../../lib/promiseAjax');
var dropBoxHelper = require('../../lib/dropBoxHelper');
var searchHost = '/es/';

module.exports = React.createClass({
	getInitialState: function()
	{
		return {updating: false,updatePercentage: 0};
	},
	componentDidMount: function()
	{
		var that = this;
		this.state.updating = false;
		socket.on('crawler',function(msg){
			if(msg.id == that.props.id){
				if(msg.msg == 'all done'){
					that.state.updating = false;
					that.props.count = msg.count;
					that.props.lastUpdate = msg.lastUpdate;
					that.props.lastIndex = msg.lastIndex;
					that.setState(that.state);
				}else if(msg.percentage){
					that.setState({'updating': true,'updatePercentage':msg.percentage});
				}
			}
		})
	},
	onEdit: function(e) {
		e.preventDefault();
		SubscriptionAction.edit(this.props.id);
	},
	onUpdate: function(e) {
		if(this.state.updating){
			return;
		}
		socket.emit('crawler', {'subscriptionId':this.props.id});
		this.setState({
			updating:true,
			updatePercentage:0
		});
	},
	onDelete: function(e)
	{/*{{{*/
		// todo: move to store
		var that = this;
		e.preventDefault();
		Ajax.delete(searchHost+'/crawler/subscription/'+that.props.id)
		.then(function(){
			return Ajax.delete(searchHost+'/crawler/subscriptionItem/_query',{query:{match:{
				subscriptionId:that.props.id}
			}});
		})
		.then(function(){
			$(ReactDom.findDOMNode(that)).remove();
		})
		return false;
	},/*}}}*/
	onExportToDropBox: function(e) {
		// todo: move to store
		if(this.state.updating){
			return;
		}
		var localContentFetcher = function(collectionName, missingFileName){
			return Ajax.get('/crawler/subscriptionItems/'+collectionName+'/'+missingFileName);
		}
		var collectionName = $(e.currentTarget).attr('data-collection-name');
		var lastLocalIndex = $(e.currentTarget).attr('data-last-index');
		this.setState({'updating':true,'updatePercentage':0});
		dropBoxHelper.sync(collectionName, lastLocalIndex, localContentFetcher,function(i,n){
			this.setState({'updatePercentage':Math.round(100*i/n)});
		}.bind(this)).then(function(){
			this.setState({'updatePercentage':100,'updating':false});
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
		var href = "/subscription/"+this.props.name+"/1.html";
		var progressStyle = {width: this.state.updatePercentage+'%'}
		return (
		<div className="item">
			<div><h3><a target="_blank" href={href}>{this.props.name}</a></h3></div>
			<div><a target="_blank" className="remote" href={this.props.remoteUrl}>{this.props.remoteUrl}</a></div>
			<div>count: {this.props.count}</div>
			<div>last update: {this.props.lastUpdate}</div>
			<div className={classes}>
				<button className="btn btn-info btn-sm" onClick={this.onUpdate}>
					update <span className="glyphicon glyphicon-refresh"></span>
				</button>
				<div className="progress">
					<div style={progressStyle} className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">{this.state.updatePercentage}%</div>
				</div>
			</div>
			<div className="utils">
				<a className="btn btn-primary btn-sm" href={"/crawler/subscriptionItems/"+this.props.id+"/"+this.props.name+".zip"} title="download">
					<span className="glyphicon glyphicon-floppy-save"></span>
				</a>
				<button className="btn btn-primary btn-sm" data-collection-name={this.props.name} data-last-index={this.props.lastIndex} onClick={this.onExportToDropBox} title="export to dropbox">
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
