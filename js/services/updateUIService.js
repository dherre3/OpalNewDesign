var myApp=angular.module('MUHCApp');


myApp.service('UpdateUI', ['EncryptionService','$http', 'Patient','Doctors','Appointments','Messages','Documents','UserPreferences', 'UserAuthorizationInfo', '$q', 'Notifications', 'UserPlanWorkflow','$cordovaNetwork', 'Notes', 'LocalStorage','RequestToServer','$filter','LabResults','Diagnoses','FirebaseService','MapLocation',
function (EncryptionService,$http, Patient,Doctors, Appointments,Messages, Documents, UserPreferences, UserAuthorizationInfo, $q, Notifications, UserPlanWorkflow,$cordovaNetwork,Notes,LocalStorage,RequestToServer,$filter,LabResults,Diagnoses,FirebaseService,MapLocation ) {

    function updateAllServices(dataUserObject,mode){
        console.log(mode);
        var promises=[];
        console.log(dataUserObject);
        if(mode=='Online')
        {
          var documents=dataUserObject.Documents;
          var documentProm=Documents.setDocumentsOnline(documents);
          var doctors=dataUserObject.Doctors;
          var doctorProm=Doctors.setUserContactsOnline(doctors);
          var patientFields=dataUserObject.Patient;
          var patientProm=Patient.setUserFieldsOnline(patientFields);
          console.log(patientProm);
          promises=[doctorProm,documentProm,patientProm];
        }else{
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
            Diagnoses.setDiagnoses(dataUserObject.Diagnoses);
          	LabResults.setTestResults(dataUserObject.LabTests);
            UserPlanWorkflow.setUserPlanWorkflow(plan);
            UserPreferences.setUserPreferences(dataUserObject.Patient.Language,dataUserObject.Patient.EnableSMS);
            UserPreferences.getFontSize();
            Appointments.setUserAppointments(dataUserObject.Appointments);
            Notes.setNotes(dataUserObject.Notes);
            console.log(dataUserObject);
            if(mode=='Online')
            {
              LocalStorage.WriteToLocalStorage('All',dataUserObject);
            }

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
    function UpdateSectionOnline(section)
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
                        updateAllServices(data, 'Online');
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
    }

    this.internetConnection=false;
    return {
        UpdateUserFields:function(){
            //Check if its a device or a computer
            var r=$q.defer();
            var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
            if(app){
                if($cordovaNetwork.isOnline()){
                    return updateUIOnline();
                }else{
                    return updateUIOffline();
                }
            }else{
                //Computer check if online
                if(navigator.onLine){
                    console.log('online website');
                    return updateUIOnline();
                }else{
                    console.log('offline website');
                    return updateUIOffline();
                }
             }
        },
        UpdateOffline:function(section)
        {
          return UpdateSectionOffline(section);
        },
        UpdateOnline:function(section)
        {
          return UpdateSectionOnline(section);
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
