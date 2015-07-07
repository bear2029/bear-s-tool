function ArgvController()
{
	var argvs = process.argv.slice(2);
	this.argv = _.reduce(argvs,function(obj,argv){
		var parts = argv.split('=');
		obj[parts[0]] = parts[1] || true;
		return obj;
	},{});
	this.get = function(key,defaultValue){
		if(!this.argv[key]){
			if(defaultValue){
				return defaultValue;
			}
			throw 'key of '+ key + ' is not defined from argv';
		}
		return this.argv[key];
	};
}
module.exports=new ArgvController();
