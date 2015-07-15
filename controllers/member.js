var memberController = require('../lib/member.js')
var esHelper = require('../lib/esHelper.js')
module.exports = {
	signout: function(req,res)
	{
		delete(req.session.email);
		delete(req.session.memberId);
		res.redirect(req.query.forward);
	},
	signin: function(req,res,next)
	{
		if(!req.body.email){
			//todo
			req.templateName = 'signin';
			req.vars = {};
			req.vars.headerTitle = 'Sign in';
			next();
			return
		}

		memberController.get(req.body.email,req.body.pwd)
		.then(esHelper.getHits)
		.then(function(d){
			if(d.length <= 0){
				throw 'no match'
			}
			return d;
		})
		.then(_.first)
		.then(esHelper.digestHit)
		.then(_.partial(_.omit,_,'pwd'))
		.then(function(data){
			req.session.email = data.email;
			req.session.memberId = data.id;
			if(req.query.referral){
				console.log('redirect to',req.query.referral);
				return res.redirect(req.query.referral);
			}
			res.json(data);
		})
		.catch(function(error){
			if(error == 'no match'){
				res.status(404).send(error);
			}
			console.log(error);
			res.status(500).send(_.isString(error) ? error : 'something wrong');
		})
	},
	signup: function(req,res,next)
	{
		if(!req.body.email){
			req.templateName = 'signin';
			req.vars = {};
			req.vars.headerTitle = 'Sign up';
			return next();
		}
		var error = memberController.validate(req.body)
		if(error){
			res.status(500).send(_.isString(error) ? error : 'something wrong');
			return;
		}
		memberController.get(req.body.email)
		.then(function(existingMember){
			if(existingMember.hits.total>0){
				throw 'member existed!';
			}
		})
		.then(_.partial(memberController.create.bind(memberController),req.body))
		.then(esHelper.noTrash)
		.then(function(d){
			req.session.email = req.body.email;
			req.session.memberId = d.id;
			res.json(d)
		})
		.catch(function(error){
			console.trace(error);
			res.status(500).send(_.isString(error) ? error : 'something wrong');
		})
	}
}
