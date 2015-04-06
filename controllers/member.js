// https://github.com/dresende/node-orm2
module.exports = {
	get: function(req,res)
	{
		req.models.member.get(req.params.id, function (err, member) {
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
	initMemberContact: function(req,res,next)
	{
		req.models.contactInfo.hasOne('member',req.models.member,{reverse:'contactInfos'});
		console.log('associate');
		next();
	},
	getAllContact: function(req,res)
	{
		console.log('consume');
		req.models.member.get(req.params.memberId,function(err,member){
			if(err){
				res.status('500').send('bad member');
			}else{
				member.getContactInfos(function(err,contactInfos){
					if(err){
						res.status('500').send('bad contact info');
					}else{
						try{
							res.json(contactInfos)
						}catch(error){
							res.status('500').send('bad response');
						}
					}
				})
			}
		})
	},
	getAll: function(req,res)
	{
		req.models.member.find({},function(err,members){
			if(err){
				if(err.literalCode == 'NOT_FOUND'){
					res.status(404).send('Not Found');
				}else{
					res.status(406).send('bad data');
				}
			}else{
				res.json(members);
			}
		})
	},
	createContact: function(req,res)
	{
		var body = req.body;
		body.member_id = req.params.memberId;
		req.models.contactInfo.create(body,function(err,items){
			if(err){
				console.log(err)
				res.status(406).send('Not Acceptable');
			}else{
				res.json(items);
			}
		})
	},
	create: function(req,res,next)
	{
		req.models.member.create(req.body,function(err,items){
			if(err){
				console.log(err)
				res.status(406).send('Not Acceptable');
			}else{
				res.json(items);
			}
		})
	},
	update: function(req,res,next)
	{
		req.models.member.get(req.params.id,function(err,member){
			member.save(req.body,function(err){
				if(err){
					res.status(406).send('some error');
				}else{
					console.log('ok');
					res.json(member);
				}
			})
		})
	},
	delete: function(req,res)
	{
		req.models.member.get(req.params.id,function(err,member){
			member.remove(function(err){
				if(err){
					res.status(406).send('some error');
				}else{
					console.log('ok');
					res.json({});
				}
			})
		})
	}
}
