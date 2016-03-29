var myApp=angular.module('MUHCApp');
/**
*
*
*
*
**/
myApp.service('Notifications',['$rootScope','$filter','RequestToServer','LocalStorage','Announcements','TxTeamMessages','Appointments','Messages','Documents', 'LabResults','EducationalMaterial', 'UserPreferences', function($rootScope,$filter,RequestToServer,LocalStorage,Announcements, TxTeamMessages,Appointments,Messages, Documents,LabResults,EducationalMaterial, UserPreferences){
    var Notifications=[];
    var notificationsLocalStorage=[];
    var groupNotifications={};
    var notificationTypes={
      'Document':
      {
        icon:'fa fa-folder',
        color:'darkorange',
        searchFunction:Documents.getDocumentBySerNum,
        NameEN:'AliasName_EN',
        NameFR:'AliasName_FR',
        PageUrl:'./views/personal/my-chart/individual-document.html'
      },
      'TxTeamMessage':
      {
        icon:'fa fa-user-md ',
        color:'Olive',
        searchFunction:TxTeamMessages.getTxTeamMessageBySerNum

      },
      'Announcement':{
        icon:'ion-speakerphone',
        color:'navy',
        searchFunction:Announcements.getAnnouncementBySerNum
      },
      'EducationalMaterial':{
        icon:'fa fa-book',
        color:'purple',
        searchFunction:EducationalMaterial.getEducationaMaterialBySerNum
      },
      'NextAppointment':{
        icon:'fa fa-calendar',
        color:'DarkSlateGrey',
        searchFunction:Appointments.getAppointmentBySerNum
      },
      'AppointmentModified':{
        icon:'fa fa-calendar',
        color:'FireBrick',
        searchFunction:Appointments.getAppointmentBySerNum
      },
      'NewMessage':{
        icon:'ion-chatbubbles',
        color:'DeepSkyBlue'
      },
      'NewLabResult':{
        icon:'ion-erlenmeyer-flask',
        color:'purple'
      },
      'Other':{
        icon:'fa fa-bell',
        color:'darkred'
      }
    };




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
          temp[i].icon = notificationTypes[temp[i].NotificationType].icon;
          temp[i].color = notificationTypes[temp[i].NotificationType].color;
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
        getGroupNotifications:function()
        {
          groupNotifications={};
          var language = UserPreferences.getLanguage();
          for (var i = 0; i < Notifications.length; i++) {
            if(Notifications[i].ReadStatus == '0')
            {
              if(!groupNotifications.hasOwnProperty(Notifications[i].NotificationType))
              {
                groupNotifications[Notifications[i].NotificationType]={};
                var not=notificationTypes[Notifications[i].NotificationType]['searchFunction'](Notifications[i].RefTableRowSerNum);
                (language=='EN')? not.Name=not[notificationTypes[Notifications[i].NotificationType]['NameEN']]:not.Name=not[notificationTypes[Notifications[i].NotificationType]['NameFR']];
                groupNotifications[Notifications[i].NotificationType].Notifications=[not];
                groupNotifications[Notifications[i].NotificationType].Icon = notificationTypes[Notifications[i].NotificationType].icon;
                groupNotifications[Notifications[i].NotificationType].Color = notificationTypes[Notifications[i].NotificationType].color;
                groupNotifications[Notifications[i].NotificationType].PageUrl = notificationTypes[Notifications[i].NotificationType].PageUrl;

                var content = '';
                (language=='EN') ? content = Notifications[i].Name_EN : content = Notifications[i].Name_FR;
                groupNotifications[Notifications[i].NotificationType].Title = content;
                groupNotifications[Notifications[i].NotificationType].Number = 1;
              }else{
                groupNotifications[Notifications[i].NotificationType].Notifications.push(notificationTypes[Notifications[i].NotificationType]['searchFunction'](Notifications[i].RefTableRowSerNum));
                groupNotifications[Notifications[i].NotificationType].Number++;
              }
            }
          }
          return groupNotifications;
        },
        readGroupNotifications:function(notificationType)
      {
          for (var i = 0; i < groupNotifications[notificationType].Notifications.length; i++) {
            for (var j = 0; j < Notifications.length; j++) {
                if(Notifications[j].NotificationSerNum == groupNotifications[notificationType].Notifications[i].NotificationSerNum)
                {
                    Notifications[j].ReadStatus = '1';
                    RequestToServer.sendRequest('Read',{'Id':serNum, 'Field':'Notifications'});
                }
            }
          }
        },
        getNumberUnreadNotifications:function()
        {
          var number=0;
          for (var i = 0; i < Notifications.length; i++) {
            if(Notifications[i].ReadStatus == '0')
            {
              number++;
            }
          }
          return number;
        },
        getUnreadNotifications:function()
        {
          var array=[];
          for (var i = 0; i < Notifications.length; i++) {
            if(Notifications[i].ReadStatus == '0')
            {
              array.push(Notifications[i]);
            }
          }
          return array;
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
