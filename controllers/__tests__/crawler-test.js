jest.dontMock('underscore');
jest.dontMock('cheerio');
jest.dontMock('../crawler.js');
var crawler = require('../crawler.js');
describe('crawler controller',function()
{
	it('combine url should work',function(){
		expect(crawler.combineUrl('abc.html','http://www.google.com/aa/')).toBe('http://www.google.com/aa/abc.html')
	})
})
