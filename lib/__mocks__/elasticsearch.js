//var  esMock = jest.genMockFromModule('elasticsearch');
var  esMock = {};
esMock.Client = jest.genMockFunction();
module.exports = esMock;
