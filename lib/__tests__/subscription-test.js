jest.dontMock('underscore');
jest.dontMock('promise');
jest.dontMock('../subscription');
describe('search', function() {
            var es;
            var subscription = require('../subscription');
            beforeEach(function() {
                es = require('elasticsearch');
            })
	    it('manage summary hi light',function(){
	    	expect(subscription.summaryHilight('abc','333 abc 444')).toEqual(['333 <em>abc</em> 44...']);
	    	expect(subscription.summaryHilight('abc','333 bc 444')).toEqual([]);
	    	expect(subscription.summaryHilight('abc','12345678901234567890 abc 444')).toEqual(['2345678901234567890 <em>abc</em> 44...']);
	    });
            it('get search result', function() {
                subscription.getSearchResult('All', 'bear', 1, 10);
                expect(es.searchFunc).toBeCalledWith({
                    body: {
                        from: 0,
                        min_score: 0.01,
                        query: {
                            filtered: {
                                query: {
                                    bool: {
                                        should: [{
                                            match: {
                                                title: {
                                                    boost: 2,
                                                    query: 'bear',
                                                    type: 'phrase'
                                                }
                                            }
                                        }, {
                                            match: {
                                                body: {
                                                    query: 'bear',
                                                    type: 'phrase'
                                                }
                                            }
                                        }]
                                    }
                                }
                            }
                        },
                        size: 10,
                        sort: ['index', '_score']
                    },
                    index: 'crawler',
                    type: 'subscriptionItem'
                })
            })
});
