Promise = require('promise');
bear = require('./lib/bear.js');
esHelper = require('./lib/esHelper.js');
path = require('path');
express = require('express');
app = express();
fs = require('fs');
util = require('util');
bodyParser = require('body-parser');
_ = require('underscore')
argv = require('./lib/argvController.js');
logger = require('morgan');
error_handler = require('errorhandler');
exphbs  = require('express-handlebars');
forceSSL = require('express-force-ssl');
global.appRoot = path.resolve(__dirname);
var controllers = {};
var matches;
var cookieParser = require('cookie-parser');
var session = require('cookie-session')

http = require('http').Server(app);
https = require('https').Server({
	key: fs.readFileSync('config/key.pem'),
	cert: fs.readFileSync('config/cert.pem')
},app);
io2 = require('socket.io')(http);
io = require('socket.io')(https);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(logger('dev'));
app.use(error_handler());
app.use(cookieParser());
app.use(session({secret: 'BearToolIsAwesome'}));

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	helpers: {
		json: function(obj,excludeKeys) 
		{
			var _obj = _.clone(obj);
			if(excludeKeys && _.isString(excludeKeys)){
				excludeKeys = excludeKeys.split(',');
				for(var i=0; i<excludeKeys.length; i++){
					if(_obj[excludeKeys[i]]){
						delete _obj[excludeKeys[i]];
					}
				}	
				delete _obj
			}
			return JSON.stringify(_obj);
		},
		isLogedIn: function(req)
		{
			return req.session.memberId ? 'true' : 'false';
		},
		addBr: function(msg)
		{
			return _.reduce(msg.split(/\n+/),function(all,part){
				all += '<p>'+part+'</p>';
				return all;
			},'');
		}
	},
	extname: '.html',
	partialsDir: [
		'views/partials/'
	]
}));
app.set('view engine', 'handlebars');
app.use('/',express.static(global.appRoot+'/public'));
require('./config/routes.js')(app,controllers)
http.listen(argv.get('port',8080));
https.listen(argv.get('sslport',8081));
