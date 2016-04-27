angular.module('MUHCApp').controller('MainController', ["$state",'$rootScope','FirebaseService','NewsBanner','NativeNotification',function ($state,$rootScope,FirebaseService,NewsBanner,NativeNotification) {
    $state.transitionTo('logIn');

    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if(app)
    {
      setTimeout(function()
      {
        var push = PushNotification.init({
            ios: {
                alert: "true",
                badge: true,
                sound: 'true',
                clearBadge:'true'
            }
        });
        push.on('notification', function(data) {
          NativeNotification.showNotificationAlert(data.message);
            var urlMedia = 'sounds/'+data.sound;
            var media = new Media(urlMedia);
            media.play();
            console.log(data.message);
            media.play({ numberOfLoops: 2 });
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);
        });
        push.on('error', function(e) {
            console.log(e);
        });
        push.setApplicationIconBadgeNumber(function() {
            console.log('success');
        }, function() {
            console.log('error');
        }, 3);
        PushNotification.hasPermission(function(data) {
            if (data.isEnabled) {
                console.log('isEnabled');
            }
        });
        push.on('registration', function(data) {
            console.log(data.registrationId);
        });
      },3000)

      document.addEventListener("offline", function(){
        NewsBanner.showAlert('nointernet');
        console.log('offline');
      }, false);
      document.addEventListener("online", function(){
        NewsBanner.showAlert('connected');
        console.log('online');
      }, false);
    }else{
      window.addEventListener('online',  function(){
        console.log('online');
        NewsBanner.showAlert('connected');
      });
      window.addEventListener('offline', function(){
        console.log('offline');
        NewsBanner.showAlert('nointernet');
      });
    }

    //Firebase.getDefaultConfig().setPersistenceEnabled(true);
}]);
