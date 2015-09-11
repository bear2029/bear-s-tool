var _ = require('underscore');
var Promise = require('promise');
module.exports = function(paramList,callBack,size,debug,eachCallBack)
{
	var eachBatch = function(callBack,paramChunks,results)
	{
		if(!paramChunks.length){
			if(debug){console.log('done');}
			return Promise.resolve(results);
		}else{
			var paramChunk = paramChunks.shift();
			var promises = _.reduce(paramChunk,function(list,item){
				list.push(callBack.apply(this,item)); 
				return list;
			},[]);
			return Promise.all(promises)
			.then(function(data){
				var newResults = results.concat(data);
				if(debug){console.log('finished one batch');}
				//todo
				if(eachCallBack && _.isFunction(eachCallBack)){
					eachCallBack(totalChunks-paramChunks.length,totalChunks);
				}
				return eachBatch(callBack,paramChunks,newResults,debug);
			});
		}
	};
	var n = Math.floor(paramList.length/size);
	var paramChunks = _.groupBy(paramList, function(element, index){
		  return Math.floor(index/n);
	});
	paramChunks = _.toArray(paramChunks);
	var totalChunks = paramChunks.length;
	return Promise.resolve(eachBatch(callBack,paramChunks,[]));
};
