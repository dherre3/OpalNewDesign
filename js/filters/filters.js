var myApp=angular.module('MUHCApp.filters',[]);
	myApp.filter('notifications',function(){
		return function(input){
			if(input==='DoctorNote'){
				return 'Doctor Note';
			}else if(input==='DocumentReady'){
				return 'Document Ready';
			}else if(input==='AppointmentChange'){
				return 'Appointment Change';
			}

		}



	});
	myApp.filter('removeTitleEducationalMaterial',function()
	{
		return function(string)
		{
			var length = string.indexOf("titleMaterialId");
			if(length>-1)
			{
				var preceding = string.substring(0,length+1);
				//Index for first instance of < for heading tag
				var lastIndex = preceding.lastIndexOf('<');
				var preceding = preceding.substring(0,preceding.lastIndexOf('<'));
				//index of next closing tag
				var proceeding = string.substring(string.indexOf('>',length+1)+2);
				proceeding = proceeding.substring(proceeding.indexOf('>')+1);
				return preceding.concat(proceeding);
			}else{
				return string;
			}
			
		};
	});
	myApp.filter('formatDateAppointmentTask',function($filter){
		return function(dateApp)
		{
			var today=new Date();
			if(typeof dateApp!=='undefined'){
				if(dateApp.getFullYear()==today.getFullYear())
				{
					return $filter('date')(dateApp,"EEEE MMM d 'at' h:mm a");
				}else{
					return $filter('date')(dateApp,"EEEE MMM d yyyy");
				}
			}else{
				return '';
			}

		}


	});
  myApp.filter('formatDateToFirebaseString',function(){
    return function(date){
      var month=date.getMonth()+1;
      var year=date.getFullYear();
      var day=date.getDate();
      var minutes=date.getMinutes();
      var seconds=date.getSeconds();
      var hours=date.getHours();
      var string= year+'-'+month+'-'+day+'T'+hours+':'+ minutes +':'+seconds+'.000'+'Z';
      return string;




    }

  });


	myApp.filter('formatDate',function(){
		return function(str) {
        if(typeof str==='string'){
          var a = str.split(/[^0-9]/);
          //for (i=0;i<a.length;i++) { alert(a[i]); }
          var d=new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5] );
        return d;
        }
      }
	});
	myApp.filter('ellipsis', function () {
	    return function (text, length) {
	        if (text.length > length) {
	            return text.substr(0, length) + "...";
	        }
	        return text;
	    }
	});
myApp.filter('dateEmail',function($filter){
  return function(date){
		if(Object.prototype.toString.call(date) === '[object Date]')
		{
			var day=date.getDate();
			var month=date.getMonth();
			var year=date.getFullYear();
			var newDate=new Date();
			if(newDate.getMonth()==month&&newDate.getFullYear()==year)
			{
				if(day==newDate.getDate())
				{
					return 'Today, ' +$filter('date')(date, 'h:mm a');
				}else if(day-newDate.getDate()==1){
					return 'Yesterday';
				}else{
					return $filter('date')(date, 'dd/MM/yyyy');
				}
			}else{
				return $filter('date')(date, 'dd/MM/yyyy');
			}
		}else{
			return date;
		}





  };

});
myApp.filter('limitLetters',function($filter){
	return function(string,num)
	{
		if(string&&typeof string!=='undefined'&&string.length>num)
		{
			string=$filter('limitTo')(string,num);
			string=string+'...';
		}
		return string;
	}
});
myApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});
myApp.filter('filterDateLabTests',function()
{
return function(items,option)
{
	var ret=[];
	if(option=='All')
	{
		return items;
	}else if(option=='LastTwoMonths'){
		var lastTwoMonths=new Date();
		lastTwoMonths.setMonth(lastTwoMonths.getMonth()-2);
		for (var i = 0; i < items.length; i++) {
			if(items[i].testDateFormat > lastTwoMonths)
			{
				ret.push(items[i]);
			}
		}
		return ret;
}else if(option=='LastTwelveMonths'){
	var lastTwelveMonths=new Date();
	lastTwelveMonths.setFullYear(lastTwelveMonths.getFullYear()-1);
	for (var i = 0; i < items.length; i++) {
		if(items[i].testDateFormat>lastTwelveMonths)
		{
			ret.push(items[i]);
		}
	}
	return ret;
	}
};
});

myApp.filter('FormatPhoneNumber',function(){
	return function(phone)
	{
		console.log(typeof(phone));
		if(typeof phone =='string'&&phone.length==10)
		{
			console.log('Inside string equal ten');
			var firstDigits=phone.substring(0,3);
			var secondDigits=phone.substring(3,6);
			var thirdDigits=phone.substring(6,phone.length);
			console.log("("+firstDigits+")"+" "+secondDigits+"-"+thirdDigits);
			return "("+firstDigits+")"+" "+secondDigits+"-"+thirdDigits;
		}else{
			console.log(phone)
			return phone;
		}
	};

});
