var bodyParser = require('body-parser');
var logger = require('morgan');
var error_handler = require('errorhandler');
var exphbs  = require('express-handlebars');
var autoPrefixer = require('express-autoprefixer');

module.exports = function(app, express) {
	app.use(bodyParser.json());
	app.use(logger('dev'));
	app.use(error_handler());

	app.engine('handlebars', exphbs({
		//defaultLayout: 'main',
		//helpers      : helpers,
		extname: '.html',
		partialsDir: [
			'views/partials/'
		]
	}));
	app.set('view engine', 'handlebars');

	app.use('/public',express.static(global.appRoot+'/public'));
	app.use(autoPrefixer({ browsers: 'last 2 versions', cascade: false })).use('/public/css',express.static('prefixer'))
};
