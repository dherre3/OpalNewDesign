var myApp=angular.module('MUHCApp');
/**
*
*
*
**/
myApp.service('RequestToServer',function(UserAuthorizationInfo, EncryptionService, FirebaseService, $http,$q,$cordovaNetwork){
    var identifier='';
    var Ref=new Firebase(FirebaseService.getFirebaseUrl()+'requests');
     var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
      if(app){
          identifier=device.uuid;
      }else{
          identifier='browser';
      }
    return{
        sendRequest:function(typeOfRequest,content){
          var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
          
          if(app){
              if($cordovaNetwork.isOnline()){

                
                var userID=UserAuthorizationInfo.UserName;
                var token=UserAuthorizationInfo.Token;
                console.log(token);
                var encryptedRequestType=EncryptionService.encryptData(typeOfRequest);
                content= EncryptionService.encryptData(content);

                console.log(content);

                if(typeOfRequest=='Login'||typeOfRequest=='Logout')
                {
                  Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID': userID })
                }else if(typeOfRequest=='Refresh')
                {
                  Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID': userID, 'Parameters':content })
                }
                else if (typeOfRequest=="NewNote"||typeOfRequest=="EditNote"||typeOfRequest=="DeleteNote"||typeOfRequest=="AccountChange"||typeOfRequest=="AppointmentChange"||typeOfRequest=="Message"||typeOfRequest=="Feedback")
                {
                  Ref.push({'Request': encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID':userID, 'Parameters':content});
                }
                else if (typeOfRequest=='Checkin')
                {
                  Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'AppointmentSerNum' : content}});
                }
                else if (typeOfRequest=='MessageRead')
                {
                  Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'MessageSerNum' : content }});
                }
                else if (typeOfRequest=='NotificationRead')
                {
                  Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'NotificationSerNum' : content }});
                }else if(typeOfRequest=='MapLocation'){
                  Ref.push({'Request': encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID':userID, 'Parameters':content});
                }
              }else{
                //  navigator.notification.alert('No changes will be reflected at the hospital. Connect to the internet to perform this action, ',function(){},'Internet Connectivity','Ok');
              }
          }else{
            var userID=UserAuthorizationInfo.UserName;
            var token=UserAuthorizationInfo.Token;
            var encryptedRequestType=EncryptionService.encryptData(typeOfRequest);
            content= EncryptionService.encryptData(content);
            if(typeOfRequest=='Login'||typeOfRequest=='Logout')
            {
              Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID': userID })
            }else if(typeOfRequest=='Refresh')
            {
              Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier,'Token':token,  'UserID': userID, 'Parameters':content })
            }
            else if (typeOfRequest=="NewNote"||typeOfRequest=="EditNote"||typeOfRequest=="DeleteNote"||typeOfRequest=="AccountChange"||typeOfRequest=="AppointmentChange"||typeOfRequest=="Message"||typeOfRequest=="Feedback")
            {
              Ref.push({'Request': encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID':userID, 'Parameters':content});
            }
            else if (typeOfRequest=='Checkin')
            {
              Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'AppointmentSerNum' : content}});
            }
            else if (typeOfRequest=='MessageRead')
            {
              Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'MessageSerNum' : content }});
            }
            else if (typeOfRequest=='NotificationRead')
            {
              Ref.push({ 'Request' : encryptedRequestType, 'DeviceId':identifier,'Token':token, 'UserID':userID, 'Parameters':{'NotificationSerNum' : content }});
            }
          }
        },
        setIdentifier:function()
        {
          var r=$q.defer();
          var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
          if(app){
            identifier=device.uuid;
            r.resolve(device.uuid);
          }else{
              identifier='browser';
              r.resolve('browser');
          }
          return r.promise;
        },
        getIdentifier:function()
        {
          return identifier;
        }
    };



});
