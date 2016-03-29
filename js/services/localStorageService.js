var myApp=angular.module('MUHCApp');
myApp.service('LocalStorage',['UserAuthorizationInfo', function(UserAuthorizationInfo){
	function readLocalStorage(section)
	{
		if(section=='All')
		{
			 var user=window.localStorage.getItem('UserAuthorizationInfo');
			 user=JSON.parse(user);
			 storage=window.localStorage.getItem(user.UserName);
			 return JSON.parse(storage);
		}else{
			var user=window.localStorage.getItem('UserAuthorizationInfo');
			user=JSON.parse(user);
			storage=window.localStorage.getItem(user.UserName);
			storage=JSON.parse(storage);
			return storage[section];
		}
	}

	return {
		WriteToLocalStorage:function(section, data)
		{
			if(section=='All')
			{
				console.log(data);
				 window.localStorage.setItem(UserAuthorizationInfo.UserName, JSON.stringify(data));
			}else{
				var storage=window.localStorage.getItem(UserAuthorizationInfo.UserName);
				storage=JSON.parse(storage);

				if(!storage)
				{
					var object={};
					object[section]=data;
					console.log(object);
					window.localStorage.setItem(UserAuthorizationInfo.UserName,JSON.stringify({object}));
					console.log(	window.localStorage.getItem(UserAuthorizationInfo.UserName));

				}else{
					storage[section]=data;
					window.localStorage.setItem(UserAuthorizationInfo.UserName,JSON.stringify(storage));
				}
			}

		},
		isUserDataDefined:function()
		{
			var storage=window.localStorage.getItem(UserAuthorizationInfo.UserName);
				if(!storage||typeof storage=='undefined'){
					return false;
				}else{
					return true;
				}
		},
		ReadLocalStorage:function(section)
		{
			return readLocalStorage(section);
		},
		resetUserLocalStorage:function()
		{
			window.localStorage.removeItem('UserAuthorizationInfo');
			window.localStorage.removeItem(UserAuthorizationInfo.UserName);
		}



	};


}]);
