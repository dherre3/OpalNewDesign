var myApp=angular.module('MUHCApp');
myApp.service('NativeNotification',[function(){

  return {
    showNotificationAlert:function(message)
    {
      var mod=undefined;
      if(ons.platform.isAndroid())
      {
        mod='material';
      }
      ons.notification.alert({
        message: message,
        modifier: mod
      });
    },
    showNotificationConfirm:function(message,confirmCallback, cancelCallback)
    {
      ons.notification.confirm({
        message: 'Problems with server, would you like to load your most recent saved data from the device?',
        modifier: mod,
        callback: function(idx) {
          switch (idx) {
            case 0:
              cancelCallback();
              break;
            case 1:
              confirmCallback();
            break;
          }
        }
      });
    }
  }



  }]);
