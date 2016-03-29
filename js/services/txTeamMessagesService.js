var myApp=angular.module('MUHCApp');
//Service that deals with the treatment team message information
myApp.service('TxTeamMessages', ['$filter','RequestToServer','LocalStorage', function($filter,RequestToServer, LocalStorage){
  //Initializing array that represents all the informations for TxTeamMessages
  var txTeamMessagesArray=[];

  //When there is an update, find the matching message and delete it, its added later by addToTreatmentTeamMessages function
  function findAndDeleteTreatmentTeamMessages(messages)
  {
    for (var i = 0; i < messages.length; i++) {
      for (var j = 0; j < txTeamMessagesArray.length; j++) {
        if(txTeamMessagesArray[j].RecordSerNum==messages[i].RecordSerNum)
        {
          txTeamMessagesArray.splice(j,1);
        }
      }
    }
  }
  //Formats the input dates and gets it ready for controllers, updates txTeamMessagesArray
  function addTreatmentTeamMessages(messages)
  {
    console.log(messages);
    //If messages are undefined simply return
    if(typeof messages=='undefined') return;
    for (var i = 0; i < messages.length; i++) {
      //Format the date to javascript
      messages[i].DateAdded=$filter('formatDate')(messages[i].DateAdded);
      //Add to my TxTeamMessages array
      txTeamMessagesArray.push(messages[i]);
    }
    //Update local storage section
    LocalStorage.WriteToLocalStorage('TxTeamMessages',txTeamMessagesArray);
  }
  return {
    //Setter the messages from 0
    setTxTeamMessages:function(messages)
    {
      txTeamMessagesArray=[];
      addTreatmentTeamMessages(messages);
    },
    //Update the messages
    updateTxTeamMessages:function(messages)
    {
      //Find and delete to be added later
      findAndDeleteTreatmentTeamMessages(messages);
      //Call formatting function
      addTreatmentTeamMessages(messages);
    },
    //Getter for the main array
    getTxTeamMessages:function()
    {
      return txTeamMessagesArray;
    },
    //Gets Last message to display on main tab pages
    getLastTxTeamMessage:function()
    {
      if(txTeamMessagesArray.length==0) return null;
      return txTeamMessagesArray[0];
    },
    //Gets unread messages for notifications and badges
    getUnreadTxTeamMessages:function()
    {
        var array=[];
        for (var i = 0; i < txTeamMessagesArray.length; i++) {
          if(txTeamMessagesArray[i].ReadStatus=='0')
          {
            array.push(txTeamMessagesArray[i]);
          }
        }
        return array;
    },
    //Obtain a team message by ser num
    getTxTeamMessageBySerNum:function(serNum)
    {
      for (var i = 0; i < txTeamMessagesArray.length; i++) {
        if(txTeamMessagesArray[i].RecordSerNum==serNum)
        {
          return angular.copy(txTeamMessagesArray[i]);
        }
      }
    },
    //Reads the treatment team message and sends it to backend for processing
    readTxTeamMessage:function(serNum)
    {
      for (var i = 0; i < txTeamMessagesArray.length; i++) {
        if(txTeamMessagesArray[i].RecordSerNum==serNum)
        {
          txTeamMessagesArray[i]='1';
          RequestToServer.sendRequest('Read',{'Id':serNum, 'Field':'TxTeamMessages'});
        }
      }
    }
  };
  }]);
