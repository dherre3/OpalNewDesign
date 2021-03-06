var myApp = angular.module('MUHCApp');

/**
*@ngdoc controller
*@name MUHCApp.controller:ScheduleController
*@scope
*@requires $scope
*@requires $rootScope
*@requires MUHCApp.services.UserPreferences
*@requires MUHCApp.services.UpdateUI
*@requires MUHCApp.services.Appointments
*@description
*Controller manages the logic in the schedule appointment main view, it as as "child" controllers,
*/
//Logic for the calendar controller view
myApp.controller('CalendarController', ['Appointments', '$scope','$timeout', '$filter', '$location','$anchorScroll','NavigatorParameters',function (Appointments, $scope,$timeout,$filter,$location,$anchorScroll,NavigatorParameters) {
  var divTreatment=document.getElementById('scrollerAppointments');
  var heightTreatment=document.documentElement.clientHeight-document.documentElement.clientHeight*0.35-180;
  console.log(heightTreatment);
  console.log(document.documentElement.clientHeight-document.documentElement.clientHeight*0.35-154);
  divTreatment.style.height=heightTreatment+'px';
  $scope.appointments=Appointments.getUserAppointments();
  $scope.noAppointments = !($scope.appointments>0);
  $scope.appointments = Appointments.setAppointmentsLanguage($scope.appointments);
  $scope.dt = new Date();
  $scope.todayDate=new Date();
  var flag=false;
  $scope.$watch('dt',function(){
    if(!flag)
    {
      setTimeout(function () {
        var anchor=findClosestAnchor();
        $location.hash(anchor);
        $anchorScroll();
      }, 500);
    }else{
      var anchor=findClosestAnchor();
      $location.hash(anchor);
      $anchorScroll();
    }
    flag=true;

  });
  var dates = new Date();
  dates.setHours(0,0,0,0);
  var todaysTimeMilliseconds = dates.getTime();
  $scope.showColor = function(date)
  {
    var result = $scope.appointments.filter(function(item){
      return  item.ScheduledStartTime.toDateString() == date.toDateString();
    });
    date.setHours(0,0,0,0);
    if(result.length>0)
    {
      if(date.getTime()> todaysTimeMilliseconds)
      {
        return '#cf5c4c';
      }else if(date.getTime() == todaysTimeMilliseconds)
      {
        return '#3399ff';
      }else{
        return '#5CE68A';
      }
    }else{
      return 'rgba(255,255,255,0.0)';
    }
  }

  function findClosestAnchor()
  {
    if($scope.appointments.length>0)
    {
      var today=new Date($scope.dt);
      today.setHours(0,0,0,0);
      today=today.getTime();
      var dateLast=new Date($scope.appointments[$scope.appointments.length-1].ScheduledStartTime.getTime());
      dateLast.setHours(0,0,0,0);
      dateLast=dateLast.getTime();
      var dateFirst=new Date($scope.appointments[0].ScheduledStartTime.getTime());
      dateFirst.setHours(0,0,0,0);
      dateFirst=dateFirst.getTime();
      if(dateLast<today)
      {
        return 'lastAnchor';
      }else if(dateFirst>=today)
      {
        return 'topListAnchor';
      }else{
        for (var i = 0; i < $scope.appointments.length; i++) {
          var date=new Date($scope.appointments[i].ScheduledStartTime.getTime());
          date.setHours(0,0,0,0);
          date=date.getTime();
          if(i>2&&i<$scope.appointments.length)
          {
            if(i==$scope.appointments.length-1)
            {
              return "anchorAppointments"+($scope.appointments.length-2);
            }else{
              var date2=new Date($scope.appointments[i+1].ScheduledStartTime.getTime());
              date2.setHours(0,0,0,0);
              date2=date2.getTime();
              if(date==today)
              {
                return 'anchorAppointments'+(i-1);
              }else{
                if(today>date&&today<date2)
                {
                  return 'anchorAppointments'+(i-1);
                }
              }
            }

          }else if(i<3&&i>0){
            if(date==today)
            {
              return 'anchorAppointments'+0;
            }else{
              var date2=new Date($scope.appointments[i+1].ScheduledStartTime.getTime());
              date2.setHours(0,0,0,0);
              date2=date2.getTime();
              if(today>date&&today<date2)
              {
                return 'anchorAppointments'+0;
              }
            }
          }
        }
        return 'topListAnchor';
      } 
    }else{
       return 'topListAnchor';
    }
   


  }
    $scope.getStyle=function(index){
        var today=(new Date());
        var dateAppointment=$scope.appointments[index].ScheduledStartTime;

        if(today.getDate()===dateAppointment.getDate()&&today.getMonth()===dateAppointment.getMonth()&&today.getFullYear()===dateAppointment.getFullYear()){
            return '#3399ff';

        }else if(dateAppointment>today){
            return '#cf5c4c';


        }else{
            return '#5CE68A';
        }
    };
    $scope.goToCalendarOptions = function()
    {
      personalNavigator.pushPage('./views/personal/appointments/calendar-options.html');
    };
    function lookForCalendarDate(date,mode){
        if(mode==='day'){
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var day=date.getDate();
            var calendar=Appointments.getUserCalendar();
            if(calendar!==undefined&&calendar.hasOwnProperty(year)){
                var calendarYear=calendar[year];
                if(calendarYear.hasOwnProperty(month)){
                    var calendarMonth=calendarYear[month];
                    if(calendarMonth.hasOwnProperty(day)){
                        var calendarDay=calendarMonth[day];
                        return calendarDay;
                    }else{
                    $scope.noAppointments=true;

                        return null;
                    }

                }else{

                    $scope.noAppointments=true;

                    return null;
                }
            }else{
                    $scope.noAppointments=true;
                return null;
            }


        }else if(mode==='month'){
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var calendar=Appointments.getUserCalendar();
            if(calendar!==undefined&&calendar.hasOwnProperty(year)){
                var calendarYear=calendar[year];
                if(calendarYear.hasOwnProperty(month)){
                    var calendarMonth=calendarYear[month];
                    return calendarMonth;
                }else{
                    $timeout(function(){
                        $scope.noAppointments=true;
                    });
                    return null;
                }
            }else{
                $timeout(function(){
                    $scope.noAppointments=true;
               });
                return null;
            }




        }else if(mode==='year'){
            var year=date.getFullYear();
            var calendar=Appointments.getUserCalendar();
            if(calendar!==undefined&&calendar.hasOwnProperty(year)){

                var calendarYear=calendar[year];
                return calendarYear
            }else{
                 $timeout(function(){
                    $scope.noAppointments=true;
               });
                return null;
            }
        }

    }


    //Header class for the list of appointments
    $scope.setHeader=function(index)
    {
      var today=new Date($scope.dt);
      today.setHours(0,0,0,0);
      today=today.getTime();
      var date2=new Date($scope.appointments[index].ScheduledStartTime.getTime());
      date2.setHours(0,0,0,0);
      date2=date2.getTime();
      if(index==0)
      {
        if(today==date2)
        {
          return false;
        }else
        {
          return true;
        }
      }else if(index<$scope.appointments.length)
      {
        var date1=new Date($scope.appointments[index-1].ScheduledStartTime.getTime());
        date1.setHours(0,0,0,0);
        date1=date1.getTime();
        if(date1==date2)
        {
          return false;
        }else{
          if(date2==today)
          {
            return false;
          }else{
            return true;
          }
        }
      }else {
        if(date2==today)
        {
          return false;
        }else{
          return true;
        }
      }
    }
    $scope.pickLastHeader=function()
    {
        if($scope.appointments.length>0)
        {
          var today=new Date($scope.dt);
        today.setHours(0,0,0,0)
        today=today.getTime();
        var lastTime=new Date($scope.appointments[$scope.appointments.length-1].ScheduledStartTime.getTime());
        lastTime.setHours(0,0,0,0);
        lastTime=lastTime.getTime();
        if(lastTime<today)
        {
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
      
    }

    $scope.setHeaderPickedDay=function(index)
    {
      var today=new Date($scope.dt);
      today.setHours(0,0,0,0);
      today=today.getTime();
      var date2=new Date($scope.appointments[index].ScheduledStartTime.getTime());
      date2.setHours(0,0,0,0);
      date2=date2.getTime();
      if(index==0)
      {
        if(today==date2||today<date2)
        {
          return true
        }else{
          return false;
        }
      }else if(index<$scope.appointments.length)
      {
        var date1=new Date($scope.appointments[index-1].ScheduledStartTime.getTime());
        date1.setHours(0,0,0,0);
        date1=date1.getTime();
        if(date1==date2)
        {
          return false;
        }else{
          if((date2>today&&date1<today)||date2==today)
          {
            return true;
          }else{
            return false;
          }
        }
      }else {
        if(date2==today)
        {
          return true;
        }else{
          return false
        }
      }
    }



    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 0,
        formatDay:'d',
        showWeeks:false
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];


  /*  $scope.getDayClass = function (date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date);
            var today=(new Date());
            if(dayToCheck.setHours(0,0,0,0)===today.setHours(0,0,0,0)){//===today.getDate()&&dateToCheck.getMonth()===today.getMonth()&&dateToCheck.getFullYear()===today.getFullYear()){
                    return 'today';
            }else if(lookForCalendarDate(dayToCheck,mode)){
                var dateAppointment=dayToCheck;
                 if(dateAppointment>today){
                    return 'full';
                 }else{
                    return 'partially';
                }
            }
        }else if(mode==='month'){
            return 'partially';
            var monthToCheck=new Date(date);
            if(lookForCalendarDate(monthToCheck,mode)){
                console.log('monthColorMe');
                return 'partially';
            }
        }else if(mode ==='year'){
            return 'partially';
            var yearToCheck=new Date(date);
            if(lookForCalendarDate(yearToCheck,mode)){
                console.log('yearColorMe');
                return 'partially';
            }
        }

        return '';
    };*/
    addEventsToNativeCalendar();

    /**
    *@ngdoc method
    *@name addEventsToCalendar
    *@methodOf MUHCApp.controller:ScheduleController
    *@description  If its a device checks to see if the user authorized access to calendar device feature, if the user has not
                   defined it (first time), it prompts the user, otherwise it checks through the {@link Appointments.}whether it
                   they have been added.
    **/


    function addEventsToNativeCalendar(){
          //Check for device or website
        var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if(app){
            var nativeCalendarOption=window.localStorage.getItem('NativeCalendar')
            if(!nativeCalendarOption){
                 var message='Would you like these appointments to be saved as events in your device calendar?';
                navigator.notification.confirm(message, confirmCallback, 'Access Calendar', ["Don't allow",'Ok'] );
            }else if( Number(nativeCalendarOption)===1){
                console.log('option was one!')
                Appointments.checkAndAddAppointmentsToCalendar().then(function(eventSuccession)
                {
                  console.log(eventSuccession);
                });
            }else{
                console.log('Opted out of appointments in native calendar');
            }
        }else{
            console.log('website');
        }
    }
    function confirmCallback(index){
    if(index==1){
        console.log(index);
        window.localStorage.setItem('NativeCalendar', 0);
        console.log('Not Allowed!');
    }else if(index==2){
        console.log(index);
        window.localStorage.setItem('NativeCalendar', 1);
        console.log('Allowed!');
        Appointments.checkAndAddAppointmentsToCalendar().then(function(eventSuccession)
        {
          console.log(eventSuccession);
        });
    }
    }

    //Go to appointment
    $scope.goToAppointment=function(appointment)
    {
      if(appointment.ReadStatus == '0')
      {
        Appointments.readAppointmentBySerNum(appointment.AppointmentSerNum);
      }
      NavigatorParameters.setParameters({'Navigator':'personalNavigator', 'Post':appointment});
      personalNavigator.pushPage('./views/personal/appointments/individual-appointment.html');
    }
}]);
myApp.controller('ScheduleController', ['$rootScope', 'UserPreferences', 'Appointments','$cordovaCalendar','$scope',
function ($rootScope, UserPreferences, Appointments,$cordovaCalendar,$scope) {

    $scope.closeAlert = function () {
        $rootScope.showAlert = false;
    };
    addEventsToNativeCalendar();

    /**
    *@ngdoc method
    *@name addEventsToCalendar
    *@methodOf MUHCApp.controller:ScheduleController
    *@description  If its a device checks to see if the user authorized access to calendar device feature, if the user has not
                   defined it (first time), it prompts the user, otherwise it checks through the {@link Appointments.}whether it
                   they have been added.
    **/


    function addEventsToNativeCalendar(){
          //Check for device or website
        var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        if(app){
            var nativeCalendarOption=window.localStorage.getItem('NativeCalendar')
            if(!nativeCalendarOption){
                 var message='Would you like these appointments to be saved as events in your device calendar?';
                navigator.notification.confirm(message, confirmCallback, 'Access Calendar', ["Don't allow",'Ok'] );
            }else if( Number(nativeCalendarOption)===1){
                console.log('option was one!')
                Appointments.checkAndAddAppointmentsToCalendar().then(function(eventSuccession)
                {
                  console.log(eventSuccession);
                });
            }else{
                console.log('Opted out of appointments in native calendar');
            }
        }else{
            console.log('website');
        }
    }
    function confirmCallback(index){
    if(index==1){
        console.log(index);
        window.localStorage.setItem('NativeCalendar', 0);
        console.log('Not Allowed!');
    }else if(index==2){
        console.log(index);
        window.localStorage.setItem('NativeCalendar', 1);
        console.log('Allowed!');
        Appointments.checkAndAddAppointmentsToCalendar().then(function(eventSuccession)
        {
          console.log(eventSuccession);
        });
    }
    }

}]);

myApp.controller('AppointmentListController', ['$scope','$timeout','Appointments','$location','$anchorScroll',

function ($scope,$timeout, Appointments,$location,$anchorScroll) {
    //Initializing choice
    if(Appointments.getTodaysAppointments().length!==0){
        $scope.radioModel = 'Today';
    }else {
        $scope.radioModel = 'All';
    }


    //Today's date
    $scope.today=new Date();

    //Sets up appointments to display based on the user option selected
    $scope.$watch('radioModel',function(){
        $timeout(function(){
            selectAppointmentsToDisplay();
        });

    });

     //Function to select whether the today, past, or upming buttons are selected
    function selectAppointmentsToDisplay(){
        var selectionRadio=$scope.radioModel;
        if(selectionRadio==='Today'){
            $scope.appointments=Appointments.getTodaysAppointments();

        }else if(selectionRadio==='Upcoming'){
            $scope.appointments=Appointments.getFutureAppointments();
        }else if(selectionRadio==='Past'){
            $scope.appointments=Appointments.getPastAppointments();
        }else{
            $scope.appointments=Appointments.getUserAppointments();
        }
        if($scope.appointments.length==0){
            $scope.noAppointments=true;
        }
    }

    //Function to select the color of the appointment depending on whether the date has passed or not
    $scope.getStyle=function(index){
        var today=$scope.today;
        var dateAppointment=$scope.appointments[index].ScheduledStartTime;

        if(today.getDate()===dateAppointment.getDate()&&today.getMonth()===dateAppointment.getMonth()&&today.getFullYear()===dateAppointment.getFullYear()){
            return '#3399ff';

        }else if(dateAppointment>today){
            return '#D3D3D3';


        }else{
            return '#5CE68A';
        }
    };

    //Set header
    $scope.scrollTo=function()
    {
      if($scope.pickAnchor&&typeof $scope.pickAnchor!=='undefined')
      {
        var anchor='anchorAppointments'+$scope.pickAnchor;
        console.log(anchor);
        $location.hash(anchor);
        $anchorScroll();
      }
    }
    $scope.showColor = function(date)
    {

      if(100*Math.random()>85)
      {
        return 'red';
      }else{
        return 'rgba(0,0,0,0.0)';
      }
    }
    $scope.setHeader=function(index)
    {
      if(index>0)
      {
        var date1=new Date($scope.appointments[index-1].ScheduledStartTime.getTime());
        date1.setHours(0,0,0,0);
        date1=date1.getTime();
        var date2=new Date($scope.appointments[index].ScheduledStartTime.getTime());
        date2.setHours(0,0,0,0);
        date2=date2.getTime();
        if(date1==date2)
        {
          return false;
        }else{
          return true;
        }
      }else{
        return true;
      }
    }
}]);
myApp.controller('IndividualAppointmentController', ['NavigatorParameters','$scope','$timeout', '$rootScope','Appointments', 'CheckinService','$q','NewsBanner',
    function (NavigatorParameters,$scope, $timeout, $rootScope, Appointments,CheckinService, $q, NewsBanner) {
        //Information of current appointment
        NewsBanner.setAlert();
        var parameters = NavigatorParameters.getParameters();
        console.log(parameters);
        var navigatorName = parameters.Navigator;
        console.log(navigatorName);
        $scope.app = parameters.Post;
        console.log($scope.app);
        $scope.app = Appointments.setAppointmentsLanguage($scope.app);

        setUpCheckin()

        $scope.goToMap=function()
        {
          NavigatorParameters.setParameters($scope.app);
          window[navigatorName].pushPage('./views/general/maps/individual-map.html');
        }

        //Function to checkin for appointment after pressing checked in inside invidivual appointment
        $scope.checkinToAppointment = function()
        {
          //set the loading to true
          $scope.loading = true;
          //Try checking in,
          CheckinService.checkinToAppointment($scope.app).then(function(response)
          {
            //If successfully checked in set loading to false, show live update, send live update request.
            $timeout(function(){
                $scope.loading = false;
                $rootScope.showHomeScreenUpdate = true;
                $scope.showLiveUpdate = true;
                $scope.checkInMessage = 'You have checked in!';
                $rootScope.checkInMessage = "CHECKIN_MESSAGE_AFTER";
                ProgressBarStatus('#statusBarCheckin', 100,'#006400','#006400',200);
            });
          }).catch(function(error){
            $timeout(function(){
              //Else an error occure, check in at the cacner center
              $scope.loading = false;
              $rootScope.showHomeScreenUpdate = false;
              $scope.enableCheckinButton = false;
              $scope.checkInMessage = 'Error occurred, check-in at the cancer center';
            });
          })

        }
        //Sets up checkin
        function setUpCheckin()
        {
          //Do not show checkin, unless otherwise later specified
          $scope.showCheckin = false;
          //Check if the current appointment is the check-in appointment
          if(Appointments.isCheckinAppointment($scope.app))
          {
            //If it is, show checkin, as in show checkin div, go into loading do not show live udpates and disable the checkin button
            var checkInAppointment = $scope.app
            $scope.showCheckin = true;
            $scope.enableCheckinButton = false;
            $scope.loading = true;
            $scope.showLiveUpdate = false;
            $scope.checkInAppointment = checkInAppointment;

            //If the checkin is not done yet
            if(checkInAppointment.Checkin == '0')
            {
              console.log('inside checkin = 0');
              //Check in server if checked in to Aria
              CheckinService.checkCheckinServer(checkInAppointment).then(function(data)
              {
                //If they have checked in to Aria, set loading to false, update chackin message in both
                //Home screen and individual-appointment page, activate the live updates
                if(data == 'success')
                {
                  $scope.loading = false;
                  $scope.checkInMessage = 'You have checked in!';
                  $rootScope.checkInMessage = "CHECKIN_MESSAGE_AFTER";
                  $scope.showLiveUpdate = true;
                  $rootScope.showHomeScreenUpdate = true;
                  ProgressBarStatus('#statusBarCheckin', 100,'#006400','#006400',200);
                  CheckinService.getCheckinUpdates(checkInAppointment);
                }else{
                  //Check if the user is allowed to check in geographically
                  CheckinService.isAllowedToCheckin().then(
                    function(success){
                      //If allowed, set loading to false, Give them the checkin message and enable button
                      $timeout(function()
                      {
                        $scope.loading = false;
                        $scope.enableCheckinButton = true;
                        $scope.checkInMessage = success;
                        $rootScope.showHomeScreenUpdate = false;
                      });
                    },function(failure){
                      //If not allowed, loading to false, give them the message to "Checkin in vecinity of..."
                      $timeout(function()
                      {
                        $scope.loading = false;
                        $scope.checkInMessage = failure;
                        $rootScope.showHomeScreenUpdate = false;
                      });
                    });
                }
              });
            }else{
              //Case where the user is already checked in, ask for an update, set bar.
              CheckinService.getCheckinUpdates(checkInAppointment);
              $scope.loading = false;
              $scope.checkInMessage = 'You have checked in!';
              $scope.showLiveUpdate = true;
              $rootScope.showHomeScreenUpdate = true;
              ProgressBarStatus('#statusBarCheckin', 100,'#006400','#006400',200);
            }
            console.log(checkInAppointment);
          }else{
              $scope.showLiveUpdate = false;
              $scope.showCheckin = false;

          }
        }
        function ProgressBarStatus(id, percentage,startColor,endColor,duration)
        {
          var circle = new ProgressBar.Circle(id, {
              color: endColor,
              duration: duration,
              easing: 'easeInOut',
              strokeWidth: 5,
              step: function(state, circle) {
                  circle.path.setAttribute('stroke', state.color);
              }
          });
          circle.animate(percentage/100, {
              from: {color: startColor},
              to: {color: endColor}
          });
        }
}]);

myApp.controller('AppointmentOptionsController',['$scope','$timeout',function($scope,$timeout){
  //Enter code here!!
  var nativeCalendar=Number(window.localStorage.getItem('NativeCalendar'));
  (nativeCalendar)?$scope.checkboxModelCalendar=nativeCalendar:$scope.checkboxModelCalendar=0;
  $scope.saveSettings=function(){
      if(ons.platform.isIOS()||ons.platform.isAndroid()){
          var message=''
          if($scope.checkboxModelCalendar===1){
              message='Would you like save your appointment schedule in your phone calendar?';
          }else{
              message='Would you like to stop saving appointments to your phone calendar?';
          }
          navigator.notification.confirm(message, confirmCallbackCalendar, 'Calendar Setting', ['Continue', 'Cancel'] );
          function confirmCallbackCalendar(index){
              console.log(index);
              if(index==1){
                  window.localStorage.setItem('NativeCalendar',$scope.checkboxModelCalendar);
              }else{
                  $timeout(function(){
                      ($scope.checkboxModelCalendar==1)?$scope.checkboxModelCalendar=0:$scope.checkboxModelCalendar=1;
                  })
              }
          }

      }

  };


}]);
