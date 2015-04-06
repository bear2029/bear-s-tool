// https://github.com/dresende/node-orm2
module.exports = {
	associate: function(req,res,next)
	{
		req.models.category.hasMany('products',req.models.product,{},{reverse:'categories',key:true})
		next();
	},
	load:function(req,res,next)
	{
		req.models.product.get(req.params.id,function(err,product){
			if(err){
				res.status(500).send('bad');
			}else{
				req.product = product;
				next();
			}
		})
	},
	get: function(req,res)
	{
		res.json(req.product);
	},
	index: function(req,res)
	{
		req.models.product.find({},function(e,products){
			if(e){
				res.status(404).send('not found')
			}else{
				res.json(products);
			}
		})
	},
	upsert: function(req,res)
	{
		var body = req.body
		var onSave = function(err,product)
		{
			if(err){
				console.log(err);
				res.status(500).send('cant save');
			}else{
				res.json(product);
			}
		}
		if(req.product){
			req.product.save(body,onSave)
		}else{
			req.models.product.create(body,onSave)
		}
	}
}
