var Promise = require('promise');
var _ = require('underscore');
var dataUri = require('data-uri');
//var multer  = require('multer');
var sizeOf = require('image-size');
var uploadPath = './uploads/';
//app.use(multer({ dest: uploadPath}))
var converter = {
	convert: function(fileName)
	{
		var param = {dimensions: sizeOf(fileName)};
		return new Promise(function(resolve,reject){
			dataUri.encode(fileName, function(results){
				var r = _.first(_.values(results))
				if(r && r.status == 'SUCCESS'){
					param.dataUri = r.dataUri;
				}
				resolve(param);
			});
		})
	},
	home: function(req,res,next)
	{
		if(req.accepts('html')){
			req.templateName = 'dataUriConverter';
			req.vars = {};
			if(req.files && req.files.file){
				converter.convert(uploadPath+req.files.file.name)
				.then(function(response){
					req.vars = _.extend(req.vars,response);
					next();
				})
				.catch(res.status(500).json);
			}else{
				next();
			}
		}else{
			console.log(req.files);
			if(req.files && req.files.file){
				converter.convert(uploadPath+req.files.file.name)
				.then(res.json)
				.catch(res.status(500).json);
			}else{
				res.status(404).send('method not acceptable');
			}
		}
	}
}
module.exports = exports = converter;
