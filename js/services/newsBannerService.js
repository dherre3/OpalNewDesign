var myApp=angular.module('MUHCApp');
myApp.service('NewsBanner',['$rootScope','$timeout',function($rootScope,$timeout){
  var colorMappings =
  {
    'success':'#5cb85c',
    'danger':'#d9534f',
    'dead':'#777',
    'info':'#5bc0de'
  };
  var alertTypes = {
    'notifications':{Type:'notifications',Color:colorMappings['info'],Icon:'ion-arrow-down-c', Message:{'EN':'New notifications','FR':'Nouevelle news'}},
    'nointernet':{Type:'nointernet',Color:colorMappings['dead'],Message:{'EN':'No internet connection','FR':'Parle france'}},
    'connected':{Type:'connected',Color:colorMappings['success'],Message:{'EN':'Connected','FR':'Parle france'}}
  }
  return {
      setAlert:function(type,show)
      {
         alertTypes[type].show = true;
         $rootScope.alertBanner = alertTypes[type];
         console.log($rootScope.alertBanner);
      },
      hideAlert:function()
      {
        $rootScope.alertBanner.show = false;
      }
  };
  }]);
