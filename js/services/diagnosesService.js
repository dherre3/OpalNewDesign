var myApp=angular.module('MUHCApp');
myApp.service('Diagnoses',function($filter){
    var diagnoses=[];
    return{
      setDiagnoses:function(diag,init)
      {
        if(init==1)
        {
          diagnoses=[];
        }
        diagnoses=[];
        if(!angular.isDefined(diag)||!angular.isArray(diag)) return ;
        for (var i = 0; i < diag.length; i++) {
          console.log(diag[i].CreationDate);
          diag[i].CreationDate=new Date(diag[i].CreationDate);
          diagnoses.push(diag[i]);
        }
        diagnoses=$filter('orderBy')(diagnoses, 'CreationDate');
        console.log(diagnoses);
      },
      getDiagnoses:function()
      {
        return diagnoses;
      }
    }



  });
