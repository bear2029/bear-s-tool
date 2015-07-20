var TrackingStorage = require('../lib/trackingStorage.js');
var tracking = {
	get:function(req,res)
	{
		try{
			tracking.store(tracking.getInput(req.query))
			.then(function(d){
				res.json(d);
			})
		}catch(e){
			res.status(500).send(e);
		}
	},
	getInput: function(data)
	{
		tracking.validateInput(data);
		return data;
	},
	validateInput: function(data)
	{
		//todo, check member id if member id is available
		if(!data.url){
			throw 'url is not provided';
		}
		if(!data.url.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/)){
			throw 'url is not valid: '+data.url;
		}
	},
	store: function(data)
	{
		return TrackingStorage.track(data.url,data.memberId)
	}
}
module.exports = exports = tracking;
