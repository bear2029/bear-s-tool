// https://github.com/dresende/node-orm2
module.exports = {
	get: function(req,res,next)
	{
		res.json(req.category);
	},
	getProducts: function(req,res)
	{
		req.category.getProducts(function(e,products){
			if(e){
				console.log(e);
				res.status(500).send('cant find products');
			}else{
				res.json(products);
			}
		});
	},
	load: function(req,res,next)
	{
		req.models.category.get(req.params.id, function (err, category) {
			if(err){
				if(err.literalCode == 'NOT_FOUND'){
					res.status(404).send('Not Found');
				}else{
					res.status(406).send('Not Acceptable');
				}
			}
			req.category = category;
			next();
		});
	},
	index: function(req,res)
	{
		req.models.category.find({}, function (err, categories) {
			if(err){
				if(err.literalCode == 'NOT_FOUND'){
					res.status(404).send('Not Found');
				}else{
					res.status(406).send('Not Acceptable');
				}
			}
			res.json(categories);
		});
	},
	upsert: function(req,res)
	{
		var body = req.body;
		function onSave(err,category){
			if(err){
				console.log(err)
				res.status(406).send('Not Acceptable');
			}else{
				res.json(category);
			}
		}
		if(req.category){
			console.log(req.category,body)
			req.category.save(body,onSave)
		}else{
			req.models.category.create(body,onSave)
		}
	}
}
