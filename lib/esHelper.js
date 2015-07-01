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
}
