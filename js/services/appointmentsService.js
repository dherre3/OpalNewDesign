var myApp=angular.module('MUHCApp');
/**
*@ngdoc service
*@name MUHCApp.services:PatientAppointments
*@requires $filter
*@requires MUHCApp.service:RequestToServer
*@requires $q
*@requires MUHCApp.service:UserAuthorizationInfo
*@requires $cordovaCalendar
*@description Sets the User appointment objects for the different views.
**/
myApp.service('Appointments', ['$q', 'RequestToServer','$cordovaCalendar','UserAuthorizationInfo', '$filter', 'UserPreferences','LocalStorage',function ($q,RequestToServer, $cordovaCalendar, UserAuthorizationInfo, $filter,UserPreferences,LocalStorage) {
    /**
    *@ngdoc property
    *@name  UserAppointmentsArray
    *@propertyOf MUHCApp.services:PatientAppointments
    *@description Array that contains all user appointments organized chronologically from most recent to least recent.
    **/
    var UserAppointmentsInNativeCalendar=[];
    var UserAppointmentsArray = [];
    var appointmentsLocalStorage=[];
    var calendar={};
    var numberOfSessions=0;
    function searchAppointmentsAndDelete(appointments)
    {
      for (var i = 0; i < appointments.length; i++) {
        for (var j = 0; j < UserAppointmentsArray.length; j++) {
           if(UserAppointmentsArray[j].AppointmentSerNum==appointments[i].AppointmentSerNum)
           {
             UserAppointmentsArray.splice(j,1);
             appointmentsLocalStorage.splice(j,1);
             break;
           }
        }

      }
    }
    function getAppointmentsInPeriod(period)
    {
      //Variables for comparing dates
      var today=new Date();
      var day=today.getDate();
      var month=today.getMonth();
      var year=today.getFullYear();
      var time=today.getTime();
      var sorting=false;
      //If sorting=false then latest appointment will be last, else it will be first
      if(period=='Past') sorting=true;
      var array=[];
      for (var i = 0; i < UserAppointmentsArray.length; i++) {
        var date=UserAppointmentsArray[i].ScheduledStartTime;
        //If appointment is the same date add it to the array
          if(period=='Today'&&date.getDate()==day&&date.getFullYear().year&&date.getMonth()==month)
          {
            array.push(UserAppointmentsArray[i]);
            //If appointment is in the future add it to the array
          }else if(period=='Future'&&time<date.getTime())
          {
            array.push(UserAppointmentsArray[i]);
          //ditto
          }else if(period=='Past'&&date.getTime()<=time){
            array.push(UserAppointmentsArray[i]);
          }
      }
      //Sort it correctly for each case
      array=$filter('orderBy')(array, 'ScheduledStartTime',sorting);
      return array;
    }

    function addAppointmentsToService(appointments)
    {
      if (appointments === undefined) return;
      //Setting min date for upcoming appointment
      var min=Infinity;
      //Format date to javascript date
      var index=-1;
      numberOfSessions=0;
      appointmentsLocalStorage=appointmentsLocalStorage.concat(appointments);
      LocalStorage.WriteToLocalStorage('Appointments',appointmentsLocalStorage);
      for (var i = 0; i < appointments.length; i++) {
          appointments[i].ScheduledStartTime = $filter('formatDate')(appointments[i].ScheduledStartTime);
          appointments[i].ScheduledEndTime =  $filter('formatDate')(appointments[i].ScheduledEndTime);
          UserAppointmentsArray[i] = appointments[i];
          if(appointments[i].AppointmentType_EN=='Daily Radiotherapy Treatment'||appointments[i].AppointmentType_EN=='First Radiotherapy Treatment Session'||appointments[i].AppointmentType_EN=='Final Radiotherapy Treatment Session')
          {
            numberOfSessions++;
          }
      }
      //Sort Appointments chronologically most recent first
      UserAppointmentsArray = $filter('orderBy')(UserAppointmentsArray, 'ScheduledStartTime', false);
      var sessionNumber = 1;
      for (var i = 0; i < UserAppointmentsArray.length; i++) {
        if(UserAppointmentsArray[i].AppointmentType_EN=='Daily Radiotherapy Treatment'||UserAppointmentsArray[i].AppointmentType_EN=='Final Radiotherapy Treatment Session'||UserAppointmentsArray[i].AppointmentType_EN=='First Radiotherapy Treatment Session')
        {
          UserAppointmentsArray[i].sessionNumber="Session "+sessionNumber+ " of "+ numberOfSessions;
          sessionNumber++;
        }
      }
      /*
        * Setting User Calendar
        //The rest of this function takes the results from the sorted by date appointments and organizes them into an object with
         //hierarchical structure year->month->day->appointments for the day, the dayly appointments are arrays.

      */
      //Initializing local variables
      var year = -1;
      var month = -1;
      var day = -1;
      calendar = {};
      var calendarYear = {};
      var calendarMonth = {};
      //Loop goes through all the appointments in the sorted array of appointments, remember this only works if ap
      //appointments are already sorted
      for (var i = 0; i < UserAppointmentsArray.length; i++) {

        //Gets year, month and day for appointment
        var tmpYear = (UserAppointmentsArray[i].ScheduledStartTime).getFullYear();
        var tmpMonth = (UserAppointmentsArray[i].ScheduledStartTime).getMonth() + 1;
        var tmpDay = (UserAppointmentsArray[i].ScheduledStartTime).getDate();

        //if month has changed, since appointments in order, add the resulting appointments to for that month to the correspongding
        //calendar year.
        if (month !== tmpMonth || (month === tmpMonth && year !== tmpYear)) {
            if (i > 0) {
                calendarYear[month] = {};
                calendarYear[month] = calendarMonth;
                calendarMonth = {};
            }
            month = tmpMonth;
        }

        //if year has changed, add year to the calendar object and changed the year to the year it changed too
        if (year !== tmpYear) {
            if (i > 0) {
                calendar[year] = {};
                calendar[year] = calendarYear;
                calendarYear = {};
                calendarMonth = {};
            }
            year = tmpYear;

        }

        //If statement just to defined objects and prevent exception in case certain day does not
        //have any appointments yet. It then adds to the calendaMonth object for that day the
        //appointment
        if (calendarMonth[tmpDay] === undefined) calendarMonth[tmpDay] = [];
        calendarMonth[tmpDay].push(UserAppointmentsArray[i]);

      }
      //Last Month, of year
      calendarYear[month] = {};
      calendarYear[month] = calendarMonth;
      calendar[year] = {};
      calendar[year] = calendarYear;
    }
      function findAppointmentIndexInArray(array, serNum)
      {
        for (var i = 0; i < array.length; i++) {
          if(array[i].AppointmentSerNum==serNum)
          {
            return i;
          }
        }
        return -1;

      }
      function manageAppointmentsInNativeCalendar(appointments,index)
      {
        //var appointments=UserAppointmentsArray;
        var indexValue=index;
        var r=$q.defer();
        var today=new Date();
        if(index===appointments.length||typeof index=='undefined')
        {
          r.resolve('Done adding all appointments');
        }else{
          var startDate=appointments[indexValue].ScheduledStartTime;
          console.log(appointments[indexValue]);
          if(today<startDate)
          {
            var eventToCalendar={};
            var tmp=new Date(appointments[indexValue].ScheduledStartTime);
            var endDate = tmp.setHours(startDate.getHours()+1);
            eventToCalendar.startDate=startDate;
            eventToCalendar.endDate=endDate;
            (UserPreferences.getLanguage()=='EN')?eventToCalendar.title=appointments[indexValue].AppointmentType_EN:eventToCalendar.title=appointments[indexValue].AppointmentType_FR;
            eventToCalendar.location=appointments[index].Location;
            eventToCalendar.notes='Source: ' +appointments[indexValue].ResourceName;
            if(isAppointmentInNativeCalendar(appointments[indexValue].AppointmentSerNum))
            {
              console.log('Found event in Calendar');
              var newIndex=indexValue+1;
              r.resolve(manageAppointmentsInNativeCalendar(appointments,newIndex));
            }else{
              $cordovaCalendar.createEvent(eventToCalendar).then(function (result) {
                  addEventToNativeCalendar(appointments[indexValue].AppointmentSerNum);
                  var newIndex=indexValue+1;
                  r.resolve(manageAppointmentsInNativeCalendar(appointments,newIndex));
              }, function (err) {
                  console.log(err);
                   navigator.notification.alert(
                      'An error occured while adding your appointments',  // message
                      function(error){
                        console.log(error);
                      },         // callback
                      'Error',            // title
                      'OK'                  // buttonName
                  );
                  var newIndex=indexValue+1;
                  r.resolve(manageAppointmentsInNativeCalendar(appointments,newIndex));
              });
            }

          }else{
            var newIndex=indexValue+1;
            r.resolve(manageAppointmentsInNativeCalendar(appointments,newIndex));
          }
        }
        return r.promise;
      }
        function isAppointmentInNativeCalendar(serNum)
        {
            var appointmentsString=window.localStorage.getItem('NativeCalendarAppoinments');
            if(!appointmentsString){
                return false;
            }else{
                console.log(appointmentsString);
                appointmentsObject=JSON.parse(appointmentsString);
                var appointmentList=appointmentsObject.AppointmentList;
                for(var i=0;i<appointmentList.length;i++){
                     if(appointmentList[i]===serNum){
                        return true;
                     }
                }
                return false;
            }
        }
        function addEventToNativeCalendar(serNum){
            var appointmentsString=window.localStorage.getItem('NativeCalendarAppoinments');
            if(appointmentsString){
                appointmentsObject=JSON.parse(appointmentsString);
                appointmentsObject.AppointmentList.push(serNum);
                appointmentString=JSON.stringify(appointmentsObject);
                window.localStorage.setItem('NativeCalendarAppoinments',appointmentString);
            }else{
                objectToLocalStorage={};
                objectToLocalStorage.AppointmentList=[serNum];
                appointmentString=JSON.stringify(objectToLocalStorage);
                window.localStorage.setItem('NativeCalendarAppoinments',appointmentString);
            }
        }
    return {

         /**
        *@ngdoc method
        *@name setUserAppoinments
        *@methodOf MUHCApp.services:UserAppointments
        *@param {Object} appointments Appointment object obtain from Firebase
        *@description Function is called from the {@link MUHCApp.services:UpdateUI}. The function sets the UserAppointmentsArray, TodayAppointments, FutureAppointments, PastAppointments for the Appointment List used in
        the {@link MUHCApp.controller:AppointmentListController AppointmentListController}, and calendar object used in the {@link MUHCApp.controller:CalendarController CalendarController}.
        **/
        setUserAppointments: function (appointments) {
        //Initializing Variables
            UserAppointmentsInNativeCalendar=[];
            UserAppointmentsArray = [];
            appointmentsLocalStorage=[];
            calendar={};
            addAppointmentsToService(appointments);
        },
        updateUserAppointments:function(appointments)
        {
          searchAppointmentsAndDelete(appointments);
          addAppointmentsToService(appointments);
        },
        isThereNextAppointment:function(){
          var FutureAppointments=getAppointmentsInPeriod('Future');
          if(FutureAppointments.length==0)
          {
            return false;
          }else{
            return true;
          }
        },
        isThereAppointments:function()
        {
          if(UserAppointmentsArray.length==0)
          {
            return false;
          }else{
            return true;
          }
        },
        isThereFirstTreatmentAppointment:function()
        {
          if(numberOfSessions>0)
          {
            return true;
          }else{
            return false;
          }
        },
        getAppointmentBySerNum:function(serNum){
            for (var i = 0; i < UserAppointmentsArray.length; i++) {
                if(UserAppointmentsArray[i].AppointmentSerNum==serNum){
                    return angular.copy(UserAppointmentsArray[i]);
                }
            };
        },
        /**
        *@ngdoc method
        *@name getUserAppointment
        *@methodOf MUHCApp.services:UserAppointments
        *@returns {Array} UserAppointmentArray
        *@description Returns the Array of Appointments organized chronologically.
        **/
        getUserAppointments: function () {

            return UserAppointmentsArray;
        },
         /**
        *@ngdoc method
        *@name getTodaysAppointments
        *@methodOf MUHCApp.services:UserAppointments
        *@returns {Array} TodayAppointments
        *@description Returns an Array with appointments for the day.
        **/
        getTodaysAppointments: function () {
          return getAppointmentsInPeriod('Today');
        },
         /**
        *@ngdoc method
        *@name getFutureAppointments
        *@methodOf MUHCApp.services:UserAppointments
        *@returns {Array} FutureAppointments
        *@description Returns array of future appointments.
        **/
        getFutureAppointments: function () {
          return getAppointmentsInPeriod('Future');
        },
          /**
        *@ngdoc method
        *@name getPastAppointments
        *@methodOf MUHCApp.services:UserAppointments
        *@returns {Array} PastAppointments
        *@description Returns array of past appointments.
        **/
        getPastAppointments: function () {
          return getAppointmentsInPeriod('Past');
        },
        setAppointmentCheckin:function(serNum, val){
              var appointments=UserAppointmentsArray;
            for(var i=0;i<appointments.length;i++){
                if(appointments[i].AppointmentSerNum==serNum){
                    UserAppointmentsArray[i].Checkin=val;
                }
            }
        },
         /**
        }
        }
        *@ngdoc method
        *@name getUserCalendar
        *@methodOf MUHCApp.services:UserAppointments
        *@returns {Object} calendar
        *@description Returns the calendar object.
        **/
        getLastAppointmentCompleted:function(){
          var pastApp= getAppointmentsInPeriod('Past');
          if(pastApp.length==0) return -1;
          return pastApp[0];
        },
        getUpcomingAppointment:function()
        {
          var FutureAppointments=getAppointmentsInPeriod('Future');
          if(FutureAppointments.length==0) return -1;
          return FutureAppointments[0];
        },
        getUserCalendar:function(){
            return calendar;
        },
        setChangeRequest:function(index,value){
            var appointments=UserAppointmentsArray;
            for(var i=0;i<appointments.length;i++){
                if(appointments.AppointmentSerNum==index){
                    UserAppointmentsArray[i].ChangeRequest=value;
                }
            }
        },
        checkAndAddAppointmentsToCalendar:function(){
          var r=$q.defer();
          if(UserAppointmentsArray.length>0)
          {
            console.log(UserAppointmentsArray.length);
            manageAppointmentsInNativeCalendar(UserAppointmentsArray,0).then(
              function(app){
                r.resolve(app);
              });
          }else{
            r.resolve('No appointments');
          }
          return r.promise;
        }
    };
}]);
