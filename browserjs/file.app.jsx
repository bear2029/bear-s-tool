// http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

(function() {
	'use strict';

	var _ = require('underscore');
	var $ = require('jquery');
	var Promise = require('promise');
	var batch = require('../lib/batch.js');
	var React = require('react');
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
		render: function()
		{
			var cssComponents = _.map(this.props.files,function(file,i){
				return (<CssComponent key={i} className={file.className} uri={file.uri} width={file.width} height={file.height} />);
			});
			return (
				<div className="preview-inner">
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
			React.render(<PreviewComponent files={dataList} />,$('#preview-bd')[0]);
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
