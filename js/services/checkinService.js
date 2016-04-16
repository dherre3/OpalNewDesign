var myApp=angular.module('MUHCApp');
myApp.factory('CheckinService', ['$q', 'RequestToServer', 'Appointments', '$timeout','FirebaseService','EncryptionService', '$rootScope','UserPreferences',function ($q, RequestToServer, Appointments,$timeout,FirebaseService,EncryptionService,$rootScope,UserPreferences) {
    //haveAppointmentToday();
    //isAllowedToCheckin();
    //checkinUser()
    //alreadyCheckin()
    var checkinUpdatesInterval = null;
    function setLanguageCheckin(value)
    {
      var language = UserPreferences.getLanguage();
      $timeout(function(){
          if(language =='EN')
          {
            $rootScope.precedingPatientsLabel = value.preceding.EN;
            $rootScope.checkinEstimate = value.estimate.EN;
            $rootScope.scheduleAhead = value.schedule.EN;
          }else{
            $rootScope.precedingPatientsLabel = value.preceding.FR;
            $rootScope.checkinEstimate = value.estimate.FR;
            $rootScope.scheduleAhead = value.schedule.FR;
          }
      });
    }
    function liveCheckinUpdates(nextAppointment)
    {

      if(checkinUpdatesInterval)
      {
        clearInterval(checkinUpdatesInterval);
      }
      RequestToServer.sendRequest('CheckinUpdate', {AppointmentSerNum:nextAppointment.AppointmentSerNum});
      checkinUpdatesInterval = setInterval(function(){
        RequestToServer.sendRequest('CheckinUpdate', {AppointmentSerNum:nextAppointment.AppointmentSerNum});
      },120000);
      console.log(FirebaseService.getFirebaseUserFieldsUrl()+"/Field/Checkin");
      var ref = new Firebase(FirebaseService.getFirebaseUserFieldsUrl()+"/Field/Checkin");
      ref.on('value',function(snapshot){
        var value = snapshot.val();
        console.log(value);
        if(value && typeof value !== 'undefined')
        {
          value = EncryptionService.decryptData(value);
          console.log(value);
          if(value.response.type == 'close' || value.response.type == 'error')
          {
            clearInterval(checkinUpdatesInterval);
            //ref.set(null);
            ref.off();
          }else{
             setLanguageCheckin(value);
             //ref.set(null);
          }
        }
      },function(error)
      {
        console.log(error);
      });
    }

    //Helper methods
    //Obtaining the position from the GPS
    function isWithinAllowedRange()
    {
      var r=$q.defer();
        navigator.geolocation.getCurrentPosition(function(position){
          var distanceMeters = 1000 * getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, 45.473127399999996, -73.6028402);
          //var distanceMeters=1000*getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude,45.5072138,-73.5784825);
          //var distanceMeters = 100;
          /*alert('Distance: '+ distanceMeters+
              'Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');*/
            if (distanceMeters <= 3000) {
              r.resolve('Check-in to your Appointment');
          } else {
              r.reject('Checkin allowed in the vecinity of the Cancer Center');
          }

        }, function(error){
          console.log(error.code);
          r.reject('Could not obtain GPS location');
        });
      return r.promise;
    }
    //Checks if there are appointments today
    function haveNextAppointmentToday(){
      //Checks if the user has appointments
      if(Appointments.isThereAppointments())
      {
          if(Appointments.isThereNextAppointment())
          {
            var today = new Date();
            var nextAppointment=Appointments.getUpcomingAppointment();
            var nextAppointmentDate=nextAppointment.ScheduledStartTime;
            if(today.getDate()==nextAppointmentDate.getDate()&&today.getFullYear()==nextAppointmentDate.getFullYear()&&today.getMonth()==nextAppointmentDate.getMonth())
            {
              return true;
            }else{
              return false;
            }
          }else{
            return false;
          }
      }else{
        return false;
      }
      var noFutureAppointments=false;

      var nextAppointment=Appointments.getNextAppointment().Object;
    };

    //Helper functions for finding patient location
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
       var R = 6371; // Radius of the earth in km
       var dLat = deg2rad(lat2 - lat1); // deg2rad below
       var dLon = deg2rad(lon2 - lon1);
       var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
       var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
       var d = R * c; // Distance in km
       return d;
   }
   function deg2rad(deg) {
       return deg * (Math.PI / 180);
   }
    return {
      haveNextAppointmentToday:function()
      {
        return haveNextAppointmentToday();
      },
      isAlreadyCheckedin:function()
      {
        var nextAppointment=Appointments.getUpcomingAppointment();
          if(nextAppointment.Checkin=='1')
          {
            return true;
          }else{
            return false;
          }
      },
      isAllowedToCheckin:function()
      {
        var r =$q.defer();
        isWithinAllowedRange().then(function(response)
        {
          r.resolve(response);
        },function(response){
          r.reject(response);
        });
        return r.promise;
      },
      checkinToAppointment:function(nextAppointment)
      {
        var nextAppointment=Appointments.getCheckinAppointment();
        Appointments.setAppointmentCheckin(nextAppointment.AppointmentSerNum);
        RequestToServer.sendRequest('Checkin', {AppointmentSerNum:nextAppointment.AppointmentSerNum});
        liveCheckinUpdates(nextAppointment);
        return true;
      },
      getCheckinUpdates:function(nextappointment)
      {
        liveCheckinUpdates(nextappointment);
      }




    };


}]);
