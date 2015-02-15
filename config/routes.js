module.exports = function(app, controllers) {
	app.get( '/' , controllers.post.home);
	app.get( '/post/:id' , controllers.post.get);
	app.get( '/posts' , controllers.post.getall);
	app.post( '/post' , controllers.post.create);
	app.get( '/comment/:id' , controllers.comment.get);

	app.post( '/members' , controllers.member.create);
	app.get( '/members/' , controllers.member.getAll);
	app.use( '/members/:id' , controllers.member.get);
};
