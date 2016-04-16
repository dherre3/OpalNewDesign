var myApp=angular.module('MUHCApp');
myApp.controller('EducationalMaterialController',function(NavigatorParameters, $scope, $timeout, $cordovaFileOpener2,$cordovaDevice,$cordovaDatePicker, FileManagerService, EducationalMaterial, UserPreferences){

//Android device backbutton
$scope.educationDeviceBackButton=function()
{
  console.log('device button pressed do nothing');

}
init();
//Init function
function init()
{
	//Obtaining materials from service
	var materials = EducationalMaterial.getEducationalMaterial();
	console.log(materials);
	//Setting the language for view
	materials = EducationalMaterial.setLanguageEduationalMaterial(materials);
	//Attaching to scope
	$scope.edumaterials = materials;
}

//Function to decide whether or not to show the header
$scope.showHeader = function(index)
{
	if(index == 0)
	{
		return true;
	}else if($scope.edumaterials[index-1].PhaseInTreatment !== $scope.edumaterials[index].PhaseInTreatment)
	{
		return true;
	}
	return false;
}

$scope.goToEducationalMaterial = function (edumaterial)
{
	if(edumaterial.ReadStatus == '0')
	{
		edumaterial.ReadStatus ='1';
		EducationalMaterial.readEducationalMaterial(edumaterial.EducationalMaterialSerNum);
	}
	var result = EducationalMaterial.openEducationalMaterial(edumaterial);
	console.log(result);
	if(result !== -1)
	{
		NavigatorParameters.setParameters({'Navigator':'educationNavigator','Post':edumaterial});
		educationNavigator.pushPage(result.Url);
	}
}


$scope.open=function(type){

	//file:///data/data/com.example.hello/files/pdfs
	var url='';
	if(type=='RadBook')
	{
		url='./pdfs/radiotherapy_journey.pdf';
	}else if(type=='RadBreast')
	{
		url='./pdfs/breast-radiotherapy-treatment-guidelines.pdf';
	}else if(type=='End of Treatment'){
		url='./pdfs/end-of-radiotherapy-treatment-guidelines.pdf';
	}
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(app){
		if(ons.platform.isAndroid()){
			var ref=window.open(url,'location=no');
		}else{
			var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
		}
	}else{
		var ref = window.open(url, '_blank', 'location=yes');
	}

};
$scope.openEmbed=function(type)
{
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(type=='What is Raditherapy?')
	{
		url='https://www.depdocs.com/opal/educational/pathway/PathwayTemplate1.php';
	}else if(type=='Your Radiotherapy Pathway')
	{
		url='https://www.depdocs.com/opal/educational/pathway/PathwayTemplate2.php';
	}
		educationNavigator.pushPage('./views/education/individual-material.html',{param:url});
/*	if(app){
		if(ons.platform.isAndroid()){
			var ref=window.open(url,'location=no');
		}else{
			var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
		}
	}else{
		educationNavigator.pushPage('./views/education/individual-material.html',{param:url});
	}*/
}
$scope.openVideo=function(){
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(app){
	  var ref = cordova.InAppBrowser.open('https://www.youtube.com/watch?v=c8nHbGPs5SE', '_blank', 'location=yes');
	}else{
	  var ref = window.open('https://www.youtube.com/watch?v=c8nHbGPs5SE', '_blank', 'location=yes');
	}
};

});
myApp.controller('EducationalMaterialTOCController',['$scope','$timeout','NavigatorParameters','UserPreferences','EducationalMaterial', function($scope,$timeout,NavigatorParameters,UserPreferences,EducationalMaterial){
	var param = NavigatorParameters.getParameters();
	var navigatorPage = param.Navigator;
	$scope.edumaterial= param.Post;
	console.log(param);
	console.log(	$scope.edumaterial);
	$scope.tableOfContents = $scope.edumaterial['TableContents'];
	console.log($scope.tableOfContents);
	$scope.tableOfContents = EducationalMaterial.setLanguageEduationalMaterial($scope.tableOfContents);

		$scope.goToDetails=function()
		{
			NavigatorParameters.setParameters({'Navigator':navigatorPage,'Post':$scope.edumaterial});
		}
		$scope.goToEducationalMaterial=function(edumaterial)
		{
			NavigatorParameters.setParameters({'Navigator':navigatorPage,'Post':edumaterial});
			var url = './views/education/individual-material.html';
			window[navigatorPage].pushPage(url);
		}
}]);

myApp.controller('IndividualEduMaterialController',['$scope','$timeout','NavigatorParameters','EducationalMaterial', function($scope,$timeout,NavigatorParameters,EducationalMaterial){
	var parameters = NavigatorParameters.getParameters();
	var material = parameters.Post;
	var navigatorName = parameters.Navigator;
	$scope.notLoaded=true;
	material = EducationalMaterial.setLanguageEduationalMaterial(material);
	$scope.goToOptions=function()
	{
		NavigatorParameters.setParameters({'view':'Educational'});
	}
	console.log(material);
	$.get(material.Url, function(res) {

		 console.log("res", res.replace(/(\r\n|\n|\r)/gm, " "));
			 $timeout(function(){
				 $scope.notLoaded=false;
				 $scope.htmlBind=res;
			 });

	 });
}]);
