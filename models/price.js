module.exports = function (orm, db) {
	var price = db.define('price', {
		id:      { type: 'number' },
		name:    { type: 'text' }
	});
};

