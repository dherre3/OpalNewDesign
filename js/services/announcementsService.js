var myApp=angular.module('MUHCApp');
//Service that deals with the announcement information for the patient
myApp.service('Announcements', ['RequestToServer','$filter',function(RequestToServer,$filter){
  //Initializing array that represents all the informations for Announcements
  var announcementsArray=[];
  //When there is an update, find the matching message and delete it, its added later by findAndDeleteAnnouncements function
  function findAndDeleteAnnouncements(announcements)
  {
    for (var i = 0; i < announcements.length; i++) {
      for (var j = 0; j < announcementsArray.length; j++) {
        if(announcementsArray[j].RecordSerNum==announcements[i].RecordSerNum)
        {
          announcementsArray.splice(j,1);
        }
      }
    }
  }
  //Formats the input dates and gets it ready for controllers, updates announcementsArray
  function addAnnouncements(announcements)
  {
    console.log(announcements);
    //If announcements are undefined simply return
    if(typeof announcements=='undefined') return;
    for (var i = 0; i < announcements.length; i++) {
      //Format the date to javascript
      announcements[i].DateAdded=$filter('formatDate')(announcements[i].DateAdded);
      //Add to my annoucements array
      announcementsArray.push(announcements[i]);
    }
    //Update local storage section
    LocalStorage.WriteToLocalStorage('Annoucements',announcementsArray);
  }
  return {
    //Setter the announcements from 0
    setAnnouncements:function(announcements)
    {
      announcementsArray=[];
      addAnnouncements(announcements)
    },
    //Update the announcements
    updateAnnouncements:function(announcements)
    {
      //Find and delete to be added later
      findAndDeleteAnnouncements(announcements);
      //Call formatting function
      addAnnouncements(announcements);
    },
    //Getter for the main array
    getAnnouncements:function()
    {
      return announcementsArray;
    },
    //Gets Last Announcement to display on main tab pages
    getLastAnnouncements:function()
    {
      if(announcementsArray.length==0) return null;
      return announcementsArray[0];
    },
    //Gets unread announcements
    getUnreadAnnouncements:function()
    {
      var array=[];
      for (var i = 0; i < announcementsArray.length; i++) {
        if(announcementsArray[i].ReadStatus=='0')
        {
          array.push(announcementsArray[i]);
        }
      }
      return array;
    },
    getAnnouncementBySerNum:function(serNum)
    {
      for (var i = 0; i < announcementsArray.length; i++) {
        if(announcementsArray[i].RecordSerNum==serNum)
        {
          return angular.copy(announcementsArray[i]);
        }
      }
    },
    //Reads announcement and sends request to backend
    readAnnouncements:function(serNum)
    {
      for (var i = 0; i < announcementsArray.length; i++) {
        if(announcementsArray[i].RecordSerNum==serNum)
        {
          announcementsArray[i]='1';
          RequestToServer.sendRequest('Read',{'Id':serNum, 'Field':'Announcements'});
        }
      }
    }
  };
  }]);
