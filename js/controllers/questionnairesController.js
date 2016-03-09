var myApp=angular.module('MUHCApp');
myApp.controller('QuestionnairesController'['$scope','Questionnaires',function($scope,Questionnaires ){
	
	$scope.questions=Questionnaires.getQuestionnaires();
	

}]);