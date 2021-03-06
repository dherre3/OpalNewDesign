/**
 * @name rate-material
 * @description Directive is the components in charge of the 5 start rating system, takes an educationalMaterialControlSerNum as parameter.
 * 
 * 
 */
angular.module('MUHCApp')
.directive('rateMaterial', function(Patient, RequestToServer) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        eduMaterialControlSerNum: '=serNum'
    },
    templateUrl: './views/education/rating-education-template-directive.html',
    link: function (scope, element) {

   	initRater();
	function initRater()
	{
        scope.rate = [];
		scope.submitted = false;
		scope.emptyRating = true;
		for(var i = 0; i < 5;i++)
		{
			scope.rate.push({
				'Icon':'ion-ios-star-outline'
			});
		}
	}
	scope.rateMaterial = function(index)
	{
		scope.emptyRating = false;
        scope.ratingValue = index+1;
		for(var i = 0; i < index+1;i++)
		{
			scope.rate[i].Icon = 'ion-star';
		}
		for(var i = index+1; i < 5;i++)
		{
			scope.rate[i].Icon = 'ion-ios-star-outline';
		}
	};
	scope.submit = function()
	{
        var patientSerNum = Patient.getUserSerNum();
        var edumaterialControlSerNum = scope.eduMaterialControlSerNum;
        RequestToServer.sendRequest('QuestionnaireRating',{'PatientSerNum':patientSerNum,'EducationalMaterialControlSerNum':edumaterialControlSerNum,'RatingValue':scope.ratingValue});
        scope.submitted = true;
        console.log('rating submitted');
	}
      
    }
  };
});