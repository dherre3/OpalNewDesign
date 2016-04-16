var myApp=angular.module('MUHCApp')
myApp.controller('accountSettingController', ['Patient', 'UserPreferences','$scope','$timeout','UpdateUI', 'RequestToServer','$timeout','$translatePartialLoader', '$filter',function (Patient, UserPreferences, $scope, $timeout,UpdateUI, RequestToServer,$timeout,$translatePartialLoader,$filter) {
    //Patient.setData($rootScope.FirstName, $rootScope.LastName, $rootScope.Pictures, $rootScope.TelNum, $rootScope.Email);
    //console.log(Patient.getFirstName());
    //var setNameFunction= Patient.setFirstName('as');
    $translatePartialLoader.addPart('settings');

    $scope.closeAlert = function () {

        $rootScope.showAlert=false;
    };
    $scope.accountDeviceBackButton=function()
    {
      console.log('device button pressed do nothing');

    }
    function loadInfo(){
        UpdateUI.update('Patient').then(function(){
            accountInit();
        });
    };


         $scope.load2 = function($done) {
        RequestToServer.sendRequest('Refresh','Patient');
          $timeout(function() {
            loadInfo();
                $done();
          }, 500);
        };
    accountInit();
    settingsNavigator.on('postpop',function(){
      $timeout(function(){
        accountInit();
      });

    });
    function accountInit(){
      var nativeCalendar=Number(window.localStorage.getItem('NativeCalendar'));
      $scope.passFill='********';
      $scope.mobilePlatform=(ons.platform.isIOS()||ons.platform.isAndroid());
      (nativeCalendar)?$scope.checkboxModelCalendar=nativeCalendar:$scope.checkboxModelCalendar=0;
      $scope.checkboxModel=UserPreferences.getEnableSMS();
      $scope.FirstName = Patient.getFirstName();
      $scope.LastName = Patient.getLastName();
      $scope.PatientId=Patient.getPatientId();
      $scope.Alias=Patient.getAlias();
      $scope.Email = Patient.getEmail();
      $scope.TelNum = Patient.getTelNum();
      $scope.Language=UserPreferences.getLanguage();
      console.log(UserPreferences.getLanguage());
      $scope.ProfilePicture=Patient.getProfileImage();
      $scope.passwordLength=7;
    }

    $scope.saveSettings=function(option){
        if($scope.mobilePlatform){
            var message=''
            if(option==='EnableSMS'){
                if($scope.checkboxModel===1){
                    message=$filter('translate')("ENABLESMSNOTIFICATIONQUESTION");
                }else{
                    message=$filter('translate')("DISABLESMSNOTIFICATIONQUESTION");
                }
                navigator.notification.confirm(message, confirmCallbackSMS, $filter('translate')("CONFIRMALERTSMSLABEL"), [$filter('translate')("CONTINUE"), $filter('translate')("CANCEL")] );
                function confirmCallbackSMS(index){
                    console.log(index);
                    if(index==1){
                        var objectToSend={};
                        objectToSend.FieldToChange='EnableSMS';
                        objectToSend.NewValue=$scope.checkboxModel;
                        UserPreferences.setEnableSMS(objectToSend.NewValue);
                        RequestToServer.sendRequest('AccountChange',objectToSend);


                    }else{
                        $timeout(function(){
                            ($scope.checkboxModel==1)?$scope.checkboxModel=0:$scope.checkboxModel=1;
                        });
                    }
                }
            }else if(option==='Calendar'){
                if($scope.checkboxModelCalendar===1){
                    message = $filter('translate')("ENABLECALENDARACCESSQUESTION");
                }else{
                    message=$filter('translate')("DISABLECALENDARACCESSQUESTION");
                }
                navigator.notification.confirm(message, confirmCallbackCalendar, $filter('translate')("CONFIRMALERTCALENDARLABEL"), [$filter('translate')("CONTINUE"),$filter('translate')("CANCEL")] );
                function confirmCallbackCalendar(index){
                    console.log(index);
                    if(index==1){
                        window.localStorage.setItem('NativeCalendar',$scope.checkboxModelCalendar);
                    }else{
                        $timeout(function(){
                            ($scope.checkboxModelCalendar==1)?$scope.checkboxModelCalendar=0:$scope.checkboxModelCalendar=1;
                        })
                    }
                }

            }
        }else{
             if(option==='EnableSMS'){
                var objectToSend={};
                objectToSend.FieldToChange='EnableSMS';
                objectToSend.NewValue=$scope.checkboxModel;
                UserPreferences.setEnableSMS(objectToSend.NewValue);
                RequestToServer.sendRequest('AccountChange',objectToSend);
            }
        }

    };
}]);



