jest.dontMock('../bear');
jest.dontMock('promise');
var bear = require('../bear');
describe('promiseFetch', function() {
	var request = require('request');
	pit('should work', function() {
		return bear.promiseFetch('abcd').then(function(response){
			expect(response).toBe('done');
		});
	});
	pit('should reject',function(){
		return bear.promiseFetch('abc')
		.then(function(response){
			throw 'it should not be ok';
		})
		.catch(function(e){
			expect(e).toBe('in black list');
		})
	});
})
describe('get hosts', function() {
	it('should contain dev', function() {
		expect(bear.getHosts('dev')).toEqual({
			http: 'http://bear.ddns.net:8080',
			https: 'https://bear.ddns.net:8081'
		});
	})
	it('should contain prod', function() {
		expect(bear.getHosts('prod')).toEqual({
			http: 'http://bear.ddns.net',
			https: 'https://bear.ddns.net'
		});
	})
	it('should not contain beta', function() {
		expect(bear.getHosts('beta')).toBeUndefined();
	})
})
describe('dash to camel case', function(){
	it('should work',function(){
		expect(bear.dashToCamel('bear-aa-asd')).toEqual('bearAaAsd');
	});
});
