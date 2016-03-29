var myApp=angular.module('MUHCApp');
myApp.controller('TxTeamMessagesController',['$scope','$timeout','TxTeamMessages','UserPreferences','NavigatorParameters',function($scope,$timeout,TxTeamMessages,UserPreferences,NavigatorParameters){
  //Obtaining parameters
  var messages = TxTeamMessages.getTxTeamMessages();
  var language = UserPreferences.getLanguage();
  console.log(messages);
  init();
  //Initializing name and body of post
  function init()
  {
    for (var i = 0; i < messages.length; i++) {
      if(language=='EN'){
        messages[i].Name = messages[i].PostName_EN;
        messages[i].Content = messages[i].Body_EN;
      }else{
        messages[i].Name = messages[i].PostName_FR;
        messages[i].Content = messages[i].Body_FR;
      }
    }
    $scope.txTeamMessages=messages;
  }

  //Function that goes to individual team message
  $scope.goToTeamMessage=function(message)
  {
    console.log(message);
    NavigatorParameters.setParameters(message);
    personalNavigator.pushPage('./views/personal/treatment-team-messages/individual-team-message.html');
  }
}]);
myApp.controller('IndividualTxTeamMessageController',['$scope','$timeout','NavigatorParameters',function($scope,$timeout,NavigatorParameters){


  $scope.message=NavigatorParameters.getParameters();

}]);
