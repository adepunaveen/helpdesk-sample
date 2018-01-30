
logout.controller("logoutCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'logoutService', 'Flash','apiService',
function ($rootScope, $scope, $state, $location, $localStorage, logoutService,  Flash, apiService ) {
        var vm = this;
        if (window.localStorage.getItem("userType") !='' ) {
            $state.go('app.dashboard');
         }

    }]);
