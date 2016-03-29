var myApp=angular.module('MUHCApp');
myApp.service('EducationalMaterial',[function () {
  //Types of educational material
  var educationalMaterialType={
    'Video':{
      icon:'fa fa-video',
      color:'Olive'
    },
    'Factsheet':{
      icon:'ion-ios-list-outline',
      color:'SaddleBrown'
    },
    'Booklet':{
      icon:'ion-android-map',
      color:'SeaGreen'
    },
    'Treatment Guideline':{
      icon:'ion-ios-list-outline',
      color:'SaddleBrown'
    },
    'Other':{
      icon:'fa fa-book',
      color:'DarkSlateGrey'
    }
  };
  //Initializing array that represents all the informations for Announcements
  var educationalMaterialArray=[];

  //When there is an update, find the matching material and delete it, its later added by addEducationalMaterial function
  function findAndDeleteEducationalMaterial(edumaterial)
  {
    for (var i = 0; i < edumaterial.length; i++) {
      for (var j = 0; j < educationalMaterialArray.length; j++) {
        if(educationalMaterialArray[j].RecordSerNum==edumaterial[i].RecordSerNum)
        {
          educationalMaterialArray.splice(j,1);
        }
      }
    }
  }
  //Formats the input dates and gets it ready for controllers, updates announcementsArray
  function addEducationalMaterial(edumaterial)
  {
    console.log(edumaterial);
    //If announcements are undefined simply return
    if(typeof edumaterial=='undefined') return;
    for (var i = 0; i < edumaterial.length; i++) {
      //Format the date to javascript
      edumaterial[i].DateAdded=$filter('formatDate')(edumaterial[i].DateAdded);
      //Add to my annoucements array
      educationalMaterialArray.push(edumaterial[i]);
    }
    //Update local storage section
    LocalStorage.WriteToLocalStorage('EducationalMaterial',educationalMaterialArray);
  }
  return {
    //Setter the announcements from 0
    setEducationalMaterial:function(edumaterial)
    {
      educationalMaterialArray=[];
      addEducationalMaterial(edumaterial)
    },
    //Update the announcements
    updateEducationalMaterial:function(edumaterial)
    {
      //Find and delete to be added later
      findAndDeleteEducationalMaterial(edumaterial);
      //Call formatting function
      addEducationalMaterial(edumaterial);
    },
    //Getter for the main array
    getEducationalMaterial:function()
    {
      return educationalMaterialArray;
    },
    //Gets Last Announcement to display on main tab pages
    getLastEducationalMaterial:function()
    {
      if(educationalMaterialArray.length==0) return null;
      return educationalMaterialArray[0];
    },
    //Gets unread announcements
    getUnreadEducationalMaterials:function()
    {
      var array=[];
      for (var i = 0; i < educationalMaterialArray.length; i++) {
        if(educationalMaterialArray[i].ReadStatus=='0')
        {
          array.push(educationalMaterialArray[i]);
        }
      }
      return array;
    },
    getEducationaMaterialBySerNum:function(serNum)
    {
      for (var i = 0; i < educationalMaterialArray.length; i++) {
        if(educationalMaterialArray[i].RecordSerNum==serNum)
        {
          return angular.copy(educationalMaterialArray[i]);
        }
      }
    },
    //Reads announcement and sends request to backend
    readEducationalMaterial:function(serNum)
    {
      for (var i = 0; i < educationalMaterialArray.length; i++) {
        if(educationalMaterialArray[i].RecordSerNum==serNum)
        {
          educationalMaterialArray[i]='1';
          RequestToServer.sendRequest('Read',{'Id':serNum, 'Field':'EducationalMaterial'});
        }
      }
    }
  };


  }]);
