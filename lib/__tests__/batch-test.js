jest.dontMock('../batch.js');
describe('batch',function(){
	it('should be ok',function(){
		var foo = '123';
		expect(foo).toBe('123');
	})
})
