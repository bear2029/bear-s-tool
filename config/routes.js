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
	app.get( '/' , controllers.post.home.bind(controllers.post));
	app.get( '/name' , controllers.post.name.bind(controllers.post));
	app.get( '/post/:id' , controllers.post.get.bind(controllers.post));
	app.get( '/queue/:name' , controllers.post.dumpQueue.bind(controllers.post));
	app.post( '/queue/:name' , controllers.post.pushQueue.bind(controllers.post));
	app.get( '/dictionaryWrapper/:words' , controllers.post.dictionaryWrapper.bind(controllers.post));
	app.delete( '/queue/:name/:index' , controllers.post.removeFromQueue.bind(controllers.post));
	app.post( '/post' , controllers.post.create.bind(controllers.post));
	app.get( '/comment/:id' , controllers.comment.get);

	app.get( '/crawler' , controllers.crawler.home);
	app.put( '/crawler/syncDropBox' , controllers.crawler.syncDropBox);
	app.get( '/crawler/subscribe/:id' , controllers.crawler.subscribe);
	app.post( '/crawler/scriptTester' , controllers.crawler.scriptTester);
	app.get( '/crawler/subscriptionItems/:id/:name.zip' , controllers.crawler.archive);

	app.post( '/members' , controllers.member.create);
	app.get( '/members/' , controllers.member.getAll);
	app.use( '/members/:id' , controllers.member.get);
	app.use(controllers.post.default.bind(controllers.post));
	app.get('/favicon.ico',function(req,res){
		res.sendFile('../public/favicon.ico')
	})

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
