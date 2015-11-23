var Promise = require.requireActual('promise');
var ajaxMock = jest.genMockFromModule('../promiseAjax.js');
ajaxMock.get = jest.genMockFunction().mockImplementation(function(url) {
    return Promise.resolve({});
});
ajaxMock.post = jest.genMockFunction().mockImplementation(function(url, data) {
    if (url.match(/\es\/crawler\/common\/_search$/)) {
        return Promise.resolve({hits:{hits:[
		{
		    _id: 'aaa',
		    _index: 'crawler',
		    _source: {
			"siteName": "黃金屋",
			"collectionRule": "{\"title\":\"$('h1').text()\",\"links\":\"_.reduce($('#tbchapterlist a'),function(list,item){var el=$(item);var link={title:el.text(),link:el.attr('href')};list.push(link);return list},[])\"}",
			"itemRule": "{\"body\":\"$('#AllySite').next().text()\"}",
			"collectionUrlRegex": "//tw.hjwzw.com/Book/Chapter/\\d+$",
			"itemUrlRegex": "//tw.hjwzw.com/Book/Read/\\d+,\\d+$",
			"collectionUrl": "http://tw.hjwzw.com/Book/Chapter/33983",
			"itemUrl": "http://tw.hjwzw.com/Book/Read/33983,7272773"
		    }
		},
		{
		    _id: 'aarxa',
		    _index: 'crawler',
		    _source: {
			"siteName": "黃金屋2",
			"collectionRule": "{\"title\":\"$('h1').text()\",\"links\":\"_.reduce($('#tbchapterlist a'),function(list,item){var el=$(item);var link={title:el.text(),link:el.attr('href')};list.push(link);return list},[])\"}",
			"itemRule": "{\"body\":\"$('#AllySite').next().text()\"}",
			"collectionUrlRegex": "//tw.hjwzw.com/Book/Chapter/\\d+$",
			"itemUrlRegex": "//tw.hjwzw.com/Book/Read/\\d+,\\d+$",
			"collectionUrl": "http://tw.hjwzw.com/Book/Chapter/33983",
			"itemUrl": "http://tw.hjwzw.com/Book/Read/33983,7272773"
		    }
		}
	]}});
    }
    return Promise.resolve({});
});
module.exports = ajaxMock;
