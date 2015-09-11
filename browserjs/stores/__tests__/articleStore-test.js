jest.dontMock('backbone');
jest.dontMock('../articleStore');
pageData = {};
var Store = require('../articleStore');
describe('article store',function(){
	it('should have layouts',function(){
		expect(Store.DISPLAY_LAYOUT).not.toBeUndefined();
	})
})

