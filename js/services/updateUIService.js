var myApp=angular.module('MUHCApp');


myApp.service('UpdateUI', ['EncryptionService','$timeout', '$rootScope','Patient','Doctors','Appointments','Messages','Documents','UserPreferences', 'UserAuthorizationInfo', '$q', 'Notifications', 'UserPlanWorkflow','$cordovaNetwork', 'Notes', 'LocalStorage','RequestToServer','$filter','LabResults','Diagnoses','FirebaseService','MapLocation',
'NativeNotification',function (EncryptionService,$timeout, $rootScope, Patient,Doctors, Appointments,Messages, Documents, UserPreferences, UserAuthorizationInfo, $q, Notifications, UserPlanWorkflow,$cordovaNetwork,Notes,LocalStorage,RequestToServer,$filter,LabResults,Diagnoses,FirebaseService,MapLocation,NativeNotification ) {
  var sectionServiceMappings={
    'All':
      {
        init:setAllServices,
        update:updateAllServices
      },
    'Documents':
    {
      init:Documents.setDocumentsOnline,
      update:Documents.updateDocuments,
      setOffline:Documents.setDocumentsOffline
    },
    'Patient':{
      init:Patient.setUserFieldsOnline,
      update:Patient.setUserFieldsOnline,
      setOffline:Patient.setUserFieldsOffline
    },
    'Doctors':{
      init:Doctors.setUserContactsOnline,
      update:Doctors.updateUserContacts,
      setOffline:Doctors.setUserContactsOffline
    },
    'Appointments':{
      init:Appointments.setUserAppointments,
      update:Appointments.updateUserAppointments
    },
    'Messages':
    {
      init:Messages.setUserMessages,
      update:Messages.updateUserMessages
    },
    'Notifications':
    {
      init:Notifications.setUserNotifications,
      update:Notifications.updateUserNotifications
    },
    'LabTests': {
      init:LabResults.setTestResults,
      update:LabResults.updateTestResults
    },
    'MapLocation':
    {
      update:MapLocation.updateMapLocation
    },
    'Diagnosis':
    {
      init:Diagnoses.setDiagnoses,
      update:Diagnoses.updateDiagnoses
    }
  };
  function initLocalStorage()
  {
    var objectToLocalStorage={};
    for (var key in sectionServiceMappings.length) {
      objectToLocalStorage[key]=[];
    }
    LocalStorage.WriteToLocalStorage('All',objectToLocalStorage);
  }
    function setAllServices(dataUserObject,mode)
    {

      console.log(mode);
      var promises=[];
      console.log(dataUserObject);
      if(mode=='Online')
      {
        initLocalStorage();
        console.log('I am in there');
        var documents=dataUserObject.Documents;
        var documentProm=Documents.setDocumentsOnline(documents);
        var doctors=dataUserObject.Doctors;
        var doctorProm=Doctors.setUserContactsOnline(doctors);
        var patientFields=dataUserObject.Patient;
        var patientProm=Patient.setUserFieldsOnline(patientFields);
        console.log(patientProm);
        promises=[doctorProm,documentProm,patientProm];
      }else{
        $rootScope.statusRoot="Mode offline";
        var documentProm=Documents.setDocumentsOffline(dataUserObject.Documents);
        var doctorProm=Doctors.setUserContactsOffline(dataUserObject.Doctors);
        var patientProm=Patient.setUserFieldsOffline(dataUserObject.Patient);
        promises=[documentProm,doctorProm,patientProm];
      }
      $q.all(promises).then(function(){
        Messages.setUserMessages(dataUserObject.Messages);
        Notifications.setUserNotifications(dataUserObject.Notifications);
        UserPlanWorkflow.setTreatmentPlan(dataUserObject.Tasks, dataUserObject.Appointments);
        var plan={
            '1':{'Name':'CT for Radiotherapy Planning','Date':'2015-10-19T09:00:00Z','Description':' CT simulation includes a CT scan of the area of your body to be treated with radiation. The CT images acquired during your scan will be reconstructed and used to design the best and most precise treatment plan for you.','Type': 'Appointment'},
            '2':{'Name':'Physician Plan Preparation','Date':'2015-10-21T09:15:00Z','Description':'During this stage countoring of area is performed by Medical Physicist and approved by physician','Type':'Task'},
            '3':{'Name':'Calculation of Dose & Physician Review','Date':'2015-10-23T09:15:00Z','Description':'The dose is calculated the physician reviews and approves the treatment plan.','Type':'Task'},
            '4':{'Name':'Physics Quality Control','Date':'2015-10-28T10:15:00Z','Description':'In the QA stage, the physicians plan is compared to previous plans performed for similar patients to make sure everything is normal and the plan fits the standards','Type':'Task'},
            '5':{'Name':'Scheduling','Date':'2015-10-30T09:15:00Z','Description':'At this stage, the scheduling of the treatment appointments is done.','Type':'Task'},
            '6':{'Name':'First Treatment','Date':'2015-11-02T09:15:00Z','Description':'First treatment for radiation','Type':'Task'}
        };
        var newDate=new Date();
        var valAdded=-6;

        for (var key in plan) {
          var tmp=new Date(newDate);
          tmp.setDate(tmp.getDate()+valAdded);
          valAdded+=2;
          plan[key].Date=$filter('formatDateToFirebaseString')(tmp);
        }
          Diagnoses.setDiagnoses(dataUserObject.Diagnosis);
          LabResults.setTestResults(dataUserObject.LabTests);
          UserPlanWorkflow.setUserPlanWorkflow(plan);
          console.log(dataUserObject.Patient[0].Language);
          UserPreferences.setUserPreferences(dataUserObject.Patient[0].Language,dataUserObject.Patient[0].EnableSMS);
          UserPreferences.getFontSize();
          Appointments.setUserAppointments(dataUserObject.Appointments);
          Notes.setNotes(dataUserObject.Notes);
          console.log(dataUserObject);
        /*if(mode=='Online')
          {
            LocalStorage.WriteToLocalStorage('All',dataUserObject);
          }*/

      });
    }
    function updateAllServices(dataUserObject){
        var promises=[];
        console.log(dataUserObject);
        if(mode=='Online')
        {
          var documents=dataUserObject.Documents;
          var documentProm=Documents.updateDocumentsOnline(documents);
          var doctors=dataUserObject.Doctors;
          var doctorProm=Doctors.updateUserContactsOnline(doctors);
          var patientFields=dataUserObject.Patient[0];
          var patientProm=Patient.updateUserFieldsOnline(patientFields);
          console.log(patientProm);
          promises=[doctorProm,documentProm,patientProm];
        }else{
          var documentProm=Documents.setDocumentsOffline(dataUserObject.Documents);
          var doctorProm=Doctors.setUserContactsOffline(dataUserObject.Doctors);
          var patientProm=Patient.setUserFieldsOffline(dataUserObject.Patient[0]);
          promises=[documentProm,doctorProm,patientProm];
        }
        $q.all(promises).then(function(){
          Messages.updateUserMessages(dataUserObject.Messages);
          Notifications.updateUserNotifications(dataUserObject.Notifications);
          UserPlanWorkflow.setTreatmentPlan(dataUserObject.Tasks, dataUserObject.Appointments);
          var plan={
              '1':{'Name':'CT for Radiotherapy Planning','Date':'2015-10-19T09:00:00Z','Description':' CT simulation includes a CT scan of the area of your body to be treated with radiation. The CT images acquired during your scan will be reconstructed and used to design the best and most precise treatment plan for you.','Type': 'Appointment'},
              '2':{'Name':'Physician Plan Preparation','Date':'2015-10-21T09:15:00Z','Description':'During this stage countoring of area is performed by Medical Physicist and approved by physician','Type':'Task'},
              '3':{'Name':'Calculation of Dose & Physician Review','Date':'2015-10-23T09:15:00Z','Description':'The dose is calculated the physician reviews and approves the treatment plan.','Type':'Task'},
              '4':{'Name':'Physics Quality Control','Date':'2015-10-28T10:15:00Z','Description':'In the QA stage, the physicians plan is compared to previous plans performed for similar patients to make sure everything is normal and the plan fits the standards','Type':'Task'},
              '5':{'Name':'Scheduling','Date':'2015-10-30T09:15:00Z','Description':'At this stage, the scheduling of the treatment appointments is done.','Type':'Task'},
              '6':{'Name':'First Treatment','Date':'2015-11-02T09:15:00Z','Description':'First treatment for radiation','Type':'Task'}
          };
          var newDate=new Date();
          var valAdded=-6;

          for (var key in plan) {
            var tmp=new Date(newDate);
            tmp.setDate(tmp.getDate()+valAdded);
            valAdded+=2;
            plan[key].Date=$filter('formatDateToFirebaseString')(tmp);
          }
            Diagnoses.updateDiagnoses(dataUserObject.Diagnosis);
          	LabResults.updateTestResults(dataUserObject.LabTests);
            UserPlanWorkflow.setUserPlanWorkflow(plan);
            console.log(dataUserObject.Patient[0].Language);
            Appointments.updateUserAppointments(dataUserObject.Appointments);
            console.log(dataUserObject);
        });
    }

    function UpdateSectionOffline(section)
    {
        var r=$q.defer();
        var data='';
        console.log(section);
        data=LocalStorage.ReadLocalStorage(section);
        console.log(data);
        switch(section){
            case 'All':
                updateAllServices(data, 'Offline');
                break;
            case 'Doctors':
                Doctors.setUserContactsOnline(data);
                break;
            case 'Patient':
                Patient.setUserFieldsOnline(data);
                break;
            case 'Appointments':
                Appointments.setUserAppointments(data);
                break;
            case 'Messages':
                Messages.setUserMessages(data);
                break;
            case 'Documents':
                Documents.setDocumentsOffline(data);
                break;
            case 'UserPreferences':
                UserPreferences.setUserPreferences(data.Language,data.EnableSMS);
                break;
            case 'Notifications':
                Notifications.setUserNotifications(data);
                break;
            case 'Notes':
                Notes.setNotes(data);
                break;
            case 'LabTests':
                LabResults.setTestResults(data);
                break;
            case 'UserPlanWorkflow':
            //To be done eventually!!!
            break;
          }
          setTimeout(function () {
              r.resolve(true);
          }, 7000);
        return r.promise;
    }
    function updateSection(sections,parameters)
    {

      //Start promise
      var r=$q.defer();
      //Firebase url
      var ref= new Firebase(FirebaseService.getFirebaseUrl()+'Users/');
      var pathToSection=''
      var username=UserAuthorizationInfo.getUserName();
      var deviceId=RequestToServer.getIdentifier();
      //Set path to read data
      if(sections=='All')
      {
        pathToSection=username+'/'+deviceId+'/All';
      }else if(sections=='ArrayFields'){
        pathToSection=username+'/'+deviceId+'/ArrayFields';
      }else{
        if(sections!=='UserPreferences'){
            pathToSection=username+'/'+deviceId+'/'+sections;
        }else{
           pathToSection=username+'/'+deviceId+'/'+'Patient';
        }
      }
      //Connection to Firebase
      ref.child(pathToSection).on('value',function(snapshot){
          var data=snapshot.val();
          //Only if data is defined as firebase also calls value first time when data is undefined
          if(data&&typeof data!=='undefined'){
              console.log(data);
              //Decrypts incoming data
              var time=(new Date()).getTime();
              console.log(time);
              data=EncryptionService.decryptData(data);
              console.log(data);
              if(data.Response=='No Results')
              {
                console.log('Deleting response');
                ref.child(pathToSection).set(null);
                ref.child(pathToSection).off();
                r.resolve('No new results');
              }
              //To update all, searches into the appropiate table mappings and update appropiate sections
              else if(sections=='All')
              {
                RequestToServer.updateTimestamps('All',time);
                sectionServiceMappings[sections]['update'](data,'Online');
                updateAllServices(data, 'Online');
              }else if(sections=='ArrayFields'){
                RequestToServer.updateTimestamps(parameters,time);


                //Updates an array of fields, e.g. ['Messages','Documents'];
                for (var i = 0; i < paramaters.length; i++) {
                  sectionServiceMappings[paramaters[i]]['update'](data[paramaters[i]],'Online');
                }
              }else{

                //Update individual fields e.g. 'Messages'

                RequestToServer.updateTimestamps(sections,time);
                console.log('Im here');
                console.log(data);
                  sectionServiceMappings[sections]['update'](data);
                }
              console.log(data);
              //Delete the data now that it has been proccessed, and dettaches the firebase ref.
              ref.child(pathToSection).set(null);
              ref.child(pathToSection).off();
              //Resolve our promise to finish the loading and get the application going.
              r.resolve(true);
          }
      });
      return r.promise;
    }

    //Initiatiates all the services online at either login, or simple entering the app once
    //patient is already register
    function initServicesOnline()
    {
      //Sets the path for data fetching
      var r=$q.defer();
      var ref= new Firebase(FirebaseService.getFirebaseUrl()+'Users/');
      var username=UserAuthorizationInfo.getUserName();
      var deviceId=RequestToServer.getIdentifier();
      var pathToSection=username+'/'+deviceId+'/All';
      ref.child(pathToSection).on('value',function(snapshot){
          var data=snapshot.val();
          if(data&&typeof data!=='undefined'){
            //Data decryption
              data=EncryptionService.decryptData(data);
              //Initializing all the services
              sectionServiceMappings['All'].init(data, 'Online');
              //Detaching and deleting ref and data respectively
              ref.child(pathToSection).set(null);
              ref.child(pathToSection).off();
              //returning the promise of work done
              r.resolve(true);
            }
            setTimeout(function(){
              ref.child(pathToSection).set(null);
              ref.child(pathToSection).off();
              r.resolve(true);
            },20000)
          });
        return r.promise;
    }
    //Initiating services offline
    function initServicesOffline()
    {

      var r=$q.defer();
      $timeout(function(){
        $rootScope.statusRoot="Beginning init offline";
      });
      console.log('Inside the init offline function');
      data=LocalStorage.ReadLocalStorage('All');
      console.log(data);
      sectionServiceMappings['All'].init(data, 'Offline');
      r.resolve(true);
      return r.promise;
    }


    /*function UpdateSectionOnline(section)
    {
        var r=$q.defer();
        var ref= new Firebase(FirebaseService.getFirebaseUrl()+'Users/');
        var pathToSection=''
        var username=UserAuthorizationInfo.getUserName();
        var key=CryptoJS.SHA256(UserAuthorizationInfo.Token).toString();
        var deviceId=RequestToServer.getIdentifier();
        console.log(deviceId);
        if(section!=='UserPreferences'){
            pathToSection=username+'/'+deviceId+'/'+section;
        }else{
           pathToSection=username+'/'+deviceId+'/'+'Patient';
        }
        if(section=='All')
        {
            pathToSection=username+'/'+deviceId+'/All';
        }
        console.log(pathToSection);
        ref.child(pathToSection).on('value',function(snapshot){
            var data=snapshot.val();
            console.log(typeof data);
            if(data&&typeof data!=='undefined'){
                console.log(data);
                data=EncryptionService.decryptData(data);
                console.log(data);
                switch(section){
                    case 'All':
                        setAllServices(data, 'Online');
                        break;
                    case 'Doctors':
                        Doctors.setUserContactsOnline(data);
                        break;
                    case 'Patient':
                        Patient.setUserFieldsOnline(data);
                        break;
                    case 'Appointments':
                        Appointments.setUserAppointments(data);
                        break;
                    case 'Messages':
                        Messages.setUserMessages(data);
                        break;
                    case 'Documents':
                        Documents.setDocumentsOnline(data,'Online');
                        break;
                    case 'UserPreferences':
                        UserPreferences.setUserPreferences(data.Language,data.EnableSMS);
                        break;
                    case 'Notifications':
                        Notifications.setUserNotifications(data);
                        break;
                    case 'Notes':
                        Notes.setNotes(data);
                        break;
                    case 'LabTests':
                        LabResults.setTestResults(data);
                        break;
                    case 'MapLocation':
                        MapLocation.setMapLocation(data);
                        break;
                    case 'UserPlanWorkflow':
                    //To be done eventually!!!
                    break;
                }
                console.log(data);
                ref.child(pathToSection).set(null);
                ref.child(pathToSection).off();
                r.resolve(true);
            }
        });

        return r.promise;
    }*/

    this.internetConnection=false;
    return {
        UpdateOffline:function(section)
        {
          return UpdateSectionOffline(section);
        },
        UpdateOnline:function(section)
        {
          return UpdateSectionOnline(section);
        },
        //Function to update fields in the app, it does not initialize them, it only updates the new fields.
        //Parameter only defined when its a particular array of values.
        update(section,parameters)
        {
          var r=$q.defer();
          var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
          if(app){
              if($cordovaNetwork.isOnline()){
                  this.internetConnection=true;
                  return updateSection(section,parameters);
              }else{
                  this.internetConnection=false;

                  NativeNotification.showNotificationAlert('Connect to the internet to fetch your most recent data');
                  }
          }else{
              //Computer check if online
              if(navigator.onLine){
                  console.log('online website');
                  this.internetConnection=true;
                  return updateSection(section,parameters);
              }else{
                  this.internetConnection=false;
                  NativeNotification.showNotificationAlert('Connect to the internet to fetch your most recent data');
              }
           }
           return r.promise;
        },
        init:function()
        {
          $timeout(function(){
            $rootScope.statusRoot='Inside init function';
          })


          var r=$q.defer();
          var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
          if(app){
              if($cordovaNetwork.isOnline()){
                  this.internetConnection=true;
                  return initServicesOnline();
              }else{
                $timeout(function(){
                $rootScope.statusRoot="About to initiate services offline";
              });
                  this.internetConnection=false;
                  console.log('Initiating services offline');
                  return initServicesOffline();
                  }
          }else{
              //Computer check if online
              if(navigator.onLine){
                  console.log('online website');
                  this.internetConnection=true;
                  return initServicesOnline();
              }else{
                  this.internetConnection=false;
                  console.log('offline website');
                  return initServicesOffline();
              }
           }
          return r.promise;
        },
        UpdateSection:function(section,onDemand)
        {
            var r=$q.defer();
            var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            if(app){
                if($cordovaNetwork.isOnline()){
                    this.internetConnection=true;
                    return UpdateSectionOnline(section);
                }else{
                    this.internetConnection=false;
                    if(onDemand)
                    {
                      r.reject('No internet connection');
                    }else{
                      return UpdateSectionOffline(section);
                    }
                }
            }else{
                //Computer check if online
                if(navigator.onLine){
                    console.log('online website');
                    this.internetConnection=true;
                    return UpdateSectionOnline(section);
                }else{
                    this.internetConnection=false;
                    console.log('offline website');
                    return UpdateSectionOffline(section);
                }
             }
            return r.promise;
        },
        getInternetConnection:function()
        {
          return this.internetConnection;
        }

    };

}]);
