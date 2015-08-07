var blackList = ['abc'];
var Promise = require.requireActual('promise');
function requestMock(url,callBack){
	if(blackList.indexOf(url) >= 0){
		callBack('in black list',{statusCode:500},'error');
	}else{
		callBack(null,{statusCode:200},'done');
	}
}
module.exports = requestMock;
