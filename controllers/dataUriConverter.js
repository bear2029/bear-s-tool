var dataUri = require('data-uri')
var multer  = require('multer')
var sizeOf = require('image-size');
var uploadPath = './uploads/';
app.use(multer({ dest: uploadPath}))
module.exports = exports = {
	home: function(req,res,next)
	{
		req.templateName = 'dataUriConverter';
		req.vars = {};
		if(req.files && req.files.file){
			var fileName = uploadPath+req.files.file.name
			req.vars.dimensions = sizeOf(fileName);
			dataUri.encode(fileName, function(results){
				var r = _.first(_.values(results))
				if(r && r.status == 'SUCCESS'){
					req.vars.dataUri = r.dataUri
				}
				next();
			});
		}else{
			next();
		}
	}
}
