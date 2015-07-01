var compression = require('compression');

function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		return false
	}
	return compression.filter(req, res)
}
module.exports = function(app, controllers) {
	//app.use(compression({filter: shouldCompress}))
	app.use(compression())
	app.use(function(req,res,next){
		res.header('Access-Control-Allow-Origin', 'http://bear.ddns.net:8080');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		next();
	})
	app.get('/favicon.ico',function(req,res){
		res.sendFile(global.appRoot+'/public/favicon.ico')
	})
	app.get( '/' , controllers.post.home.bind(controllers.post));
	app.get( ['/name/*','/name'] , controllers.post.name.bind(controllers.post));
	app.get( '/queue/:name' , controllers.post.dumpQueue.bind(controllers.post));
	app.post( '/queue/:name' , controllers.post.pushQueue.bind(controllers.post));

	app.use('/member/signin',forceSSL, controllers.member.signin);
	app.use('/member/signout',forceSSL, controllers.member.signout);
	app.use('/member/signup',forceSSL, controllers.member.signup);

	app.get( '/dictionaryWrapper/:words' , controllers.post.dictionaryWrapper.bind(controllers.post));
	app.delete( '/queue/:name/:index' , controllers.post.removeFromQueue.bind(controllers.post));
	app.get( '/subscription/:collectionName/:pg.html' , controllers.subscription.collection);
	app.get( '/subscription/:collectionName/:pg' , controllers.subscription.collection);
	app.get( '/searchCollection/:term/:pg' , controllers.subscription.search);
	app.get( '/subscription/:collectionName/item/:itemIndex' , controllers.subscription.collectionItem);
	app.use( '/dataUriConverter' , controllers.dataUriConverter.home);

	app.get( '/crawler' , controllers.crawler.home);
	app.put( '/crawler/syncDropBox' , controllers.crawler.syncDropBox);
	app.get( '/crawler/subscribe/:id' , controllers.crawler.subscribe);
	app.post( '/crawler/scriptTester' , controllers.crawler.scriptTester);
	app.get( '/crawler/subscriptionItems/:id/:name.zip' , controllers.crawler.archive);

	app.use(controllers.post.default.bind(controllers.post));

	io.on('connection', function(socket){
		console.log('a user connected');
		socket.on('chat message', function(obj){
			console.log(obj.for+' has received: ' + obj.msg);
			io.emit('chat message',obj.msg)
		});
		socket.on('crawler', function(obj){controllers.crawler.crawl(io,obj)})
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
	});
};
