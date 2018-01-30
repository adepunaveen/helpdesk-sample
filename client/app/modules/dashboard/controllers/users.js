dashboard.controller("UserController", ['$rootScope', '$scope', '$state', '$location', 'manageUsersService', 'Flash', '$http', '$mdDialog','$localStorage',
    function($rootScope, $scope, $state, $location, manageUsersService, Flash, $http, $mdDialog,$localStorage) {
        var vm = this;
//        console.log("coming to user controller ",$localStorage.User.userType)

         // if ($localStorage.userType != 'Admin') {
         //    $state.go('app.dashboard');
         // }   


    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }
    if (JSON.parse(window.localStorage.getItem("userType")) !='Admin' ) {
      $state.go('app.dashboard');
    }


        vm.message = {};
        $scope.selected = [];
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        
        vm.Adduser = function() {
            $rootScope.currentUser = undefined;
            $mdDialog.show({
                controller: "ManageUsersController",
                templateUrl: 'app/modules/dashboard/views/manageusers.html',
                parent: angular.element(document.body),
                windowClass: 'large-Modal',
                clickOutsideToClose: false,
                disableParentScroll: false
            });
        }

        vm.Modifyuser = function(user) {

            $rootScope.currentUser = user;
         //   $scope.user = user;
            //$scope.Usersdata = user;
//            $rootScope.Usersdata  = user;

            $mdDialog.show({
                controller: "ManageUsersController",
                templateUrl: 'app/modules/dashboard/views/manageusers.html',
                parent: angular.element(document.body),
                windowClass: 'large-Modal',
               clickOutsideToClose: false,
                disableParentScroll: false
            })
        }

        manageUsersService.getUsers().then(function(response) {
            var userdata = response.data;
//            $scope.Usersdata = userdata;
 //           $scope.Usersdata1= userdata;
            $rootScope.Usersdata = response.data;
        });

        vm.Deleteuser = function(parameter) {
            var usertodelete;
            var confirm = $mdDialog.confirm({
                    disableParentScroll: false
                })
                .title('Delete User!')
                .textContent('Are you sure you want to delete the user?')
                .ariaLabel('Lucky day')
                .ok('Yes')
                .cancel('No');
                console.log("deleting. user...");
            $mdDialog.show(confirm).then(function() {
              for (var i = 0; i < $rootScope.Usersdata.length; i++) {
                  if ($rootScope.Usersdata[i].emailid == parameter) {
                    usertodelete = $rootScope.Usersdata[i];
                  }
              }
                console.log("usertodelete---> ",usertodelete );
                manageUsersService.deleteUser(usertodelete).then(function(response) {
                    console.log("delete user reponse  ",response);
                    if (response == 200) {
                        // Raise Success Message
                        Flash.create('success', 'User have been deleted successfully', 'large-text');
                        manageUsersService.getUsers().then(function(response) {
                            var userdata = response.data;
                            $rootScope.Usersdata = response.data;
                          //  $scope.Usersdata = userdata;
                           // $scope.Usersdata1= userdata;
                        });

                    } else if(response == 203) {
                        Flash.create('danger', 'Cannot Delete User as Tickets are pending with user', 'large-text');
                    }else if(response == 202) {
                        Flash.create('danger', 'Cannot Delete User as User in Categories', 'large-text');
                    }
                    else {
                        // Raise Error Message
                        Flash.create('danger', 'User is unable to delete', 'large-text');
                    }
                });
            })
        }
    }


]);
