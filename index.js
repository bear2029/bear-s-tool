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
var controllers = {};
var matches;
fs.readdirSync('./controllers').map(function(file){
	if(matches = file.match(/^(.*)\.js$/)){
		controllers[matches[1]] = require('./controllers/'+file);
	}
})

require('./config/express.js')(app,express)
require('./config/routes.js')(app,controllers)
http.listen(8080);
https.listen(8081);
