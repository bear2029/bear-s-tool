//if ('development' == app.get('env')) {
	    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//}
var member = require('../lib/member.js')
_ = require('underscore')
var assert = require("assert")
var request = require('request');
var hostname = 'https://127.0.0.1:8081'

var randomEmail = 'test@aaa'+new Date().getTime();
var testMember = {email:randomEmail,pwd: '123213123',firstname: 'bear',lastname: 'hsiung'}

describe('lib/member', function(){
	describe('validate', function(){
		it('should be a "pass"', function(){
			assert.equal(null, member.validate(testMember));
		})
		it('should be a "fail" by not passing email', function(){
			assert.notEqual(null, member.validate({pwd: "1231231"}));
		})
	})
	describe('create',function(){
		it('should create member',function(done){
			member.create(testMember)
			.then(function(data){
				assert(data.created)
				done();
			})
		})
	})
})

describe('controller/member', function(){
	it('should be able to signup thru https',function(done){
		request.post({
			url:hostname+'/member/signup',
			json: testMember
		},function (error, response, body) {
			if(error){
				assert.fail(error);
			}
			if(response.statusCode != 200){
				assert.equal(response.statusCode, 200,'there is an error on status code');
			}
			done();
		})
	})
})

