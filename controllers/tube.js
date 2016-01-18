//var flvmeta = require('flvmeta');
var fsp = require('fs-promise');
var _ = require('underscore');
var supporttedExtenssions = ['flv'];
function isValidFile(fileName)
{
	var ext;
	for(var i=0; i<supporttedExtenssions.length; i++){
		ext = new RegExp('\.'+supporttedExtenssions[i]+'$');
		if(fileName.match(ext)){
			return true;
		}
	}
}

var self = {
	index: function(req, res, next) {
		var path = global.appRoot+'/tubes';
		fsp.readdir(path)
		.then(function(_files) {
			var files = _.filter(_files,isValidFile)
			_.each(files,function(file){
				//flvmeta.dump(file, {}, function(err, metadata) {
				//	console.log(metadata);
				//});
			});
		})
		.catch(function(e) {
			console.log('error occurred');
		});
		res.json([123]);
	},
	get: function(req, res, next) {
		res.json([123]);
	},
	resync: function(req, res, next) {
		res.json([123]);
	},
};
module.exports = self;
