/*
*Code by David Herrera May 20, 2015
*Github: dherre3
*Email:davidfherrerar@gmail.com
*/
var myApp=angular.module('MUHCApp')

    /**
*@ngdoc controller
*@name MUHCApp.controller:LoginController
*@scope
*@requires $scope
*@requires MUHCApp.services:UserAuthorizationInfo
*@requires $state
*@description
*Uses Firebase authWithPassword method. The authWithPassword() inputs promise response
    *if error is defined, i.e authentication fails, it clears fields displays error for user via displayChatMessage() method, if authenticated
    *takes credentials and places them in the UserAuthorizationInfo service, it also sends the login request to Firebase,
    *and finally it redirects the app to the loading screen.
*/
myApp.controller('LoginController', ['ResetPassword','$scope','$timeout', '$rootScope', '$state', 'UserAuthorizationInfo', 'RequestToServer', 'FirebaseService','LocalStorage',function (ResetPassword,$scope,$timeout, $rootScope, $state, UserAuthorizationInfo,RequestToServer,FirebaseService,LocalStorage) {
  console.log(FirebaseService);
  var myDataRef = new Firebase(FirebaseService.getFirebaseUrl());
  //demoSignIn();
  /*checkForSessionEnd=function()
  {
    var  authInfoLocalStorage=window.localStorage.getItem('UserAuthorizationInfo');
    if(authInfoLocalStorage&&typeof  authInfoLocalStorage!=='undefined')
    {
      var authInfoObject=JSON.parse(authInfoLocalStorage);

      var timeNow=(new Date()).getTime()/1000;
      if(authInfoObject.Expires<timeNow) {
        console.log(authInfoObject.Expires);
        console.log((new Date()).getTime()/1000);
        UserAuthorizationInfo.setUserAuthData(authInfoObject.UserName,authInfoObject.Password , authInfoObject.Expires,authInfoObject.Token);
        $state.go('logOut');
      }
    }
  };
  checkForSessionEnd();*/
  myDataRef.onAuth(function(authData){
    var  authInfoLocalStorage=window.localStorage.getItem('UserAuthorizationInfo');
    if($rootScope.activeLogin!=='true')
    {
      if(authData)
      {
        if(authInfoLocalStorage){
            var authInfoObject=JSON.parse(authInfoLocalStorage);
            console.log(authInfoObject);
            console.log(authData);
            UserAuthorizationInfo.setUserAuthData(authData.auth.uid,authInfoObject.Password , authData.expires,authData.token);
            userId = authData.uid;
            var patientLoginRequest='request/'+userId;
            var patientDataFields='Users/'+userId;
            console.log(authData.token.length);
            var authenticationToLocalStorage={
                    UserName:authData.uid,
                    Password: authInfoObject.Password ,
                    Expires:authData.expires,
                    Email:authData.password.email,
                    Token:authData.token
            }
            $rootScope.refresh=true;
            window.localStorage.setItem('UserAuthorizationInfo', JSON.stringify(authenticationToLocalStorage));
            console.log(UserAuthorizationInfo.getUserAuthData());
            console.log("Authenticated successfully with payload:", authData);
              RequestToServer.sendRequest('Refresh','All');
              $state.go('loading');
        }
      }else{
        if($state.current.name=='Home'||authInfoLocalStorage)
        {
          console.log('here state');
          LocalStorage.resetUserLocalStorage();
        }
      }
    }else{
        if($state.current.name=='Home')
        {
          console.log('here state');
          $state.go('logOut');
        }
      }
  });
  //Creating reference to firebase link
  function demoSignIn()
  {
  	var password='12345';
  	var email='muhc.app.mobile@gmail.com';
  	$scope.password=password;
    $scope.email=email;
    signin(email, password);
  }

  $scope.submit = function (email,password) {
  	$scope.password=password;
    $scope.email=email;
    signin(email, password);
  };

  function signin(email, password){

      var username = email;
      var password = password;
      $scope.email=email;
      $scope.password=password;
      if(typeof email=='undefined'||email=='')
      {
          $scope.alert.type='danger';
          $scope.alert.content="Enter a valid email address!";
      }else if(typeof password=='undefined'||password=='')
      {
          $scope.alert.type='danger';
          $scope.alert.content="Invalid Password!";
      }else{
        myDataRef.authWithPassword({
            email: username,
            password: password
        }, authHandler);
      }
  }



  function authHandler(error, authData) {
    $rootScope.activeLogin='true';
    if (error) {
        console.log("Login Failed!", error);
        switch (error.code) {
          case "INVALID_EMAIL":
            console.log("The specified user account email is invalid.");
            $timeout(function(){
              $scope.alert.type='danger';
              $scope.alert.content="Enter a valid email address!";
            });
            break;
          case "INVALID_PASSWORD":
          $timeout(function(){
            $scope.alert.type='danger';
            $scope.alert.content="Invalid Password!";
          });
            break;
          case "INVALID_USER":
            $timeout(function(){
              $scope.alert.type='danger';
              $scope.alert.content="User does not exist!";
            });
            break;
          default:
            console.log("Error logging user in:", error);
            $timeout(function(){
              $scope.alert.type='danger';
              $scope.alert.content="Server error, check your internet connection!";
            });
        }
    } else {
      console.log(authData);
        var temporary=authData.password.isTemporaryPassword;
        console.log(temporary);
        if(temporary){
            ResetPassword.setUsername(authData.auth.uid);
            ResetPassword.setToken(authData.token)
            ResetPassword.setEmail($scope.email);
            ResetPassword.setTemporaryPassword($scope.password);
            navigatorForms.pushPage('views/login/verify-ssn.html');
        }else{
          UserAuthorizationInfo.setUserAuthData(authData.auth.uid, CryptoJS.SHA256($scope.password).toString(), authData.expires,authData.token);
          userId = authData.uid;
          //Obtaining fields links for patient's firebase
          var patientLoginRequest='request/'+userId;
          var patientDataFields='Users/'+userId;
          //Updating Patients references to signal backend to upload data
          //myDataRef.child(patientLoginRequest).update({LogIn:true});
          //Setting The User Object for global Application Use
          console.log($scope.email);
          var authenticationToLocalStorage={
                  UserName:authData.uid,
                  Password: CryptoJS.SHA256($scope.password).toString(),
                  Expires:authData.expires,
                  Email:$scope.email,
                  Token:authData.token
          }
          $rootScope.refresh=true;
          window.localStorage.setItem('UserAuthorizationInfo', JSON.stringify(authenticationToLocalStorage));
          console.log(UserAuthorizationInfo.getUserAuthData());
          console.log("Authenticated successfully with payload:", authData);
          $rootScope.activeLogin='false';
          RequestToServer.sendRequest('Login');
          $state.go('loading');
        }

    }
}
}]);
