var CrawlerController = require('../controllers/crawler');
var DropBox = require('dropbox');
var _ = require('underscore');
var Promise = require('promise');
var batch = require('./batch');
var client = new DropBox.Client({
	key: 'hpw285i1do3f7ot'
});

var helper = {
	getClient: function() {
		return client;
	},
	sync: function(collectionName, lastLocalIndex, localContentFetcher, onEachChunkComplete) {

		var eachBatchCallBack = _.bind(this.dropInMissingFile, this, collectionName, localContentFetcher);
		
		return this.auth()
			.then(_.partial(this.createFolderIfNeeded, collectionName))
			.then(_.partial(this.fetchLastIndex, collectionName))
			.then(_.partial(this.findMissingFiles, _, collectionName, lastLocalIndex))
			.then(_.partial(batch, _, eachBatchCallBack, 3, false, onEachChunkComplete));
	},
	/**
	 * auth, block the sync if fail
	 */
	auth: function() {
		return new Promise(function(resolve, reject) {
			client.authenticate({
				interactive: true
			}, function(error, client) {
				if (error) {
					reject('Error: ' + error);
				}
				resolve();
			});
		});
	},
	/**
	 * return latest index from dropbox
	 */
	fetchLastIndex: function(collectionName) {
		return new Promise(function(resolve, reject) {
			client.readdir(collectionName, function(error, files) {
				if (error) {
					reject(error);
				} else {
					var lastIndex = 0;
					_.each(files, function(file) {
						if (file.match(/^[0-9-]+\.txt/)) {
							file = file.replace(/\.txt$/, '');
							_.each(file.split('-'), function(index) {
								lastIndex = Math.max(lastIndex, parseInt(index));
							})
						}
					});
					resolve(lastIndex);
				}
			})
		})
	},
	/**
	 * compare last index on dropbox and db, comeout a list
	 */
	findMissingFiles: function(lastIndexOnDropBox, collectionName, lastLocalIndex) {
		var size = CrawlerController.EXPORT_FILE_CHUNK_SIZE;
		var fileList = [];
		if (lastIndexOnDropBox >= lastLocalIndex) {
			return Promise.resolve(fileList);
		}
		for (i = 0; i <= lastLocalIndex; i += size) {
			if (i + size < lastIndexOnDropBox) {
				continue;
			}
			var end = Math.min(i + size - 1, lastLocalIndex);
			fileList.push([i + '-' + end + '.txt']);
		}
		return Promise.resolve(fileList);
	},
	/**
	 * each callback of batch
	 * fetch local content from db (thru fetcher) and upload to dropbox
	 */
	dropInMissingFile: function(collectionName, localContentFetcher, missingFileName) {
		return localContentFetcher(collectionName, missingFileName)
			.then(_.partial(this.uploadFile, _, collectionName, missingFileName));
	},
	/**
	 * create folder if needed
	 */
	createFolderIfNeeded: function(collectionName) {
		return new Promise(function(resolve,reject){
			client.readdir('/',function(error,files){
				if(error){
					reject(error);
				}else{
					if(files.indexOf(collectionName) < 0){
						client.mkdir(collectionName,function(error,state){
							if(error){ reject(error); }else{ resolve(state); }
						})
					}else{
						resolve();
					}
				}
			})
		});
	},
	/**
	 * simply upload file to specific path
	 */
	uploadFile: function(content, path, fileName) {
		return new Promise(function(resolve, reject) {
			var retry = 0;
			function callBack(error, state) {
				if (error) {
					if(error.status === 503 && retry++ < 3){
						//console.log('503, retry',retry);
						client.writeFile(path + '/' + fileName, content, {}, callBack);
					}else{
						reject(error);
					}
				} else {
					resolve(state);
				}
			}
			client.writeFile(path + '/' + fileName, content, {}, callBack);
		});
	}
};

module.exports = helper;
