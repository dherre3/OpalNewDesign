angular.module('MUHCApp').directive('newsBanner', function() {
  return {
    restrict: 'E',
    template: "<div id=\"news\" class=\"text-center element\" style=\"color:white;font-size:15px;background-color:DeepSkyBlue ;position: absolute;width:100vw;height:30px;top:0px;z-index:3\" ng-style=\"{'background-color':alertBanner.Color}\"><p style=\"vertical-align:middle;\"><strong> <i style=\"font-size:20px\" ng-class=\"alertBanner.Icon\" ></i> {{alertBanner.Message.EN}}</strong></p></div>"
  };
});
