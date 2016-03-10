path = require('path');
express = require('express');
app = express();
fs = require('fs');
bodyParser = require('body-parser');
_ = require('underscore')
argv = require('./lib/argvController.js');
error_handler = require('errorhandler');
exphbs  = require('express-handlebars');
global.appRoot = path.resolve(__dirname);
var matches;
var cookieParser = require('cookie-parser');
var session = require('cookie-session')

env = argv.get('env','dev');
http = require('http').Server(app);
io = require('socket.io')(http);

var controllers = {};
fs.readdirSync('./controllers').map(function(file){
	console.log(file);
	if(matches = file.match(/^(.*)\.js$/)){
		var exp = require('./controllers/'+file);
		controllers[matches[1]] = exp
	}
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(logger('dev'));
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
require('./config/routes.js')(app,controllers)
try{
	http.listen(env === 'prod' ? 80 : 8080);
}catch(e){
	console.log('failed to start server, does port occuppied?');
}
