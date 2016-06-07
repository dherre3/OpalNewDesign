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
	$scope.noMaterials = !EducationalMaterial.isThereEducationalMaterial()
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
};

});
myApp.controller('EducationalMaterialTOCController',['$scope','$timeout','NavigatorParameters','UserPreferences','EducationalMaterial', function($scope,$timeout,NavigatorParameters,UserPreferences,EducationalMaterial){
	var param = NavigatorParameters.getParameters();
	var navigatorPage = param.Navigator;
	$scope.edumaterial= param.Post;
	$scope.tableOfContents = $scope.edumaterial['TableContents'];
	$scope.tableOfContents = EducationalMaterial.setLanguageEduationalMaterial($scope.tableOfContents);
	
	$scope.goToDetails=function()
	{
		NavigatorParameters.setParameters({'Navigator':navigatorPage,'Post':$scope.edumaterial});
	}
	$scope.goToEducationalMaterial=function(index,edumaterial)
	{
		NavigatorParameters.setParameters({'Navigator':navigatorPage,'Index':index,'Booklet':$scope.edumaterial, 'TableOfContents':$scope.tableOfContents});
		window[navigatorPage].pushPage('./views/education/education-booklet.html');
	}
	

	$scope.rate = [];
	initRater();
	function initRater()
	{
		$scope.submitted = false;
		$scope.emptyRating = true;
		for(var i = 0; i < 5;i++)
		{
			$scope.rate.push({
				'Icon':'ion-ios-star-outline'
			});
		}
	}
	$scope.rateMaterial = function(index)
	{
		$scope.emptyRating = false;
		for(var i = 0; i < index+1;i++)
		{
			$scope.rate[i].Icon = 'ion-star';
		}
		for(var i = index+1; i < 5;i++)
		{
			$scope.rate[i].Icon = 'ion-ios-star-outline';
		}
	};
	$scope.submit = function()
	{
		$scope.submitted = true;
		
	}
}]);
myApp.controller('BookletEduMaterialController',['$scope','$timeout','NavigatorParameters','EducationalMaterial','NewsBanner','$rootScope',function($scope,$timeout,NavigatorParameters,EducationalMaterial,NewsBanner,$rootScope)
{
	var parameters = NavigatorParameters.getParameters();
	var navigatorName = parameters.Navigator;
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	
	initBooklet();
	NewsBanner.setAlert();
	/**
	 * Initialization function for material
	 * 
	 * 
	 */
	function initBooklet()
	{
		$rootScope.contentsEduBooklet = parameters;
		$scope.booklet = parameters.Booklet;
		$scope.activeIndex = parameters.Index;
		$scope.tableOfContents = parameters.TableOfContents;
	}
	$scope.isFullscreen = false;
	
	/**
	 * Event listeners for carousel element
	 */
	document.addEventListener('ons-carousel:init',handleInitEventCarousel);
	document.addEventListener('ons-carousel:postchange',handlePostChangeEventCarousel);
	
	/**
	 * Function handlers for advancing with the carousel
	 * 
	 * 
	 */
	$scope.goNext = function()
	{	
		if($scope.activeIndex < $scope.tableOfContents.length-1)
		{
			$scope.activeIndex++;
			$scope.carousel.setActiveCarouselItemIndex($scope.activeIndex);
			console.log('go next');
		}
	};
	$scope.goBack = function()
	{
		if($scope.activeIndex >  0 )
		{
			$scope.activeIndex--;
			$scope.carousel.setActiveCarouselItemIndex($scope.activeIndex);
			console.log('go back');	
		}
		
	};
	$scope.fullScreenToggle = function()
	{
		$scope.isFullscreen = !$scope.isFullscreen;
		setHeightElement();
	}
	$scope.showPopover = function(id)
	{
		ons.createPopover('./views/education/rate-material-popover.html').then(function(popover){
			console.log(popover);
			$scope.popover = popover;
			$rootScope.popoverEducation = popover;
			if($scope.hasOwnProperty('popover'))
			{
				$scope.popover.show(id);
			}
			$scope.popover.on('posthide',function()
			{	
				if(typeof $rootScope.indexEduMaterial!=='undefined')$scope.carousel.setActiveCarouselItemIndex($rootScope.indexEduMaterial);
				delete $rootScope.indexEduMaterial;
				delete $rootScope.popoverEducation;	
				$scope.popover.off('posthide');
				$scope.popover.destroy();
			});
		});
		
	};
	
	$scope.$on('$destroy',function()
	{
		console.log('on destroy');
		ons.orientation.off("change");
		delete $rootScope.contentsEduBooklet;
		document.removeEventListener('ons-carousel:postchange',handlePostChangeEventCarousel);
		document.removeEventListener('ons-carousel:init',handleInitEventCarousel);
		$scope.carousel.off('init');
		$scope.carousel.off('postchange');
		//$scope.popover.destroy();
		//delete $rootScope.tableOfContents;
		//window.removeEventListener("");	
	});
	/**
	 * Set height of container carousel element
	 * 
	 */
	function setHeightElement()
	{
		console.log('I am getting called');
		$timeout(function(){
			var constantHeight = (ons.platform.isIOS())?123:103;
			var divTitleHeight = $('#divTitleBookletSection').height();
			console.log(constantHeight);
			if($scope.isFullscreen)
			{
				divTitleHeight = 0;
				constantHeight-=48;
			}
			console.log(constantHeight,divTitleHeight);
			var heightChange = document.documentElement.clientHeight-constantHeight-divTitleHeight;
			$scope.heightSection = heightChange +'px';
			$('#contentMaterial').height(heightChange);
		},10);	
	}
	function handlePostChangeEventCarousel(ev)
	{
		setHeightSection(ev.activeIndex);
		$scope.carousel = ev.component;
		$scope.activeIndex = ev.activeIndex;
		setHeightElement();
		lazilyLoadSlides(ev.activeIndex);
	}
	function setHeightSection(index)
	{
		$scope.heightSection = $('#sectionContent'+index).height();
	}
	function lazilyLoadSlides(index)
	{
		console.log(index);
		if(index-1>=0 && !$scope.tableOfContents[index-1].hasOwnProperty("Content") )
		{
			$.get($scope.tableOfContents[index-1].Url, function(res) {
				$timeout(function(){
					$scope.tableOfContents[index-1].Content = res;
				});
			});	
		}
		if(!$scope.tableOfContents[index].hasOwnProperty("Content"))
		{
			$.get($scope.tableOfContents[index].Url, function(res) {
				$timeout(function(){
					$scope.tableOfContents[index].Content = res;
				});
			});	
		};
		if(index + 1 < $scope.tableOfContents.length&&!$scope.tableOfContents[index+1].hasOwnProperty("Content"))
		{
			$.get($scope.tableOfContents[index+1].Url, function(res) {
				$timeout(function(){
					$scope.tableOfContents[index+1].Content = res;
				});
			});	
		}
	}
	function handleInitEventCarousel(ev)
	{
		console.log('initializing carouse');
		$scope.carousel = ev.component;
		console.log($scope.carousel);	
		$timeout(function()
		{
			$scope.carousel.setActiveCarouselItemIndex(parameters.Index);
			$scope.carousel.refresh();
			lazilyLoadSlides(parameters.Index);	
			setHeightElement();
				
		},10);
		
		console.log('done lazy instantiation', parameters.Index)
		if(app)
		{
			ons.orientation.on("change", function(event){
				console.log(event.isPortrait); // e.g. portrait
				//$scope.carousel.refresh();
				console.log('orientation changed');
				setHeightElement();
				 var i = $scope.carousel._scroll / $scope.carousel._currentElementSize;
  				delete $scope.carousel._currentElementSize;
  				$scope.carousel.setActiveCarouselItemIndex(i);
			});
		}
	}
	
	
}]);
myApp.controller('IndividualEduMaterialController',['$scope','$timeout','NavigatorParameters','EducationalMaterial', function($scope,$timeout,NavigatorParameters,EducationalMaterial){
	var parameters = NavigatorParameters.getParameters();
	var material = parameters.Post;
	var navigatorName = parameters.Navigator;
	$scope.loading = true;
	material = EducationalMaterial.setLanguageEduationalMaterial(material);
	$scope.goToOptions=function()
	{
		NavigatorParameters.setParameters({'view':'Educational'});
	}
	console.log(material);
	$.get(material.Url, function(res) {

		 console.log("res", res.replace(/(\r\n|\n|\r)/gm, " "));
			 $timeout(function(){
				 $scope.loading=false;
				 $scope.htmlBind=res;
			 });

	 });
}]);

myApp.controller('RateMaterialController',['$scope','$timeout','NavigatorParameters','$rootScope',function($scope,$timeout,NavigatorParameters,$rootScope)
{
	$scope.rate = [];
	initRater();
	console.log($scope.tableOfContents);
	console.log(ons);
	$scope.david = "$scope.tableOfContents;";
	$scope.serParameters = function()
	{
		console.log('post-show');
	}
	function initRater()
	{
		$scope.submitted = false;
		$scope.emptyRating = true;
		for(var i = 0; i < 5;i++)
		{
			$scope.rate.push({
				'Icon':'ion-ios-star-outline'
			});
		}
	}
	$scope.rateMaterial = function(index)
	{
		$scope.emptyRating = false;
		for(var i = 0; i < index+1;i++)
		{
			$scope.rate[i].Icon = 'ion-star';
		}
		for(var i = index+1; i < 5;i++)
		{
			$scope.rate[i].Icon = 'ion-ios-star-outline';
		}
	};
	$scope.submit = function()
	{
		$scope.submitted = true;
		
	}
	$scope.goToEducationalMaterial = function(index)
	{
		$rootScope.indexEduMaterial = index;
		$rootScope.popoverEducation.hide();
	};
}]);