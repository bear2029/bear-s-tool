jest.dontMock('backbone');
jest.dontMock('../crawlerStore');
pageData = {};
describe('crawler store',function(){
	var Store = require('../crawlerStore');
	it('should have state',function(){
		var state = Store.state();
		expect(state.consoleHtml).toBeDefined();
		expect(state.crawlers).toBeDefined();
		expect(state.editor).toBeDefined();
	});
})
