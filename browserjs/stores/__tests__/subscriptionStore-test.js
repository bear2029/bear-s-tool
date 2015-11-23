jest.dontMock('promise');
jest.dontMock('reflux');
jest.dontMock('underscore');
jest.dontMock('jquery');
jest.dontMock('../subscriptionStore');



var subscriptionStore = require('../subscriptionStore');
describe('subscriptionStore',function(){
	xit('should be give empty object initially',function(){
		expect(subscriptionStore.state()).toEqual({});
	})
	xpit('should return something',function(){
		return subscriptionStore.userInit(1).then(function(e){
			console.log('here',e);
		})
	})
})
