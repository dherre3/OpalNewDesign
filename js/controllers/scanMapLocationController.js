var myApp=angular.module('MUHCApp');
myApp.controller('ScanMapLocationController',['$timeout','$scope','RequestToServer','FirebaseService', function($timeout,$scope,RequestToServer,FirebaseService ){
	var page=generalNavigator.getCurrentPage();
	var parameter=page.options.param;
	console.log(parameter);
	$scope.showLoadingScreen=true;
	RequestToServer.sendRequest('MapLocation',{'QRCode':parameter});
	console.log(FirebaseService.getFirebaseUserFieldsUrl());
	var ref=new Firebase(FirebaseService.getFirebaseUserFieldsUrl()+'/MapLocation');
	ref.on('value',function(snapshot)
	{
		var value=snapshot.val();
		if(typeof value!=='undefined')
		{
			console.log(value);
			ref.set(null);
			ref.off();
		}

	});





}]);