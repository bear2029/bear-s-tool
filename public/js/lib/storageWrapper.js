define([],function()
{
	return {
		STORAGE_DISPLAY_LAYOUT: 'STORAGE_DISPLAY_LAYOUT',
		isWorking: function()
		{
			return typeof(Storage) !== "undefined";
		},
		set: function(name,value)
		{
			if(this.isWorking()) localStorage.setItem(name, value);
		},
		get: function(name)
		{
			if(this.isWorking()){
				return localStorage.getItem(name);
			}
		}
	}
})
