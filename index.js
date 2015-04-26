path = require('path');
express = require('express');
app = express();
http = require('http').Server(app);
fs = require('fs');
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
