export function transform (text) {
	var lines = text.split(/\n/)
		.map(line=>line.replace(/^\s*/,''))
		.filter(line => {return line.search(/^create\s+/) > -1})
		.map(line=>{
			var path = line.match(/^create\s+(.*)$/)[1];
			var script = `docker cp dev_synack_1:/home/syn/synack/${path} ${path};`;
			return script;
		});	
	return lines.join("\n");
}
