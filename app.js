require('express-orm-mvc')(function(err){
	if(err) {
		console.log(err);
		return;
	}
	console.log('done');
});
