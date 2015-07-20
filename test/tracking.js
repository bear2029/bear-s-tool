process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var request = require('request');
var assert = require("assert");
var tracking = require('../controllers/tracking.js');
function dummyRequestTest(url,done)
{
	request.get({url:url},function(err,header,body){
		if(err){
			assert.fail(err);
		}
		if(header.statusCode > 300){
			assert.fail(header.statusCode,300,'status code is not acceptable, body:'+body);
		}
		assert.equal(JSON.parse(body).created,true,'created attr should return trye');
		done();
	})
}
describe('tracking', function(){
	describe('get', function(){
		var testQuery = '?memberId=1&url='+encodeURIComponent('http://bear.ddns.net:8080/');
		it('should return something with http', function(done){
			dummyRequestTest('http://localhost:8080/tracking'+testQuery,done);
		});
		it('should return something with https', function(done){
			dummyRequestTest('https://localhost:8081/tracking'+testQuery,done);
		})
	})
	describe('validateInput',function(){
		it('should do the work',function(){
			//assert(tracking.validateInput({}),'ok');
		})
	})
	describe('getInput',function(){
		it('should do the work',function(){
			//assert.equal(tracking.validateInput({}),3,'ok');
		})
	})
})

