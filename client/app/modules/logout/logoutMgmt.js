/*==========================================================
    Author      : Siva Kella
    Date Created: 28 Nov 2016
    Description : Base for Logout module
    
    Change Log
    s.no      date    author     description     
    

 ===========================================================*/

var logout = angular.module('logout', ['ui.router', 'ngResource', 'ngAnimate']);


logout.config(["$stateProvider", function ($stateProvider) {

    //login page state
    $stateProvider.state('logout', {
        url: '/logout',
        templateUrl: 'app/modules/logout/logout.html',
        controller: 'logoutCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Logout'
        }
    });

}]);

