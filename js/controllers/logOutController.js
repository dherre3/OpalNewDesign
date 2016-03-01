
//
//  Created by David Herrera on 2015-05-04.
//  Copyright (c) 2015 David Herrera. All rights reserved.
//
angular.module('MUHCApp').controller('logOutController',['FirebaseService','$rootScope','UserAuthorizationInfo', '$state','$q','RequestToServer', function(FirebaseService, $rootScope, UserAuthorizationInfo,$state,$q,RequestToServer){
		console.log(FirebaseService);
		var firebaseLink=new Firebase(FirebaseService.getFirebaseUrl());
		redirectPage().then(setTimeout(function(){location.reload()},100))
		function redirectPage(){
			RequestToServer.sendRequest('Logout');
			window.localStorage.removeItem('UserAuthorizationInfo');
			window.localStorage.removeItem(UserAuthorizationInfo.UserName);
			firebaseLink.unauth();
			FirebaseService.getAuthentication().$unauth();
			var r=$q.defer();
			$state.go('logIn')
			r.resolve;
			return r.promise;
		}
}]);
