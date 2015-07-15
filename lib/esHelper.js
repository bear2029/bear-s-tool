var request = require('request');
exports = module.exports = {
	digestHit: function(data)
	{
		var d = data._source;
		d.id = data._id;
		return d; 
	},
	getHits: function(data)
	{
		return data.hits.hits; 
	},
	noTrash: function(data)
	{
		return _.omit(data,'_index','_type','_version','_shards'); 
	},
	proxy: function(req,res)
	{
		var x = request.post({
			url: 'http://localhost:9200'+req.originalUrl.replace(/es\//,''),
			body: JSON.stringify(req.body)
		}, function(err,httpResponse,body){
			if(err || httpResponse.statusCode > 300){
				return 	res.status(500).send('error');
			}
			res.status(httpResponse.statusCode).json(JSON.parse(body));
		});
	}
};
