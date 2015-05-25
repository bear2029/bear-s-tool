var compression = require('compression');

function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		return false
	}
	return compression.filter(req, res)
}
module.exports = function(app, controllers) {
	app.use(compression({filter: shouldCompress}))
	app.get( '/' , controllers.post.home);
	app.get( '/name' , controllers.post.name);
	app.get( '/post/:id' , controllers.post.get);
	app.get( '/queue/:name' , controllers.post.dumpQueue);
	app.post( '/queue/:name' , controllers.post.pushQueue);
	app.post( '/post' , controllers.post.create);
	app.get( '/comment/:id' , controllers.comment.get);

	app.get( '/crawler' , controllers.crawler.home);
	app.put( '/crawler/syncDropBox' , controllers.crawler.syncDropBox);
	app.get( '/crawler/subscribe/:id' , controllers.crawler.subscribe);
	app.post( '/crawler/scriptTester' , controllers.crawler.scriptTester);
	app.get( '/crawler/subscriptionItems/:id/:name.zip' , controllers.crawler.archive);

	app.post( '/members' , controllers.member.create);
	app.get( '/members/' , controllers.member.getAll);
	app.use( '/members/:id' , controllers.member.get);
	app.use(controllers.post.default);

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
