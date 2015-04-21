var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
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


io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat message', function(obj){
		console.log(obj.for+' has received: ' + obj.msg);
		io.emit('chat message',obj.msg)
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(8080, function(){
	  console.log('listening on *:80');
});
