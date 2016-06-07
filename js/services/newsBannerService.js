var myApp=angular.module('MUHCApp');
myApp.service('NewsBanner',['$cordovaNetwork','$filter',function($cordovaNetwork,$filter){
  var colorMappings =
  {
    'success':'#5cb85c',
    'danger':'#d9534f',
    'dead':'#777',
    'info':'#5bc0de'
  };
  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  function showBanner(type, callback, numberOfNotifications)
  {
    var message = '';
    if(type=='notifications')
    {
      var numberNot = (typeof numberOfNotifications !=='undefined')?numberOfNotifications:'';
      message =  numberNot +" "+ $filter('translate')("NEWNOTIFICATIONS");
    }else{
      message = $filter('translate')(alertTypes[type].Message);
    }
    if(typeof callback !=='undefined')
    {
       window.plugins.toast.showWithOptions(
    {
        message: message,
        duration:"short",
        position: "top",
        addPixelsY: 40,
        styling: {
          opacity:1.0,
          backgroundColor: alertTypes[type].Color, // make sure you use #RRGGBB. Default #333333
          textColor: '#F0F3F4', // Ditto. Default #FFFFFF
        }
      },
      callback,
      function(error){console.log(error);});
    }else{
       window.plugins.toast.showWithOptions(
      {
        message: message,
        duration:"short",
        position: "top",
        addPixelsY: 40,
        styling: {
          opacity:1.0,
          backgroundColor: alertTypes[type].Color, // make sure you use #RRGGBB. Default #333333
          textColor: '#F0F3F4', // Ditto. Default #FFFFFF
        }
      },
      function(result){console.log(result);},
      function(error){console.log(error);});
      
    }
  
   
  }
  var alertTypes = {
      'notifications':{Type:'notifications',Color:'#5bc0de',Message:"NEWNOTIFICATIONS",Duration:'finite'},
      'nointernet':{Type:'nointernet',Message:"NOINTERNETCONNECTION",Duration:'infinite'},
      'connected':{Type:'connected',Color:'#5cb85c',Message:"CONNECTED",Duration:'finite'}
    };
  return {
      setAlert:function()
      {
        if(app){
          if (!$cordovaNetwork.isOnline()) showBanner('nointernet'); 
        }
      },
      showAlert:function(type)
      {
        showBanner(type);
      },
      showNoInternetAlert:function()
      {
        showBanner('nointernet'); 
      },
      showConnectedAlert:function()
      {
        showBanner('connected'); 
      },
      showNotificationAlert:function(numberOfNotifications, callback)
      {
        showBanner('notifications', callback,numberOfNotifications);
      }
  };
  }]);
