var myApp = angular.module('MUHCApp');

myApp.controller('InitSettingsController',function($scope, $timeout, NavigatorParameters, UserPreferences)
{
   var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    
   initSettings();
 
    function initSettings()
    {
       $scope.languageSwitch  = (UserPreferences.initializeLanguage()=='EN')?false:true;
       if(app){
        cordova.getAppVersion.getVersionNumber(function (version) {
            $timeout(function()
            {
              $scope.version = version;  
            }); 
        });
        }else{
            $scope.version = '0.0.1';  
        }  
    }
   $scope.changeLanguage = function(value)
  {
      console.log(value);
    if(value)
    {
      UserPreferences.setLanguage('FR');
    }else{
      UserPreferences.setLanguage('EN');
    }
  };
    
    $scope.goToRateThisApp = function()
    {
        
    };
    $scope.openDeviceSettings = function()
    {
        if(app && typeof cordova.plugins.settings.openSetting != undefined){
           cordova.plugins.settings.open(function(){
                console.log("opened settings")
            },
            function(){
                console.log("failed to open settings")
            });
        }
    }
    
    
    $scope.openPageLegal = function(type)
    {
        if(type == 0)
        {
             NavigatorParameters.setParameters({type:type, title:'Terms of Use'}); 
             initNavigator.pushPage('./views/init/init-legal.html');
        }else{
             NavigatorParameters.setParameters({type:type, title:'Privacy Policy'});
             initNavigator.pushPage('./views/init/init-legal.html');
   
        }
    
    };
    
    
});

myApp.controller('LegalController',function(){
    
})