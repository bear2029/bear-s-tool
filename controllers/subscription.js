var subscription = require('../lib/subscription');
var tracking = require('../lib/trackingStorage');
var size = 20;
function processLastVisitedArticle(data)
{
	try{
		return data.hits.hits[0].fields.url[0];
	}catch(e){
		return null;
	}
}
module.exports = exports = {
	search: function(req,res,next)
	{
		var vars = {};
		subscription.getCollections()
		.then(function(o){
			vars.collections = [];
			if(o.hits.total > 0){
				vars.collections = o.hits.hits;
			}
			return subscription.getSearchResult(req.params.collection, req.params.term, req.params.pg, size)
		})
		.then(function(result){
			vars.id = vars.pg = parseInt(req.params.pg);
			vars.total = Math.ceil(result.hits.total/size)
			vars.term = req.params.term,
			vars.collectionName = req.params.collection;
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
				req.templateName = 'collection';
				vars.pageTitle = 'seach page';
				req.vars = vars;
				next();
			}else{
				res.json(vars);
			}
		})
		.catch(function(e){
			console.log(e);
			res.status(500).send('bad')
		})
	},
	collection: function(req,res,next)
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
			});
			var memberId = req.session.memberId;
			if(memberId){
				return tracking.findLastArticle(memberId,vars.collection.name);
			}
		})
		.then(processLastVisitedArticle)
		.then(function(lastVisitedArticleiUrl){
			vars.collection.lastVisitedArticleUrl = lastVisitedArticleiUrl;
			vars.items.sort(function(a,b){
				return b.index > a.index ? -1 : 1;
			})
			vars.id = pg;
			if(req.path.match(/\.html$/)){
				req.templateName = 'collection';
				req.vars = vars;
				next();
			}else{
				res.json(vars);
			}
		})
		.catch(function(e){
			console.log(e);
			res.status(500).send('bad');
		})
	},
	collectionItem: function(req,res,next)
	{
		var vars = {};
		subscription.getSubscriptionItem(req.params.collectionName,parseInt(req.params.itemIndex))
		.then(esHelper.getHits)
		.then(_.first)
		.then(function(data){
			vars = data._source
			vars._body = _.clone(vars.body);
			delete vars.body;
			if(req.session && req.session.memberId){
				vars.memberId = req.session.memberId;
			}
		})
		.then(_.partial(subscription.getItemsByCollectionName,req.params.collectionName,0,0).bind(subscription))
		.then(function(data)
		{
			try{
				var filters = [
					new RegExp(vars.collectionName+"\\s*"+vars.title),
					/レ♠思♥路♣客レ/,
					/\(去讀讀www.qududu.cm\)/,
					/\s*請記住本站域名: 黃金屋\s*\n/
				];
				_.each(filters,function(filter,i){
					vars._body = vars._body.replace(filter,'');
				})
			}catch(e){
			}
			return data;
		})
		.then(function(data){
			vars.prevIndex = null;
			vars.nextIndex = null;
			if(vars.index>0){
				vars.prevIndex = parseInt(vars.index-1)+'.html';
			}
			if(vars.index<data.hits.total-1){
				vars.nextIndex = ''+parseInt(vars.index+1)+'.html';
			}
			if(req.accepts('html')){
				req.vars = vars;
				req.templateName = 'collectionItem';
				next();
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
