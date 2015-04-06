module.exports = function (orm, db) {
	var product = db.define('product', {
		id:      { type: 'number' },
		name:    { type: 'text' },
		price_id: { type: 'number' }
	});
};


