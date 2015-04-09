module.exports = function (orm, db) {
	var Member = db.define('member', {
		id:      { type: 'number' },
		firstname:    { type: 'text' },
		lastname:    { type: 'text' },
		email:    { type: 'text' },
		password: {type: 'text'}
	});
};