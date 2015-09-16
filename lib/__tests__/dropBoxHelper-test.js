jest.dontMock('../dropBoxHelper');
jest.dontMock('promise');
jest.dontMock('underscore');
jest.dontMock('../batch');
var helper = require('../dropBoxHelper');
var _ = require('underscore');
var Promise = require('promise');

describe('sync', function() {
	describe('include auth function', function() {
		pit('should call authenticate', function(done) {
			return helper.auth()
			.then(function(){
				this.dropBoxInstance = helper.getClient();
				expect(helper.getClient().authenticate).toBeCalled();
			});
		});
	});
	describe('include fetch last index function',function(){
		pit('can fetch last index',function(){
			return helper.fetchLastIndex('testBook')
			.then(function(lastIndex){
				expect(lastIndex).toEqual(112);
			});
		});
	});
	describe('include find missing files',function(){
		pit('can come up the missing file list',function(){
			return helper.findMissingFiles(18,'testBook',18)
			.then(function(missingFileList){
				expect(missingFileList.length).toEqual(0);
			});
		});
		pit('can come up the missing file list',function(){
			return helper.findMissingFiles(3,'testBook',18)
			.then(function(missingFileList){
				expect(missingFileList.length).toEqual(4);
				expect(_.last(missingFileList)).toEqual(['15-18.txt']);
			});
		});
	});
	describe('include create folder if needed',function(){
		pit('dont create folder because it exist',function(){
			return helper.createFolderIfNeeded('testBook')
			.then(function(){
				expect(helper.getClient().mkdir).not.toBeCalled();
			});
		})
		pit('create folder because it does not exist',function(){
			return helper.createFolderIfNeeded('testBook2')
			.then(function(){
				expect(helper.getClient().mkdir).toBeCalledWith('testBook2',jasmine.any(Function));
			});
		});
	});
	describe('include upload file',function(){
		pit('can upload file',function(){
			return helper.uploadFile('abc123','testBook','0-4.txt')
			.then(function(){
				expect(helper.getClient().writeFile).toBeCalledWith('testBook/0-4.txt','abc123',jasmine.any(Object),jasmine.any(Function));
			});
		});
	});
	describe('include drop in missing files',function(){
		beforeEach(function(){
			this.localContentFetcher = jest.genMockFunction();
			this.localContentFetcher.mockReturnValue(Promise.resolve('abc123'));
		});
		pit('can upload file',function(){
			return helper.dropInMissingFile('testBook',this.localContentFetcher,'0-4.txt')
			.then(function(){
				expect(helper.getClient().writeFile).toBeCalledWith('testBook/0-4.txt','abc123',jasmine.any(Object),jasmine.any(Function));
			})
		});
	});
	describe('all together',function(){
		var timer,batchCount;
		beforeEach(function(){
			timer = 0;
			batchCount = 0;
			this.localContentFetcher = jest.genMockFunction();
			this.localContentFetcher.mockImpl(function(){
				timer++;
				return Promise.resolve('abc123');
			});
			this.onEachBatchComplete = function()
			{
				batchCount++;
			}
		});
		pit('can sync with auth',function(){
			return helper.sync('testBook',3,this.localContentFetcher)
			.then(function(){
				expect(helper.getClient().authenticate).toBeCalled();
			})
		})
		pit('can sync with create folder if needed',function(){
			return helper.sync('testBook',30,this.localContentFetcher)
			.then(function(){
				expect(helper.getClient().readdir).toBeCalled();
			})
		})
		pit.only('can sync with write file',function(){
			return helper.sync('testBook',136,this.localContentFetcher,this.onEachBatchComplete)
			.then(function(){
				expect(helper.getClient().writeFile).toBeCalledWith('testBook/110-114.txt','abc123',jasmine.any(Object),jasmine.any(Function));
				expect(helper.getClient().writeFile).toBeCalledWith('testBook/130-134.txt','abc123',jasmine.any(Object),jasmine.any(Function));
				expect(timer).toEqual(6);
				expect(batchCount).toEqual(2);
			})
		})
	});
})
