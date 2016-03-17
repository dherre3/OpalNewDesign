var myApp=angular.module('MUHCApp');
myApp.service('Diagnoses',function($filter,LocalStorage){
    var diagnoses=[];
    var diagnosesToLocalStorage=[];
    function addDiagnosis(diag)
    {
      if(typeof diag=='undefined') return ;
      var temp=angular.copy(diag);
      diagnosesToLocalStorage.concat(temp);
      LocalStorage.WriteToLocalStorage(temp);
      for (var i = 0; i < diag.length; i++) {
        console.log(diag[i].CreationDate);
        diag[i].CreationDate=$filter('formatDate')(diag[i].CreationDate);
        diagnoses.push(diag[i]);
      }
      diagnoses=$filter('orderBy')(diagnoses, 'CreationDate');
      console.log(diagnoses);
    }
    return{
      setDiagnoses:function(diag)
      {
        diagnoses=[];
        diagnosesToLocalStorage=[];
        addDiagnosis(diag)
      },
      updateDiagnoses:function(diag)
      {
        addDiagnosis(diag)
      },
      getDiagnoses:function()
      {
        return diagnoses;
      }
    }



  });
