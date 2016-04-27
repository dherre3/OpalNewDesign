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
    'notifications':{Color:colorMappings['info'],Icon:'ion-arrow-down-c', Message:{'EN':'New notifications','FR':'Nouevelle news'}},
    'nointernet':{Color:colorMappings['dead'],Message:{'EN':'No internet connection','FR':'Parle france'}},
    'connected':{Color:colorMappings['success'],Message:{'EN':'Connected','FR':'Parle france'}}
  }
  return {
      showAlertCustom:function(message, number, color,duration)
      {
        $rootScope.alertBanner = {
          Color:color,
          Message:message
        };
        $('#news').removeClass('inactive').addClass('active');
        setTimeout(function () {

          $('#news').removeClass('active').addClass('inactive');
        }, duration);
      },
      showAlert:function(type)
      {
        var element = $('#news');
        if(element.hasClass("active"))
        {
          $('#news').removeClass('active').addClass('inactive');
        }
        $timeout(function()
        {
          $rootScope.alertBanner = alertTypes[type];
          console.log($rootScope.alertBanner);
          $('#news').removeClass('inactive').addClass('active');
        },1000);

        if(type!=='nointernet')
        {
          console.log('boom');
          setTimeout(function () {
            $('#news').removeClass('active').addClass('inactive');
          }, 3000);
        }

      },
      hideAlert()
      {
        $('#news').removeClass('inactive').addClass('active');
        setTimeout(function () {
          $('#news').removeClass('active').addClass('inactive');
        }, 4000);
      }
  }
  }]);
