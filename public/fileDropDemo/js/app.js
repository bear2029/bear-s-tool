// http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax

(function() {
	'use strict';

	var _ = require('underscore');
	var $ = require('jquery');

	function uploadFiles(files) {
		$('#preview-bd').html('');
		var reader = new FileReader();
		reader.onload = function(e) {
			var uri = e.target.result;
			if(uri.match(/^data:/)){
				$('#preview-bd').append('<img src="' + uri + '">');
			}else{
				$('#preview-bd').append('<p>' + uri + '</p>');
			}
		};
		_.each(files, function(file) {
			if (file.type.match(/^(text|message)\//)) {
				reader.readAsText(file);
			} else if (file.type.match(/^image\//)) {
				reader.readAsDataURL(file);
			}
			console.log(file.type);
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
