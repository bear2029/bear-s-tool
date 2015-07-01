//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html#_use_promises
//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-index

var elasticsearch = require('elasticsearch');
var Promise = require('promise');
function Member()
{
	var client = new elasticsearch.Client({
		//log: 'trace',
		host: 'localhost:9200'
	});
	var hash = function(pwd)
	{
		var crypto = require('crypto') , key = 'abcdeg'
		return crypto.createHmac('sha1', key).update(pwd).digest('hex')
	};
	return {
		validate: function(attrs,options)
		{
			if(!attrs.email){
				return 'email undefined';
			}else if(!attrs.email.match(/@/)){
				return attrs.email + 'is not a valid email';
			}
			if(!attrs.pwd || attrs.pwd.length<5){
				return 'password is invalid';
			}
			if(!attrs.firstname){
				return 'firstname is invalid';
			}
			if(!attrs.lastname){
				return 'lastname is invalid';
			}
		},
		get: function(email,pwd)
		{
			var terms = [{
				term: {email: email}
			}]
			if(pwd){
				terms.push({term:{pwd:hash(pwd)}})
			}
			var params = {
				index: 'member',
				type: 'core',
				body: {
					"query":{"filtered":{"filter":{"bool":{"must":terms}}}}
				}
			};
			return client.search(params)
		},
		create: function(_data)
		{
			return new Promise(function(resolve,reject){
				var data = _.clone(_data)
				data.pwd = hash(data.pwd);
				resolve({
					index:'member',
					type:'core',
					body:data
				});
			}.bind(this))
			.then(function(data){return client.index(data)})
		},
		isSignedIn: function()
		{
			return false;
		}
	}
}
exports = module.exports = new Member()
