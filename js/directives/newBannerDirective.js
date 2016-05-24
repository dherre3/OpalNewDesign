'use strict';
/**
 * @ngdoc directive
 * @name bannersProjectApp.directive:newsBanner
 * @description
 * # newsBanner
 */
angular.module('MUHCApp').directive('newsBanner', function ($rootScope,$timeout, UserPreferences, $q,$window,$cordovaNetwork) {
    var colorMappings =
    {
      'success':'#5cb85c',
      'danger':'#d9534f',
      'dead':'#777',
      'info':'#5bc0de'
    };
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    var stack = [];
    var alertTypes = {
      'notifications':{Type:'notifications',Color:colorMappings.info,Icon:'ion-arrow-down-c', Message:{'EN':'New notifications','FR':'Nouevelle news'},Duration:'finite'},
      'nointernet':{Type:'nointernet',Color:colorMappings.dead,Icon:'ion-alert-circled', Message:{'EN':'No internet connection','FR':'Parle france'},Duration:'infinite'},
      'connected':{Type:'connected',Color:colorMappings.success,Icon:'ion-wifi', Message:{'EN':'Connected','FR':'Parle france'},Duration:'finite'}
    };
    return {
      template: "<div class=\"text-center element-banner\" align = \"center\" style=\"width:100vw;color:white;font-size:15px;background-color:DeepSkyBlue ;position: absolute;width:100vw;height:30px;top:0px;z-index:3\" ng-style=\"\"><p style=\"vertical-align:middle;\"><strong> <i style=\"font-size:20px\" ng-class=\"alertParameters.Icon\" ></i> <strong></strong></p></div>",
      restrict: 'E',
      scope:{
        'type':'='
      },
      link: function postLink(scope, element, attrs) {
        var language = UserPreferences.getLanguage();
        if(app){
          if (!$cordovaNetwork.isOnline()) $rootScope.mainAlert = 'nointernet'; 
        }else{
          if (!navigator.onLine) $rootScope.mainAlert = 'nointernet'; 
        }
        
        element.addClass('element-banner');
           scope.$watch('type', function() {
          if(typeof scope.type !== 'undefined')
          {
            if(stack.length>0) 
            {
              removeAlert().then(function(){
                updateBanner();
              });             
            }else{
              updateBanner();
            }
            
          }
          });
        
       function removeAlert()
       {
          var r = $q.defer();
          element.removeClass('active-banner');
          var top = stack.pop();
          $timeout(function(){
            element.removeClass(top.Icon);
            r.resolve();
          },500);
          return r.promise;
       }
        
        function updateBanner()
        {
           
          scope.alertParameters = alertTypes[scope.type];
          element.addClass(alertTypes[scope.type].Icon);
          element.css(
            {'background-color':alertTypes[scope.type].Color,
            'color':'white',
            'width':'100vw',
            'height':'20px',
            'z-index':'2',
            'text-align':'center',
            'font-weight':'600'
            });  
            element.removeClass('inactive-banner');
            element.addClass('active-banner');
            stack.push(alertTypes[scope.type]);
          if(alertTypes[scope.type].Duration !== 'infinite')
          {
              $timeout(function(){
                removeAlert();
                delete $rootScope.mainAlert;
              },1500);
          }
          var message = (language === 'EN')?alertTypes[scope.type].Message.EN:alertTypes[scope.type].Message.FR;
          message = " "+message;
          element.text(message);
        }
        element.on('$destroy', function() {
          console.log('destroy');
        });
        
        
        
         
      }
    };
  });
