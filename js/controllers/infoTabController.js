var myApp=angular.module('MUHCApp');
myApp.controller('InfoTabController',['$scope','$timeout',function($scope,$timeout){
  var tab=tabbar.getActiveTabIndex();
  var views=[
    {
      icon:'fa fa-home',
      color:'SteelBlue',
      name:'Home',
      description:'In your home tab you will be provided with news about your medical status, documents, hospital announcements and appointments.'
    },
    {
      icon:'ion-android-person',
      color:'maroon',
      name:'My Chart' ,
      description:'The my chart tab contains all the information regarding your electronic health data.'
    },
    {
      icon:'ion-ios-book',
      color:'darkblue',
      name: 'General',
      description:'In your general tab you will find useful information to facilitate your hospital visit.'
    },
    {
      icon:'ion-university',
      color:'Chocolate',
      name:'Education',
      description:'In your education tab you will find educational material specific to you treatment and general to radiation oncology.'
    },
  ];
  $scope.view=views[tab];
  }]);
