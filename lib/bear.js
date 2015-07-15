var bear = {
	promiseFetch: function(url)
	{
		var request = require('request');
		return new Promise(function(resolve,reject){
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					resolve(body)
				}else{
					reject(error);
				}
			});
		});
	}
};
module.exports = exports = bear;
