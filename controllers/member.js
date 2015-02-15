// https://github.com/dresende/node-orm2
module.exports = {
	get: function(req,res)
	{
		req.models.members.get(req.params.id, function (err, member) {
			    if(err){
				if(err.literalCode == 'NOT_FOUND'){
					res.status(404).send('Not Found');
				}else{
					res.status(406).send('Not Acceptable');
				}
			    }
			    res.json(member);
		});
	},
	getAll: function(req,res)
	{
		req.models.members.find({},function(err,members){
			res.json(members);
		})
	},
	create: function(req,res,next)
	{
		req.models.members.create(req.body,function(err,items){
			if(err){
				console.log(err)
				res.status(406).send('Not Acceptable');
			}else{
				res.json(items);
			}
		})
	}
}
