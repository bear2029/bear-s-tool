var _ = require('underscore');
var Promise = require('promise');
module.exports = function(paramList,callBack,size,debug,onEachChunkComplete)
{
	var eachBatch = function(paramChunks,results)
	{
		if(!paramChunks.length){
			if(debug){console.log('done');}
			return Promise.resolve(results);
		}else{
			var paramChunk = paramChunks.shift();
			var promises = _.reduce(paramChunk,function(list,item){
				var proc = callBack.apply(this,item);
				list.push(proc); 
				return list;
			},[]);
			return Promise.all(promises)
			.then(function(data){
				var newResults = results.concat(data);
				if(debug){console.log('finished one batch');}
				if(onEachChunkComplete && _.isFunction(onEachChunkComplete)){
					onEachChunkComplete(totalChunks-paramChunks.length,totalChunks);
				}
				return eachBatch(paramChunks,newResults,debug);
			});
		}
	};
	var paramChunks = _.groupBy(paramList, function(element, index){
		  return Math.floor(index/size);
	});
	paramChunks = _.toArray(paramChunks);
	var totalChunks = paramChunks.length;
	return Promise.resolve(eachBatch(paramChunks,[]));
};
