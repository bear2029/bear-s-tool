(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var c = require('./c');
module.exports = {
	say: function()
	{
		console.log('i am the change in a 3');
		console.log('i am a, i am going to call c.say');
		c.say();
	}
};

},{"./c":2}],2:[function(require,module,exports){
module.exports = {
	count: 0,
	say: function()
	{
		this.count++;
		console.log('i am c, i got called '+this.count+' times');
	}
}

},{}],3:[function(require,module,exports){
var a = require('./a');
var c = require('./c');
console.log('i am b');
a.say();
c.say();

},{"./a":1,"./c":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm9jY29saS1mYXN0LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uL3NyYy9hcHAvYS5qcyIsIi4uLy4uL3NyYy9hcHAvYy5qcyIsImpzL2IuYnVuZGxlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgYyA9IHJlcXVpcmUoJy4vYycpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHNheTogZnVuY3Rpb24oKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJ2kgYW0gdGhlIGNoYW5nZSBpbiBhIDMnKTtcblx0XHRjb25zb2xlLmxvZygnaSBhbSBhLCBpIGFtIGdvaW5nIHRvIGNhbGwgYy5zYXknKTtcblx0XHRjLnNheSgpO1xuXHR9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvdW50OiAwLFxuXHRzYXk6IGZ1bmN0aW9uKClcblx0e1xuXHRcdHRoaXMuY291bnQrKztcblx0XHRjb25zb2xlLmxvZygnaSBhbSBjLCBpIGdvdCBjYWxsZWQgJyt0aGlzLmNvdW50KycgdGltZXMnKTtcblx0fVxufVxuIiwidmFyIGEgPSByZXF1aXJlKCcuL2EnKTtcbnZhciBjID0gcmVxdWlyZSgnLi9jJyk7XG5jb25zb2xlLmxvZygnaSBhbSBiJyk7XG5hLnNheSgpO1xuYy5zYXkoKTtcbiJdfQ==
