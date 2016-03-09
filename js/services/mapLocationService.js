var myApp=angular.module('MUHCApp');
myApp.service('MapLocation',function(){
	return{
		setMapLocation:function(maplocation)
		{
			this.Map=maplocation;
		},
		getMapLocation:function()
		{
			return this.Map;
		}

	};


});
