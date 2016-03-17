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
    var lastUpdateTimestamp={};
    function initTimestamps(time)
    {

      lastUpdateTimestamp={
        'All':time,
        'Appointments':time,
        'Messages':time,
        'Documents':time,
        'Tasks':time,
        'Doctors':time,
        'LabTests':time,
        'Patient':time,
        'Notifications':time
      };
      console.log(lastUpdateTimestamp);
    }
    function obtainTimestamp(content)
    {
      if(typeof content=='undefined')
      {
        return lastUpdateTimestamp.All;
      }else if(angular.isArray(content))
      {
        var min=Infinity;
        for (var i = 0; i < content.length; i++) {
          if(min>lastUpdateTimestamp[content[i]])
          {
            min=lastUpdateTimestamp[content[i]];
          }
        }
        return min;
      }else{
        return lastUpdateTimestamp[content];
      }
    }
    return{
        sendRequest:function(typeOfRequest,content){
          //Deciding whether is an app or a website
          console.log('I am in there');
          var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
          var userID=UserAuthorizationInfo.UserName;
          var token=UserAuthorizationInfo.Token;
          var time=(new Date()).getTime();
          var encryptedRequestType=EncryptionService.encryptData(typeOfRequest);
          var timestamp=null;
          console.log(typeOfRequest);
          if(typeOfRequest=='Login'||typeOfRequest=='Resume')
          {
              initTimestamps(time);
          }else if(typeOfRequest=='Refresh')
          {
            console.log(timestamp);
            timestamp=obtainTimestamp(content);
            console.log(lastUpdateTimestamp);
          }
          content= EncryptionService.encryptData(content);
          if(app){
            //If online send request as normal
              if($cordovaNetwork.isOnline()){
                Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier, 'Token':token, 'UserID': userID, 'Parameters':content,'Timestamp':timestamp });
              }else{
                //If offline notify the patient and ask to connect to the internet
                navigator.notification.alert('No changes will be reflected at the hospital. Connect to the internet to perform this action, ',function(){},'Internet Connectivity','Ok');
              }
          }else{
            //If its not an app just try sending the request
            Ref.push({ 'Request' : encryptedRequestType,'DeviceId':identifier,'Token':token,  'UserID': userID, 'Parameters':content,'Timestamp':timestamp});
          }

        },
        updateTimestamps:function(content,time)
        {
          if(typeof content=='undefined')
          {
            initTimestamps(time);
          }else if(angular.isArray(content))
          {
            for (var i = 0; i < content.length; i++) {
              lastUpdateTimestamp[content[i]]=time;
            }
          }else{
            lastUpdateTimestamp[content]=time;
          }
        },
        getIdentifier:function()
        {
          return identifier;
        }
    };



});
