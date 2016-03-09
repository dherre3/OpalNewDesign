var myApp=angular.module('MUHCApp');
myApp.service('Questionnaires',[function(){
	return{
		setQuestionnaires:function()
		{

		},
		getQuestionnaires:function()
		{
			return [{Question:'asdas?',Type:'scale'},{},{}];
		}
	}


}]);