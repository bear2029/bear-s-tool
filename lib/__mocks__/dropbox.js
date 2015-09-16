/**
 * https://www.dropbox.com/developers/datastore/docs/js
 */
var writeFileCount = 0;
var  DropBoxMock = jest.genMockFromModule('dropbox');
DropBoxMock.Client = jest.genMockFunction();
DropBoxMock.Client.prototype.authenticate = jest.genMockFunction();
DropBoxMock.Client.prototype.authenticate.mockImpl(function(options,callBack){
	callBack();
});
DropBoxMock.Client.prototype.mkdir = jest.genMockFunction();
DropBoxMock.Client.prototype.mkdir.mockImplementation(function(path,callBack){
	callBack();
});
DropBoxMock.Client.prototype.writeFile = jest.genMockFunction();
DropBoxMock.Client.prototype.writeFile.mockImplementation(function(path,content,options,callBack){
	if(writeFileCount++ % 2){
		callBack({status:503});
	}else{
		callBack();
	}
});
DropBoxMock.Client.prototype.readdir = jest.genMockFunction();
DropBoxMock.Client.prototype.readdir.mockImplementation(function(path,callBack){
	if(path === '/'){
		callBack(null,['testBook']);
	}else if(path === 'testBook'){
		callBack(null,['105-109.txt','110-112.txt']);
	}else{
		callBack(null,[]);
	}
})
module.exports = DropBoxMock;
