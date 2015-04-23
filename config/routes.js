module.exports = function(app, controllers) {
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	app.get( '/' , controllers.post.home);
	app.get( '/post/:id' , controllers.post.get);
	app.get( '/posts' , controllers.post.getall);
	app.post( '/post' , controllers.post.create);
	app.get( '/comment/:id' , controllers.comment.get);

	app.get( '/crawler' , controllers.crawler.home);
	app.get( '/crawler/subscribe/:id' , controllers.crawler.subscribe);
	app.post( '/crawler/scriptTester' , controllers.crawler.scriptTester);

	app.post( '/members' , controllers.member.create);
	app.get( '/members/' , controllers.member.getAll);
	app.use( '/members/:id' , controllers.member.get);

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
	http.listen(8080, function(){
		  console.log('listening on *:80');
	});
};
