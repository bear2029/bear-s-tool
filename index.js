path = require('path');
express = require('express');
app = express();
fs = require('fs');
http = require('http').Server(app);
https = require('https').Server({
	key: fs.readFileSync('config/key.pem'),
	cert: fs.readFileSync('config/cert.pem')
},app);
global.appRoot = path.resolve(__dirname);
_ = require(global.appRoot+'/public/js/underscore-min.js')
var controllers = {};
var matches;
fs.readdirSync('./controllers').map(function(file){
	if(matches = file.match(/^(.*)\.js$/)){
		var exp = require('./controllers/'+file);
		if(_.isFunction(exp)){
			controllers[matches[1]] = new exp()
		}else{
			controllers[matches[1]] = exp
		}
	}
})

require('./config/express.js')(app,express)
require('./config/routes.js')(app,controllers)
http.listen(8080);
https.listen(8081);
