var myApp=angular.module('MUHCApp');
myApp.controller('AnnouncementsController',['$scope','$timeout','Announcements',function($scope,$timeout,Announcements){
  //Enter code here!!
  $scope.announcements=Announcements.getAnnouncements();

}]);

myApp.controller('IndividualAnnouncementController',['$scope','$timeout',function($scope,$timeout){



}]);
