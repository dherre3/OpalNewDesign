//
//  Created by David Herrera on 2015-05-04.
//  Copyright (c) 2015 David Herrera. All rights reserved.
//
var myApp = angular.module('MUHCApp');
myApp.controller('HomeController', ['$state','Appointments', 'CheckinService','$scope','Patient','UpdateUI', '$timeout','$filter','$cordovaNetwork','UserPlanWorkflow','$rootScope', 'tmhDynamicLocale','$translate', '$translatePartialLoader','RequestToServer', '$location','Documents','UserPreferences',function ($state,Appointments,CheckinService, $scope, Patient,UpdateUI,$timeout,$filter,$cordovaNetwork,UserPlanWorkflow, $rootScope,tmhDynamicLocale, $translate, $translatePartialLoader,RequestToServer,$location,Documents,UserPreferences) {
       /**
        * @ngdoc method
        * @name load
        * @methodOf MUHCApp.controller:HomeController
        * @callback MUHCApp.controller:HomeController.loadInfo
        * @description
        * Pull to refresh functionality, calls {@link MUHCApp.service:UpdateUI} service through the callback to update all the fields, then using
        * the {@link MUHCApp.service:UpdateUI} callback it updates the scope of the HomeController.
        *
        *
        */

        $scope.homeDeviceBackButton=function()
        {
          console.log('device button pressed do nothing');
          console.log(homeNavigator.getDeviceBackButtonHandler());

        }
        homeNavigator.on('prepop',function(){
          $location.hash('');
        });
        homePageInit();
        $scope.load = function($done) {
          RequestToServer.sendRequest('Refresh','All');
          var updated=false;
          UpdateUI.UpdateSection('All').then(function()
          {
            $timeout(function(){
              updated=true;
              homePageInit();
              $done();
            });
          });
          $timeout(function(){
              $done();
          },5000);
        };

        function homePageInit(){

          //Basic patient information
          $scope.PatientId=Patient.getPatientId();
          console.log($scope.PatientId);
          $scope.Email=Patient.getEmail();
          $scope.FirstName = Patient.getFirstName();
          $scope.LastName = Patient.getLastName();
          $scope.ProfileImage=Patient.getProfileImage();
          $scope.noUpcomingAppointments=false;
          //Setting up appointments tab
          setTabViews();
          //Setting up status
          settingStatus();
          //Setting up next appointment
          setUpNextAppointment();
          //start by initilizing variables
          setNotifications();
        }
    $scope.goToView=function(param)
    {
      if(Appointments.isThereNextAppointment())
      {
        if(UserPlanWorkflow.isCompleted())
        {
          //Status goes to next appointment details
          homeNavigator.pushPage('views/personal/appointment/individual-appointment.html');
        }else{
        homeNavigator.pushPage('views/personal/treatment-plan/individual-stage.html');
        }
      }else{
        if(UserPlanWorkflow.isCompleted())
        {
          //set active tab to personal, no future appointments, treatment plan completed
          tabbar.setActiveTab(1);
        }else{
          homeNavigator.pushPage('views/personal/treatment-plan/individual-stage.html');

        }
      }
    }
    function setNotifications()
    {
      //Obtaining language
      var language=UserPreferences.getLanguage();

      //Obtaining new documents and setting the number and value for last document
      var newDocuments=Documents.getUnreadDocuments();
      console.log(newDocuments);
      if(newDocuments.length>0)
      {
        $scope.numberOfNewDocuments=newDocuments;
        $scope.lastNewDocument=newDocuments[0];
        //Setting the language for the notification
        if(language=='EN')
        {
          $scope.lastNewDocument.Name=$scope.lastNewDocument.AliasName_EN;
          $scope.lastNewDocument.Description=$scope.lastNewDocument.AliasDescription_EN;
        }else{
          $scope.lastNewDocument.Name=$scope.lastNewDocument.AliasName_FR;
          $scope.lastNewDocument.Description=$scope.lastNewDocument.AliasDescription_FR;
        }
      }

    }
    function settingStatus()
    {
      if(!UserPlanWorkflow.isEmpty())
      {
        if(UserPlanWorkflow.isCompleted()){
          $scope.status='In Treatment';
        }else{
          $scope.status='Radiotherapy Treatment Planning';
        }
      }else{
        $scope.status='No treatment plan available';
      }
    }
    function setTabViews()
    {
      if(Appointments.isThereNextAppointment())
      {
        if(UserPlanWorkflow.isCompleted())
        {
          $scope.showAppointmentTab=false;
        }else{
          $scope.showAppointmentTab=true;
        }
      }else{
        $scope.showAppointmentTab=false;
      }
    }
    function setUpNextAppointment()
    {
      //Next appointment information
      if(Appointments.isThereAppointments())
      {
        if(Appointments.isThereNextAppointment()){
            var nextAppointment=Appointments.getUpcomingAppointment();
            $scope.noAppointments=false;
            $scope.appointmentShown=nextAppointment;
            $scope.titleAppointmentsHome='Next Appointment';

        }else{
          $scope.noUpcomingAppointments=true;
          var lastAppointment=Appointments.getLastAppointmentCompleted();
          $scope.nextAppointmentIsToday=false;
          $scope.appointmentShown=lastAppointment;
          $scope.titleAppointmentsHome='Last Appointment';
        }
      }else{
          $scope.noAppointments=true;
      }
    }
//Sets all the variables in the view.

}]);


myApp.controller('WelcomeHomeController',function($scope,Patient){
    $scope.FirstName = Patient.getFirstName();
    $scope.LastName = Patient.getLastName();
    $scope.welcomeMessage="We are happy to please you with some quality service";
});
