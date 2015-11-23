// http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

(function() {
	'use strict';

	var _ = require('underscore');
	var $ = require('jquery');
	var Promise = require('promise');
	var batch = require('../lib/batch.js');
	var React = require('react');
	var ReactDom = require('react-dom');
	require('./ui/navi');

	var CssComponent = React.createClass({
		render: function()
		{
			return (
				<li className="css">
				<p>.{this.props.className}&#123;</p>
					<p className="i">background-image:url({this.props.uri});</p>
					<p className="i">width: {this.props.width}px;</p>
					<p className="i">height: {this.props.height}px;</p>
					<p className="i">background-size: 100% auto;</p>
					<p className="i">background-repeat: no-repeat;</p>
				<p>&#125;</p>
				</li>
			);
		}
	});
	var PreviewComponent = React.createClass({
		getInitialState: function() {
			return {displayingType: 'datauri'};
		},
		onSelectURI: function()
		{
			this.setState({displayingType: 'datauri'})
		},
		onSelectURL: function()
		{
			this.setState({displayingType: 'url'})
		},
		render: function()
		{
			var urlButtonClass = "btn btn-default";
			var uriButtonClass = "btn btn-default";
			if(this.state.displayingType === 'datauri'){
				uriButtonClass += ' active';
			}else{
				urlButtonClass += ' active';
			}
			var cssComponents = _.map(this.props.files,function(file,i){
				var url = this.state.displayingType === 'datauri' ? file.uri : file.fileName;
				return (<CssComponent key={i} className={file.className} uri={url} width={file.width} height={file.height} />);
			}.bind(this));
			return (
				<div className="preview-inner">
					<p className="selector btn-group">
						<label onClick={this.onSelectURI} className={uriButtonClass}>URI</label>
						<label onClick={this.onSelectURL} className={urlButtonClass}>URL</label>
					</p>
					<ul className="css list-unstyled">
					{cssComponents}
					</ul>
				</div>
			);
		}
	});

	function readFileIntoHtml(file)
	{
		var reader = new FileReader();
		return new Promise(function(resolve,reject){
			reader.onload = function(e) {
				resolve({
					uri:e.target.result,
					fileName: file.name
				});
			};
			if (file.type.match(/^(text|message)\//)) {
				reader.readAsText(file);
			} else if (file.type.match(/^image\//)) {
				reader.readAsDataURL(file);
			}
		})
	}
	function readAndAppendImageSize(uri,fileName)
	{
		return new Promise(function(resolve,reject){
			var image = document.createElement('img');
			image.addEventListener('load', function() {
				resolve({
					fileName: fileName,
					uri: uri,
					width: image.width,
					height: image.height,
					className: extractClassNameFromFileName(fileName)
				});
			});
			image.src = uri;
		});
	}
	function extractClassNameFromFileName(fileName)
	{
		var className = fileName.replace(/\..*$/,'');
		return className;
	}
	function uploadFiles(files) {
		$('#preview-bd').html('');
		var fileArgs = _.reduce(files,function(args,file){args.push([file]);return args},[]);
		batch(fileArgs,readFileIntoHtml,1,true)
		.then(function(dataList){
			var promises = _.reduce(dataList, function(promises,data) {
				promises.push(readAndAppendImageSize(data.uri,data.fileName))
				return promises;
			},[]);
			return Promise.all(promises);
		})
		.then(function(dataList){
			// todo, not dynamic
			ReactDom.render(<PreviewComponent files={dataList} />,$('#preview-bd')[0]);
		});
	}

	function on(e) {
		e.preventDefault();
		if (e.type === 'drop') {
			var files = e.originalEvent.dataTransfer.files;
			uploadFiles(files);
		} else if (e.type == 'dragover' || e.type == 'dragenter') {
			var $el = $(e.target);
		}
		return false;
	}

	$('#foo').on('dragover', on)
	$('#foo').on('drop', on);
	$('#foo').on('dragenter', on)
})();
