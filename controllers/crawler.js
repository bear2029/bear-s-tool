var request = require('request');
var cheerio = require('cheerio');
var gbk = require('gbk');
var _eval = require('eval');

module.exports = {
	home: function(req,res)
	{
		res.render('crawlerHome',{});
	},
	scriptTester: function(req,res)
	{
		try{
			var testUrl = req.body.testUrl;
			var testRule = req.body.testRule;
			console.log(testRule)
			//request({url: testUrl,gzip: true}, function (error, response, body) {
			gbk.fetch(testUrl).to('string', function(error,body){
				//body = gbk.toString('utf-8', body);
				if (!error) {
					var data = {}
					var $ = cheerio.load(body);
					for(var key in testRule){
						//console.log(testRule[key]);
						data[key] = eval(testRule[key])
					}
					console.log(data);
					res.json(data);
				}else{
					res.status(400).json(error);
				}
			})
		}catch(e){
			res.status(400).send('bad reuest (check your resquest body)')
		}
	}
}
