var myApp=angular.module('MUHCApp');
myApp.controller('TabsController',['$scope','$timeout','$translate','$translatePartialLoader',function($scope,$timeout,$translate,$translatePartialLoader){
  //Enter code here!!
  console.log('inside tabs controller');
  $translatePartialLoader.addPart('all-views');


  }]);
myApp.controller('personalTabController',['$scope','$timeout','Appointments','UserPlanWorkflow','TxTeamMessages','Documents','$location','RequestToServer','UpdateUI','NavigatorParameters',function($scope,$timeout,Appointments,UserPlanWorkflow,TxTeamMessages,Documents,$location,RequestToServer,UpdateUI,NavigatorParameters){
  personalNavigator.on('prepop',function(){
    setNewsNumbers();
  });
  setNewsNumbers();
  //Setting up numbers on the
  function setNewsNumbers()
  {
    $scope.appointmentsUnreadNumber = Appointments.getNumberUnreadAppointments();
    $scope.documentsUnreadNumber = Documents.getNumberUnreadDocuments();
    $scope.txTeamMessagesUnreadNumber = TxTeamMessages.getUnreadTxTeamMessages();
  }
  $scope.goToStatus = function()
  {
    NavigatorParameters.setParameters({'Navigator':'personalNavigator'});
    personalNavigator.pushPage('views/home/status/status.html');
  }
  $scope.personalDeviceBackButton=function()
  {
    console.log('device button pressed do nothing');

  }
  $scope.load = function($done) {
    RequestToServer.sendRequest('Refresh','Appointments');
    var updated=false;
    UpdateUI.update('Appointments').then(function()
    {
      $timeout(function(){
        updated=true;
        console.log(Appointments.getUserAppointments());
        $done();
      });
    });
    $timeout(function(){
        $done();
    },5000);
  };

  //Setting up Appointments status
  if(Appointments.isThereNextAppointment())
  {
    $scope.appointmentTitle="Upcoming Appointment:";
    $scope.appointment=Appointments.getUpcomingAppointment();
  }else{
    $scope.appointmentTitle="Last Appointment:";
    $scope.appointment=Appointments.getLastAppointmentCompleted();
  }

  //Setting up status of treament plan
  if(UserPlanWorkflow.isCompleted())
  {
    console.log('completed')
    $scope.nameCurrentStage="Completed";
  }else{
    var index=UserPlanWorkflow.getNextStageIndex();
    $scope.outOf="Stage "+index+' of 6';
  }




}]);
myApp.controller('generalTabController',['$scope','$timeout','Announcements','Notifications',function($scope,$timeout,Announcements,Notifications){
//Enter code here!!
setNewsNumbers();
generalNavigator.on('prepop',function(){
  setNewsNumbers();
});
function setNewsNumbers()
{
  $scope.announcementsUnreadNumber = Announcements.getNumberUnreadAnnouncements();
  $scope.notificationsUnreadNumber = Notifications.getNumberUnreadNotifications();
}
$scope.generalDeviceBackButton=function()
{
  console.log('device button pressed do nothing');

}
$scope.backButtonPressed=function()
{
  console.log('backbuttonpressed');
}


}]);
