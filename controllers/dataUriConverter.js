var dataUri = require('data-uri')
var multer  = require('multer')
var uploadPath = './uploads/';
app.use(multer({ dest: uploadPath}))
module.exports = exports = {
	home: function(req,res)
	{
		var result = {
			req: req
		};
		if(req.files && req.files.file){
			var fileName = uploadPath+req.files.file.name
			dataUri.encode(fileName, function(results){
				var r = _.first(_.values(results))
				if(r && r.status == 'SUCCESS'){
					result.dataUri = r.dataUri
				}
				res.render('dataUriConverter',result)
			});
		}else{
			res.render('dataUriConverter',result)
		}
	}
}
