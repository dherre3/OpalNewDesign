var myApp=angular.module('MUHCApp');
/**
*
*
*
*
**/
myApp.service('Notifications',['$rootScope','$filter','RequestToServer','LocalStorage', function($rootScope,$filter,RequestToServer,LocalStorage){
    var Notifications=[];
    var notificationsLocalStorage=[];
    function setNotificationsNumberAlert(){
        $rootScope.TotalNumberOfNews=$rootScope.Notifications+$rootScope.NumberOfNewMessages;
        if($rootScope.TotalNumberOfNews===0)$rootScope.TotalNumberOfNews='';
        if($rootScope.NumberOfNewMessages===0) $rootScope.NumberOfNewMessages='';
        if($rootScope.Notifications===0) {
            $rootScope.Notifications='';
            $rootScope.noNotifications=true;
        }else{
            $rootScope.noNotifications=false;
        }
    }
    function addUserNotifications(notifications)
    {
      if(typeof notifications==='undefined'){
          setNotificationsNumberAlert();
         return;
      }
      var temp=angular.copy(notifications);
      for (var i = 0; i < notifications.length; i++) {
          temp[i].DateAdded=$filter('formatDate')(temp[i].DateAdded);
          if(temp[i].ReadStatus==='0'){
              $rootScope.Notifications+=1;
          }
          Notifications.push(temp[i]);
          notificationsLocalStorage.push(notifications[i]);
      };
      console.log(Notifications);
      Notifications=$filter('orderBy')(Notifications,'DateAdded',true);
      console.log(Notifications);
      LocalStorage.WriteToLocalStorage('Notifications',notificationsLocalStorage);
      setNotificationsNumberAlert();
    }
    return{
        setUserNotifications:function(notifications){
            Notifications=[];
            notificationsLocalStorage=[];
            $rootScope.Notifications=0;
            addUserNotifications(notifications);
        },
        updateUserNotifications:function(notifications)
        {
          addUserNotifications(notifications);
        },
         getUserNotifications:function(){
            return Notifications;
        },
        getLastNotification:function()
        {
          if(Notifications.length==0)
          {
            return -1;
          }else{
            return Notifications[0];
          }
        },
        setNotificationReadStatus:function(notificationIndex){
            Notifications[notificationIndex].ReadStatus='1';
            RequestToServer.sendRequest('Notification',Notifications[notificationIndex].NotificationSerNum);
        },
        getNotificationReadStatus:function(notificationIndex){
            return Notifications[notificationIndex].ReadStatus;
        }
    };

}]);
