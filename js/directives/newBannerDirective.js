angular.module('MUHCApp').directive('newsBanner', ['UserPreferences', '$timeout',function(UserPreferences,$timeout) {
  var language = UserPreferences.getLanguage();
  return {
    restrict: 'E',
    scope:{
      alertParameters:"="
    },
    template: "<div class=\"text-center element\" style=\"color:white;font-size:15px;background-color:DeepSkyBlue ;position: absolute;width:100vw;height:30px;top:0px;z-index:3\" ng-style=\"{'background-color':alertParameters.Color}\"><p style=\"vertical-align:middle;\"><strong> <i style=\"font-size:20px\" ng-class=\"alertParameters.Icon\" ></i> <span ng-show=\"language = 'FR'\">{{alertParameters.Message.FR}}</span><span ng-show=\"language = 'EN'\">{{alertParameters.Message.EN}}</span></strong></p></div>",
    link:function(scope, element, attrs) {
      scope.$watchCollection('alertParameters',function(newValue, oldValue){
        console.log(newValue);
        console.log(oldValue);
      element.addClass('active');
        if(typeof newValue !== 'undefined')
        {
          if(typeof oldValue !=='undefined'&&newValue.Type !== oldValue.Type)
          {
            initializeAlert(newValue);
          }else if(newValue.show == false)
          {
            element.removeClass('active').addClass('inactive');
          }else{
            initializeAlert(newValue);
          }
        }
        
      });
      scope.language = UserPreferences.getLanguage();
      function initializeAlert(alert)
      {
        console.log('initializing');
        element.addClass(alert.Icon);
        element.css({
          "background-color":alert.Color
        });
          if(element.hasClass("active"))
          {
            element.removeClass('active').addClass('inactive');
          }
          $timeout(function()
          {
            element.removeClass('inactive').addClass('active');
            console.log(element);
          },1000);
          if(alert.Type!=='nointernet')
          {
            console.log('boom');
            setTimeout(function () {
              element.removeClass('active').addClass('inactive');
            }, 3000);
          }
      }
    }
  };
}]);
