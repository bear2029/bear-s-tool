if(typeof esMock === 'undefined'){
	esMock = {
		searchFunc: jest.genMockFunction(),
		Client: function(obj){
			this.search = function(){
				esMock.searchFunc.apply(this,arguments);
			};
		}
	};
}
module.exports = esMock;
