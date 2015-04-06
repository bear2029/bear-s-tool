module.exports = function (orm, db) {
	var category = db.define('category', {
		id:      { type: 'number' },
		name:    { type: 'text' }
	});
};
