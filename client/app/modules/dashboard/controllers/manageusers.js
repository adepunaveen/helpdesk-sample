var manageusers = angular.module('manageusers', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);

dashboard.controller("ManageUsersController", ['$rootScope', '$scope', '$state', '$location', 'manageUsersService', 'Flash', '$http','$mdDialog','$localStorage','manageuserrolesService',
function ($rootScope, $scope, $state, $location, manageUsersService, Flash, $http,$mdDialog,$localStorage,manageuserrolesService) {

    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='Admin' ) {
      $state.go('app.dashboard');
    }

    var vm = this;

    vm.message = {};
    vm.getuser = {};
    $scope.roles = ['Admin','User'];
    $scope.userhdroles = ["User","BUGroupIndividual","BUGroupHead"];
    $scope.designations = ['Sofware Engineer Trainee','Software Engineer','Senior Software Engineer','Team Lead','Manager'];
    $scope.states = ['Yes','No'];
    if($rootScope.currentUser != undefined){
    $scope.user = $rootScope.currentUser;
    $scope.user.firstName = $rootScope.currentUser.firstname;
    $scope.user.lastName = $rootScope.currentUser.lastname;
    $scope.user.role = $rootScope.currentUser.designation;
    $scope.user.userType = $rootScope.currentUser.usertype;
    $scope.user.hdroles = $rootScope.currentUser.hdroles;
    //--> Siva Changes start
    $scope.user.userflname = $scope.user.firstName.concat(' ').concat($scope.user.lastName);
    //<-- End
    }
    // if ($localStorage.userType !='Admin' ) {
    //           $state.go('app.dashboard');
    //   } 

    $scope.reset = function(form){
        $scope.user = {};
    }

    $scope.submitForm = function(data) {
     if($rootScope.currentUser == undefined){
       manageUsersService.addUser(data).then(function (response) {
        console.log("after adding user data...",data);
                if (response.statusCode == 200) {
                    // Raise Success Message  
                    $mdDialog.cancel();
                    Flash.create('success', 'User have been added successfully', 'large-text');
                    manageUsersService.getUsers().then(function(userresponse) {
                        var userdata = userresponse.data;
                        $scope.Usersdata = userdata;
                        $rootScope.Usersdata = userresponse.data;
                        createUserrole( response.data );
                        maillogindetails(response.data);
                    });
                    } else if(response.statusCode == 400) {
                    // Raise Error Message
                    Flash.create('danger', 'Emailid/Employeeid already exists', 'large-text');
                    $mdDialog.cancel();
                }
                else {
                    // Raise Error Message
                    Flash.create('danger', 'Adding User has been failed', 'large-text');
                    $mdDialog.cancel();
                }
            });

    }

else{
 manageUsersService.modifyUser(data,data).then(function (response) {
                if (response.statusCode == 200) {
                    // Raise Success Message
                    Flash.create('success', 'User data have been modified successfully', 'large-text');
                    $mdDialog.cancel();
                    console.log("after update response ",response )
                    manageUsersService.getUsers().then(function(userresponse) {
                    $rootScope.Usersdata = userresponse.data;
                    updateUserrole(response.data)
                     });
                }
                else {
                    // Raise Error Message
                    Flash.create('danger', 'Modifying User data have been failed', 'large-text');
                    $mdDialog.cancel();

                }
            });

    }


}

    function maillogindetails (userdata){
         manageUsersService.sendloginmail(userdata).then(function(response){
      });
    }

    function updateUserrole(userdata){
        manageuserrolesService.updateUserRole( userdata,userdata).then(function (response) {
            console.log("Received response from server:", response)
            if (response.statusCode == 200) {
            // Raise Success Message
                 console.log('HelpDesk UserRoles::Success:--->');
            } else {
            // Raise Error Message
            console.log('HelpDesk UserRoles::Error:--->');
            }
        });
    }


//--> Siva Changes Start: Added new Method
        function createUserrole( pData){
            console.log("Sending -->createUserrole ");
//            var userflname = pData.firstName.concat(' ').concat(pData.lastName);
            manageUsersService.createUserrole( pData).then(function (response) {
                console.log("Received response from server:", response)
                    if (response.statusCode == 400) {
                        // Raise Success Message
                        console.log('HelpDesk UserRoles::Success:--->');

                    } else {
                        // Raise Error Message
                        console.log('HelpDesk UserRoles::Error:--->');
                    }
            });
        };


    $scope.cancel = function() {
      $mdDialog.cancel();
    }



}]);
