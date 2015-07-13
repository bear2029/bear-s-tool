var subscription = require('../lib/subscription')
var size = 20;
module.exports = exports = {
	search: function(req,res)
	{
		var vars = {};
		subscription.getSearchResult(req.params.term, req.params.pg, size)
		.then(function(result){
			vars.id = vars.pg = parseInt(req.params.pg);
			vars.total = Math.ceil(result.hits.total/size)
			vars.term = req.params.term,
			vars.items = _.map(result.hits.hits,function(itemResult){
				var titles = subscription.itemNameParts(itemResult._source.title)
				return {
					id: itemResult._id,
					index: itemResult._source.index,
					collectionName: itemResult._source.collectionName,
					title: titles.title,
					chapter: titles.chapter,
					body: itemResult._source.body
				}
			})
			if(req.path.match(/\.html$/)){
				res.render('collection',{
					req: req,
					data: vars
				});
			}else{
				res.json(vars);
			}
		})
		.catch(function(e){
			console.log(e);
			res.status(500).send('bad')
		})
	},
	collection: function(req,res)
	{
		var pg = req.params.pg || 1;
		var vars = {};
		subscription.getCollectionByName(req.params.collectionName)
		.then(esHelper.getHits)
		.then(_.first)
		.then(function(collectionResult){
			vars.collection = {
				id: collectionResult._id,
				name: collectionResult._source.collectionName,
				remoteUrl: collectionResult._source.collectionUrl
			}
			return subscription.getItemsByCollectionName(req.params.collectionName,size,size*(pg-1))
		})
		.then(function(itemResults){
			vars.pg = pg;
			vars.total = Math.ceil(itemResults.hits.total/size)
			return itemResults
		})
		.then(esHelper.getHits)
		.then(function(itemResults){
			vars.items = _.map(itemResults,function(itemResult){
				var titles = subscription.itemNameParts(_.first(itemResult.fields.title))
				return {
					id: itemResult._id,
					index: _.first(itemResult.fields.index),
					title: titles.title,
					chapter: titles.chapter
				}
			})
			vars.items.sort(function(a,b){
				return b.index > a.index ? -1 : 1;
			})
			vars.id = pg;
			if(req.path.match(/\.html$/)){
				res.render('collection',{
					req: req,
					data: vars
				});
			}else{
				res.json(vars);
			}
		})
		.catch(function(e){
			console.log(e);
			res.status(500).send('bad');
		})
	},
	collectionItem: function(req,res)
	{
		var vars = {};
		subscription.getSubscriptionItem(req.params.collectionName,req.params.itemIndex)
		.then(esHelper.getHits)
		.then(_.first)
		.then(function(data){
			vars = data._source
		})
		.then(_.partial(subscription.getItemsByCollectionName,req.params.collectionName,0,0).bind(subscription))
		.then(function(data)
		{
			try{
				var filters = [
					new RegExp(vars.collectionName+"\\s*"+vars.title),
					/\s*請記住本站域名: 黃金屋\s*\n/
				];
				_.each(filters,function(filter,i){
					vars.body = vars.body.replace(filter,'');
				})
			}catch(e){
			}
			return data;
		})
		.then(function(data){
			if(vars.index>0){
				vars.prevIndex = parseInt(vars.index-1)+'.html';
			}
			if(vars.index<data.hits.total-1){
				vars.nextIndex = ''+parseInt(vars.index+1)+'.html';
			}
			if(req.path.match(/\.html$/)){
				vars.req = req;
				res.render('collectionItem',vars);
			}else{
				res.json(vars);
			}
		})
		.catch(function(e){
			console.log(e);
			res.status(500).send('bad')
		})
	}
}
