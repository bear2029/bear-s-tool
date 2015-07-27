var appDispatcher = require('../dispatchers/AppDispatcher');
var constants = require('../constants/SampleConstant');

module.exports = {
	plus: function()
	{
		appDispatcher.dispatch({
			actionType: constants.PLUS
		});
	},
	minus: function()
	{
		appDispatcher.dispatch({
			actionType: constants.MINUS
		});
	},
	setCount: function(val)
	{
		appDispatcher.dispatch({
			actionType: constants.SET,
			count: val
		});
	}
};
