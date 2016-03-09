var myApp=angular.module('MUHCApp');
//This service will have the user preferences for language and sent sms feature. To be used in account settings.
myApp.service('UserPreferences',[ 'UserAuthorizationInfo','$rootScope',function(UserAuthorizationInfo,$rootScope){

    return{
        setFontSize:function(size)
        {
            var username=UserAuthorizationInfo.UserName;
            window.localStorage.setItem(username+'fontSize',size);
            this.FontSize=size;
            if(size=='medium')
            {
                $rootScope.fontSizeDesc='fontDescMedium';
                $rootScope.fontSizeTitle='fontTitleMedium';
            }else if(size=='large'){
                $rootScope.fontSizeDesc='fontDescLarge';
                $rootScope.fontSizeTitle='fontTitleLarge';
            }
        },
        getFontSize:function()
        {
            var username=UserAuthorizationInfo.UserName;
            this.FontSize='medium';
            $rootScope.fontSizeDesc='fontDescMedium';
            $rootScope.fontSizeTitle='fontTitleMedium';
            var fontSize=window.localStorage.getItem(username+'fontSize');
            if(fontSize&&typeof fontSize!=='undefined'&&fontSize=='large')
            {
                this.FontSize=fontSize;
                $rootScope.fontSizeDesc='fontDescLarge';
                $rootScope.fontSizeTitle='fontTitleLarge';
            }
            return this.FontSize;
        },
        setNativeCalendarOption:function(calendarOption){
            if(calendarOption){
                this.calendarOption=calendarOption;
            }
        },
        getNativeCalendarOption:function(){
            return this.calendarOption;
        },
        setLanguage:function(lan){
            this.Language=lan;
        },
        setEnableSMS:function(){
            return this.EnableSMS;
        },
        getLanguage:function(){
            return this.Language;

        },
        getEnableSMS:function(){
            return this.EnableSMS;
        },
        setUserPreferences:function(preferences){
            this.Language=preferences.Language;
            this.EnableSMS=preferences.EnableSMS;
        }

    }



}]);
