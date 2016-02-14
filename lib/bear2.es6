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
export function isLoginPage() {
	return location.pathname.match(/^\/member\/signin/) !== null;
}
export function toggleClass(el,className){
	let remain = el.className.replace(new RegExp(`\s?${className}\s?`),'');
	if(remain === el.className){
		el.className += ` ${className}`;
	}else{
		el.className = remain;
	}
}
export function getReferralFromQuery() {
	var matches = location.search.match(/[?&]referral=([^&]+)/);
	if (matches) {
		return decodeURIComponent(matches[1]);
	}
}
