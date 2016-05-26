//
//  Created by David Herrera on 2015-05-04.
//  Copyright (c) 2015 David Herrera. All rights reserved.
//
angular.module('MUHCApp').controller('LoadingController', ['$rootScope','$state', '$scope','UpdateUI', 'UserAuthorizationInfo','UserPreferences', '$q','Patient', 'Messages', '$timeout',function ($rootScope,$state, $scope, UpdateUI, UserAuthorizationInfo, UserPreferences, $q, Patient, Messages,$timeout){
		modal.show();
		console.log('Im doing it');
		console.log('setting timeout');
		setTimeout(function()
		{
			var updateUI=UpdateUI.init();
			updateUI.then(function(){
					$rootScope.refresh=true;
						$state.go('Home');
						modal.hide();
			});
		});






		setTimeout(function(){
			console.log('hello');
			console.log(typeof Patient.getFirstName());
			if(typeof Patient.getFirstName()=='undefined'||Patient.getFirstName()==''){
				console.log('we meet again');
				var user=window.localStorage.getItem('UserAuthorizationInfo');
				user=JSON.parse(user);
				storage=window.localStorage.getItem(user.UserName);
				var mod=undefined;
				if(ons.platform.isAndroid())
				{
					mod='material'
				}
				modal.hide();
				if(storage){

				    ons.notification.confirm({
				      message: 'Problems with server, could not fetch data, try again later',
				      modifier: mod,
				      callback: function(idx) {
								console.log('I am in there?')
				        switch (idx) {
				          case 0:
									$state.go('logOut');
				            /*ons.notification.alert({
				              message: 'You pressed "Cancel".',
				              modifier: mod
				            });*/
				            break;
				          case 1:
									$state.go('logOut');
									//modal.show();
									/*UpdateUI.UpdateOffline('All').then(function(){
										modal.hide();
										$state.go('Home');
									});*/
				          break;
				        }
				      }
				    });


			}else{
				ons.notification.confirm({
					message: 'Problems with server, could not fetch data, try again later',
					modifier: mod,
					callback: function(idx) {
						$state.go('logOut');
					}
				});
			}
		}
		},45000);
}]);