myApp.controller('ChangingSettingController',function($filter,$rootScope,FirebaseService, tmhDynamicLocale, $translate, UserPreferences,Patient,RequestToServer,$scope,$timeout,UpdateUI, UserAuthorizationInfo){
  console.log(UserAuthorizationInfo);

    accountChangeSetUp();
    function accountChangeSetUp(){
    var fieldsMappings = {"Font-size":"FONTSIZE","Language":"LANGUAGE","Tel. Number" :"PHONENUMBER","Password":"PASSWORD","Email":"EMAIL","Alias":"ALIAS"};
    var page = settingsNavigator.getCurrentPage();
    var parameters=page.options.param;
    $scope.alertClass="bg-success updateMessage-success";
    $scope.value=parameters;
    console.log(fieldsMappings);
    $scope.valueLabel = $filter('translate')(fieldsMappings[parameters]);
    $scope.personal=true;
    $scope.type1='text';
    $scope.updateMessage="HASBEENUPDATED";
    if(parameters==='Alias'){
        $scope.newValue=Patient.getAlias();
        $scope.instruction="ENTERYOURALIAS";
    }else if(parameters==='Last Name'){
        $scope.newValue=Patient.getLastName();
        $scope.instruction="ENTERYOURLASTNAME"
    }else if(parameters==='Tel. Number'){
        $scope.newValue=Patient.getTelNum();
        $scope.instruction="ENTERNEWTELEPHONE";
    }else if(parameters==='Email'){
        $scope.type1='email';
        $scope.type2='password';
        $scope.newValue='';
        $scope.oldValue='';
        $scope.placeHolder=$filter('translate')("ENTERPASSWORD");
        $scope.instruction="ENTEREMAILADDRESS";
        $scope.instructionOld="ENTERPASSWORD";
    }else if(parameters==='Password'){
        $scope.type1='password';
        $scope.type2='password';
        $scope.newValue='';
        $scope.oldValue='';
        var label = $filter('translate')('ENTEROLD')
        $scope.placeHolder=label +$scope.valueLabel;
        $scope.instruction="ENTERNEWPASSWORD";
        $scope.instructionOld="ENTEROLDPASSWORD";
    }else if(parameters==='Language'){
        var value=UserPreferences.getLanguage();
        $scope.instruction='Select language';
        $scope.personal=false;
        $scope.fontUpdated=false;
        $scope.pickLanguage=value;
        $scope.firstOption='EN';
        $scope.secondOption='FR';
    }else if(parameters==='Font-size')
    {
        var value=UserPreferences.getFontSize();
         $scope.firstOption='medium';
        $scope.secondOption='large';
        $scope.instruction="SELECTFONTSIZE";
        $scope.personal=false;
        $scope.fontUpdated=true;
        $scope.pickFont=value;
    }
}

    $scope.updateValue=function(val){
        if(val=='Password'){
            changePassword();
        }else if(val=='Email'){
            changeEmail();
        }else{
            objectToSend={};
            valChange=val.replace(' ','');
            if(val=='Tel. Number'){
                valChange=valChange.replace('.','');
                valChange=valChange.substring(0,6);
                objectToSend.FieldToChange=valChange;
            }else{
                objectToSend.FieldToChange=valChange;
            }

            objectToSend.NewValue=$scope.newValue;
            RequestToServer.sendRequest('AccountChange',objectToSend);
            $timeout(function(){
                RequestToServer.sendRequest('Refresh','Patient');
                $scope.newUpdate=true;
                UpdateUI.UpdateSection('Patient');
            },2000);
        }
    };
    $scope.changeFont=function(newVal)
    {
      UserPreferences.setFontSize(newVal);
    }
    $scope.changeLanguage=function(val){
        console.log(val);
        var objectToSend={};
        objectToSend.NewValue=val;
        objectToSend.FieldToChange='Language';
        RequestToServer.sendRequest('AccountChange',objectToSend);
        UserPreferences.setLanguage(val);
        if(val==='EN'){
            tmhDynamicLocale.set('en');
            $translate.use('en');
        }else{
            tmhDynamicLocale.set('fr');
            $translate.use('fr');
        }
        $scope.newUpdate=true;

    };


    function changePassword() {
        var ref = new Firebase(FirebaseService.getFirebaseUrl());
            ref.changePassword({
                email: Patient.getEmail(),
                oldPassword: $scope.oldValue,
                newPassword: $scope.newValue
            }, function(error) {
                if (error) {
                  switch (error.code) {
                    case "INVALID_PASSWORD":
                      console.log("The specified user account password is incorrect.");
                      $timeout(function(){
                          $scope.alertClass="danger";
                          $scope.updateMessage='Password is invalid!';
                      });
                      break;
                    case "INVALID_USER":
                      console.log("The specified user account does not exist.");
                      break;
                    default:
                      console.log("Error changing password:", error);
                      $timeout(function(){
                          $scope.alertClass="danger";
                         $scope.updateMessage='Error changing your Password!';
                      });
                  }
                } else {
                  console.log("User password changed successfully!");
                  var objectToSend={};
                  objectToSend.FieldToChange='Password';
                  objectToSend.NewValue=$scope.newValue;
                  RequestToServer.sendRequest('AccountChange',objectToSend);
                  UserAuthorizationInfo.setPassword($scope.newValue);
                  $timeout(function(){
                      $scope.alertClass="bg-success updateMessage-success";
                      $scope.updateMessage='User password was successfully changed!';
                      $scope.newUpdate=true;
                  });
                }
              });
            };

    function changeEmail() {
        var ref = new Firebase(FirebaseService.getFirebaseUrl());

        ref.changeEmail({
            oldEmail: Patient.getEmail(),
            newEmail: $scope.newValue,
            password: $scope.oldValue
        }, function (error) {
            if (error) {
                  $timeout(function(){
                   $scope.alertClass="bg-danger updateMessage-error";
                   $scope.newUpdate=true;
                   $scope.updateMessage='Password is not correct!';
                });
                console.log("Error changing email:", error);
            } else {
                var objectToSend={};
                objectToSend.FieldToChange='Email';
                objectToSend.NewValue=$scope.newValue;
                Patient.setEmail($scope.newValue);
                RequestToServer.sendRequest('AccountChange',objectToSend);
                $timeout(function(){
                    UpdateUI.UpdateUserFields().then(function(){
                        $scope.updateMessage='User email was successfully updated!';
                        $scope.newUpdate=true;
                    });
                },2000);
            }
        });
    }

});
