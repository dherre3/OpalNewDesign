var myApp = angular.module('MUHCApp');
myApp.controller('EducationalMaterialController', function (NavigatorParameters, $scope, $timeout, $cordovaFileOpener2, $cordovaDevice, $cordovaDatePicker, FileManagerService, EducationalMaterial, UserPreferences) {

	//Android device backbutton
	$scope.educationDeviceBackButton = function () {
		console.log('device button pressed do nothing');

	}
	init();
	//Init function
	function init() {
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
	$scope.showHeader = function (index) {
		if (index == 0) {
			return true;
		} else if ($scope.edumaterials[index - 1].PhaseInTreatment !== $scope.edumaterials[index].PhaseInTreatment) {
			return true;
		}
		return false;
	}
	/**
	 * @method goToEducationalMaterial
	 * @description If not read reads material, then it opens the material into its individual controller
	 * 
	 */
	$scope.goToEducationalMaterial = function (edumaterial) {
		if (edumaterial.ReadStatus == '0') {
			edumaterial.ReadStatus = '1';
			EducationalMaterial.readEducationalMaterial(edumaterial.EducationalMaterialSerNum);
		}
		NavigatorParameters.setParameters({ 'Navigator': 'educationNavigator', 'Post': edumaterial });
		educationNavigator.pushPage('./views/education/individual-material.html');
	};

});
/**
 * @controller IndividualEducationalMaterialController
 * @description Controller receives each individual material and its in charge of the options to manipulate the material. i.e. This controller is in charge
 * of the following functions: opening, sharing, mailing, rating
 * 
 * 
 * 
 */
myApp.controller('IndividualEducationalMaterialController', ['$scope', '$timeout', 'NavigatorParameters', 'UserPreferences', 'EducationalMaterial', function ($scope, $timeout, NavigatorParameters, UserPreferences, EducationalMaterial) {
	var param = NavigatorParameters.getParameters();
	var navigatorPage = param.Navigator;
	$scope.edumaterial = EducationalMaterial.setLanguageEduationalMaterial(param.Post);
	var isBooklet = $scope.edumaterial.hasOwnProperty('TableContents');
	var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
	var mod = '';
	if (ons.platform.isAndroid()) {
		mod = 'material'
	}
	if (isBooklet) {
		$scope.tableOfContents = $scope.edumaterial['TableContents'];
		$scope.tableOfContents = EducationalMaterial.setLanguageEduationalMaterial($scope.tableOfContents);
	}
	$scope.goToEducationalMaterial = function (index) {
		var nextStatus = EducationalMaterial.openEducationalMaterial($scope.edumaterial);
		if (nextStatus !== -1) {
			console.log(nextStatus);
			NavigatorParameters.setParameters({ 'Navigator': navigatorPage, 'Index': index, 'Booklet': $scope.edumaterial, 'TableOfContents': $scope.tableOfContents });
			window[navigatorPage].pushPage(nextStatus.Url);
		}
	};
	$scope.shareViaEmail = function () {
		if (!isBooklet && app) {

		} else {
			ons.notification.alert({ message: 'Available Only on Device!' });
		}
	};
	$scope.printDocument = function () {
		if (!isBooklet && app) {

		} else {
			ons.notification.alert({ message: 'Available Only on Device!', modifier: mod });
		}
	};
}]);
/**
 * @name EducationalMaterialSinglePageController
 * @description Once the material has gone through the first show page, this controller is in charge of opening the material that is simple a individual html page, such as the charter and such and its not a table of 
 * contents. Or in backend language is a parent element without a table of contents and simple material content.
 * 
 */
myApp.controller('EducationalMaterialSinglePageController', ['$scope', '$timeout', 'NavigatorParameters', 'EducationalMaterial', function ($scope, $timeout, NavigatorParameters, EducationalMaterial) {
	//Obtaining educational material and other parameters such as the navigatorName
	var parameters = NavigatorParameters.getParameters();
	var material = parameters.Booklet;
	var navigatorName = parameters.Navigator;
	
	//Setting the educational material
	$scope.edumaterial = material;
	
	//Ajax call to obtain material
	$.get(material.Url, function (res) {
		console.log("res", res.replace(/(\r\n|\n|\r)/gm, " "));
		$timeout(function () {
			//Sets content variable for material and hides loading 
			$scope.edumaterial.Content = res;
		});

	});
}]);

/**
 * @method BookletEduMaterialController
 * @description This controller takes care of the displying the educational material that has a table of contents in a carousel fashion. It also takes care of the popover that controls the table of contents and 
 * rating.
 * 
 */
myApp.controller('BookletEduMaterialController', ['$scope', '$timeout', 'NavigatorParameters', 'EducationalMaterial', '$rootScope', '$filter', function ($scope, $timeout, NavigatorParameters, EducationalMaterial, $rootScope, $filter) {
	
	//Obtaining educational material parameters
	var parameters = NavigatorParameters.getParameters();
	var navigatorName = parameters.Navigator;
	var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	initBooklet();

	 //Initialization variables for material
	function initBooklet() {
		$rootScope.contentsEduBooklet = parameters;
		$scope.booklet = parameters.Booklet;
		$scope.activeIndex = parameters.Index;
		$scope.tableOfContents = parameters.TableOfContents;
	}
	$scope.isFullscreen = false;

	/**
	 * Event listeners for carousel element
	 */
	document.addEventListener('ons-carousel:init', handleInitEventCarousel);
	document.addEventListener('ons-carousel:postchange', handlePostChangeEventCarousel);

	/**
	 * Function handlers for advancing with the carousel
	 */
	$scope.goNext = function () {
		if ($scope.activeIndex < $scope.tableOfContents.length - 1) {
			$scope.activeIndex++;
			$scope.carousel.setActiveCarouselItemIndex($scope.activeIndex);
			console.log('go next');
		}
	};
	$scope.goBack = function () {
		if ($scope.activeIndex > 0) {
			$scope.activeIndex--;
			$scope.carousel.setActiveCarouselItemIndex($scope.activeIndex);
			console.log('go back');
		}

	};
	/*
	* Method in charge of fullscreen functionality. **deprecated!!
	*/
	// $scope.fullScreenToggle = function () {
	// 	$scope.isFullscreen = !$scope.isFullscreen;
	// 	setHeightElement();
	// }
	
	/**
	 * Instantiation the popover for table of contents, delayed is to prevent the transition animation from lagging.
	 */
	$timeout(function () {
		ons.createPopover('./views/education/table-contents-popover.html').then(function (popover) {
			$scope.popover = popover;
			$rootScope.popoverEducation = popover;
			$scope.popover.on('posthide', function () {
				if (typeof $rootScope.indexEduMaterial !== 'undefined') $scope.carousel.setActiveCarouselItemIndex($rootScope.indexEduMaterial);
			});
		});
	}, 300);

	//Popover method to jump between educational material sections from a table of contents
	$rootScope.goToSectionBooklet = function (index) {
		$rootScope.indexEduMaterial = index;
		$rootScope.popoverEducation.hide();
	};
	//Cleaning up controller after its uninstantiated. Destroys all the listeners and extra variables 
	$scope.$on('$destroy', function () {
		console.log('on destroy');
		ons.orientation.off("change");
		delete $rootScope.contentsEduBooklet;
		document.removeEventListener('ons-carousel:postchange', handlePostChangeEventCarousel);
		document.removeEventListener('ons-carousel:init', handleInitEventCarousel);
		$scope.carousel.off('init');
		$scope.carousel.off('postchange');
		$scope.popover.off('posthide');
		$scope.popover.destroy();
		delete $rootScope.indexEduMaterial;
		delete $rootScope.popoverEducation;
		delete $rootScope.goToSectionBooklet;
	});
	/**
	 * Set height of container carousel element
	 * 
	 */
	function setHeightElement() {
		$timeout(function () {
			var constantHeight = (ons.platform.isIOS()) ? 120 : 100;
			var divTitleHeight = $('#divTitleBookletSection').height();
			if ($scope.isFullscreen) {
				divTitleHeight = 0;
				constantHeight -= 48;
			}
			var heightChange = document.documentElement.clientHeight - constantHeight - divTitleHeight;
			$scope.heightSection = heightChange + 'px';
			$('#contentMaterial').height(heightChange);
		}, 10);
	}
	//Handles the post change even carousel, basically updates activeIndex, sets height of view and lazily loads slides
	function handlePostChangeEventCarousel(ev) {
		setHeightSection(ev.activeIndex);
		$scope.carousel = ev.component;
		$scope.activeIndex = ev.activeIndex;
		setHeightElement();
		lazilyLoadSlides(ev.activeIndex);
	}
	
	//Sets the height dynamically for educational material contents. Fixing the bug from Onsen.
	function setHeightSection(index) {
		$scope.heightSection = $('#sectionContent' + index).height();
	}
	
	//This method is in charge of "lazy loading". It only loads the material if it has not been loaded yet and only for the current, previous and next slides.
	function lazilyLoadSlides(index) {
		if (index - 1 >= 0 && !$scope.tableOfContents[index - 1].hasOwnProperty("Content")) {
			$.get($scope.tableOfContents[index - 1].Url, function (res) {
				$timeout(function () {
					$scope.tableOfContents[index - 1].Content = $filter('removeTitleEducationalMaterial')(res);
				});
			});
		}
		if (!$scope.tableOfContents[index].hasOwnProperty("Content")) {
			$.get($scope.tableOfContents[index].Url, function (res) {
				$timeout(function () {
					$scope.tableOfContents[index].Content = $filter('removeTitleEducationalMaterial')(res);
				});
			});
		};
		if (index + 1 < $scope.tableOfContents.length && !$scope.tableOfContents[index + 1].hasOwnProperty("Content")) {
			$.get($scope.tableOfContents[index + 1].Url, function (res) {
				$timeout(function () {
					$scope.tableOfContents[index + 1].Content = $filter('removeTitleEducationalMaterial')(res);
				});
			});
		}
	}
	//Function that handles the initialization of the carousel. Basically deals with instantiation of carousel, loading the first slides, settings initial height, and then instaitiating a listener to watch the
	//change from portrait to landscape. 
	function handleInitEventCarousel(ev) {
		console.log('initializing carouse');
		$scope.carousel = ev.component;
		$timeout(function () {
			$scope.carousel.setActiveCarouselItemIndex(parameters.Index);
			$scope.carousel.refresh();
			lazilyLoadSlides(parameters.Index);
			setHeightElement();

		}, 10);

		console.log('done lazy instantiation', parameters.Index)
		if (app) {
			ons.orientation.on("change", function (event) {
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
