module.exports = function(orm,db)
{
	var ContactInfo = db.define('contactInfo',{
		id: {type:'number'},
		member_id: {type: 'number'},
		tel:{type:'text'}
	})
}
