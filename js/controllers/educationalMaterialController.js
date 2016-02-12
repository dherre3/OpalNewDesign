var myApp=angular.module('MUHCApp');
myApp.controller('EducationalMaterialController',function($scope, $timeout, $cordovaFileOpener2,$cordovaDevice,$cordovaDatePicker){

	$scope.educationDeviceBackButton=function()
  {
    console.log('device button pressed do nothing');

  }
$scope.openPDF=function(type){

	//file:///data/data/com.example.hello/files/pdfs
	var url='';
	if(type=='RadBook')
	{
		url='./pdfs/radiotherapy_journey.pdf';
	}else if(type=='RadBreast')
	{
		url='./pdfs/breast-radiotherapy-treatment-guidelines.pdf';
	}else{
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

$scope.openVideo=function(){
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if(app){
	  var ref = cordova.InAppBrowser.open('https://www.youtube.com/watch?v=c8nHbGPs5SE', '_blank', 'location=yes');
	}else{
	  var ref = window.open('https://www.youtube.com/watch?v=c8nHbGPs5SE', '_blank', 'location=yes');
	}
};
/*var options = {
    date: new Date(),
    mode: 'date', // or 'time'
    minDate: new Date() - 10000,
    allowOldDates: true,
    allowFutureDates: false,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#F2F3F4',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

  document.addEventListener("deviceready", function () {

    $cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });

  }, false);*/

});