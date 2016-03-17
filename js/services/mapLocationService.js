var myApp=angular.module('MUHCApp');
myApp.service('MapLocation',function(){
	return{
		updateMapLocation:function(maplocation)
		{
			this.Map=maplocation;
		},
		getMapLocation:function()
		{
			return this.Map;
		}

	};


});
