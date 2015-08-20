// expect pageData.memberId
module.exports = {
	track: function(_url) {
		var img = new Image();
		if (!_url) {
			_url = location.href;
		}
		var url = '/tracking?url=' + encodeURIComponent(_url);

		if (pageData && pageData.memberId) {
			url += '&memberId=' + pageData.memberId;
		}
		img.src = url;
	}
};
