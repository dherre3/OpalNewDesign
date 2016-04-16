angular.module('MUHCApp').controller('MainController', ["$state",'$rootScope','FirebaseService',function ($state,$rootScope,FirebaseService) {
    $state.transitionTo('logIn');
    //Firebase.getDefaultConfig().setPersistenceEnabled(true);
}]);
