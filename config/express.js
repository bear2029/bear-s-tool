util = require('util');
bodyParser = require('body-parser');
logger = require('morgan');
error_handler = require('errorhandler');
exphbs  = require('express-handlebars');
var autoPrefixer = require('express-autoprefixer');
http = require('http').Server(app);
io = require('socket.io')(http);

module.exports = function(app, express) {
	app.use(bodyParser.json());
	app.use(logger('dev'));
	app.use(error_handler());

	app.engine('handlebars', exphbs({
		defaultLayout: 'main',
		helpers: {
			json: function(obj) {
				return JSON.stringify(obj);
			}
		},
		extname: '.html',
		partialsDir: [
			'views/partials/'
		]
	}));
	app.set('view engine', 'handlebars');

	app.use(autoPrefixer({ browsers: 'last 2 versions', cascade: false }))
	.use('/public/css',express.static('prefixer'))
	app.use('/public',express.static(global.appRoot+'/public'));
};
