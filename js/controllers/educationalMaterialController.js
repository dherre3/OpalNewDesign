var myApp=angular.module('MUHCApp');
myApp.controller('EducationalMaterialController',function($scope, $timeout, $cordovaFileOpener2,$cordovaDevice,$cordovaDatePicker){

	$scope.educationDeviceBackButton=function()
  {
    console.log('device button pressed do nothing');

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
myApp.controller('individualEduMaterialController',['$scope','$timeout','$sce',function($scope,$timeout,$sce){
	var page=educationNavigator.getCurrentPage();
	var url=page.options.param;
	console.log(url);
	$.get(url, function(res) {
			 console.log("index.html", res.replace(/(\r\n|\n|\r)/gm, " "));
			 $timeout(function(){
				 $scope.htmlBind=res;
			 });

	 });

	//$scope.url=$sce.trustAsResourceUrl(url);
	/*var frame=document.getElementById('frameEducational');
	var heightTreatment=document.documentElement.clientHeight-95;
	frame.style.height=heightTreatment+'px';
*/


  }]);
