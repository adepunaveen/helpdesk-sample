﻿
login.controller("loginCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'loginService', 'Flash', 'apiService','$mdDialog',
    function($rootScope, $scope, $state, $location, $localStorage, loginService, Flash, apiService,$mdDialog) {
        //access login
         // if ($localStorage.userType !=undefined ) {
         //    $state.go('app.dashboard');
         // }
        var vm = this;
        vm.getUser = [];
        if (window.localStorage.getItem("User") != null ) {
            $state.go('app.dashboard');
         }

        if (window.localStorage.getItem("usename") != undefined) {
            vm.getUser.Username = JSON.parse(window.localStorage.getItem("usename"));
           // vm.getUser.Password = JSON.parse(window.localStorage.getItem("password"));
            vm.getUser.userType = JSON.parse(window.localStorage.getItem("userType"));
        };

        vm.setUser = {};
        vm.signIn = true;
        vm.forgotPassword = false;
        vm.firstLogin = false;

        // if ($localStorage.usename != undefined) {
        //     vm.getUser.Username = $localStorage.usename;
        //     vm.getUser.Password = $localStorage.password;
        //     vm.getUser.userType = $localStorage.userType;
        // };


        vm.login = function (data) {
            if (vm.getUser.userType == undefined) {
                Flash.create('danger',"Please select Login As!",'large-text');
                return
            }
            
             var email = vm.getUser.Username.split('@');
            if (email.length == 1) {
                vm.getUser.Username = vm.getUser.Username + "@magikminds.com";
            };
            loginService.accessLogin(vm.getUser).then(function (response) {
                console.log("after login...", response);
                 if (response.status == 200) {
                    if (response.data.active != 'Yes') {
                        Flash.create('danger', 'Your Account is in In-Active State', 'large-text');
                        return
                    }


                    vm.user = response.data;
                    var userRole = vm.getUser.userType;
                    if (vm.user.lastlogin == undefined) {

                        vm.signIn = false;
                        vm.firstLogin = true;
                        vm.forgotPassword=false;
                    } else {

                        if (userRole == '' || userRole == undefined) {
                            userRole = 'User';
                        };

                        if ((vm.user.usertype != 'Admin' && userRole != vm.user.usertype) ||
                            (vm.user.usertype == 'Admin' && userRole == 'Super Admin'))
                        {
                            // Raise Error Message
                            var msg = 'You are not authenticated to login as ' + userRole;
                            Flash.create('danger', msg, 'large-text');
                        } else {
                            // Go to Dashboard
                            createUserrole();
                            //$state.go('app.dashboard');
                            updateLoginTime();
                        };

                        // If Remember Me Checkbox is checked, store Username and Password
                        var remember = document.getElementById('login-remember').checked;

                        if (remember) {
                            // $localStorage.usename = vm.getUser.Username;
                            // $localStorage.password = vm.getUser.Password;
                            // $localStorage.userType = vm.getUser.userType;
                            
                            window.localStorage.setItem("usename",JSON.stringify(vm.getUser.Username));
                           // window.localStorage.setItem("password", JSON.stringify(vm.getUser.Password));
                            window.localStorage.setItem("userType",JSON.stringify(vm.getUser.userType));
                        }
                        //--> Siva Changes Strat

                        else{
                         //   console.log(vm.getUser.userType, $localStorage.userType );
//                            $localStorage.userType = vm.getUser.userType;
                            window.localStorage.setItem("userType", JSON.stringify(vm.getUser.userType));

                         };
                        //console.log( $localStorage.userType );
                        //<-- End
                    }
                } else {
                    // Raise Error Message
                    Flash.create('danger', 'Invalid Username or Password', 'large-text');
                }
            });
        };

        // Send Email for Forgot Password
        vm.sendPassword = function () {
            vm.showsendpasswordbtn = true;
            loginService.sendPassword(vm.setUser).then(function (response) {
                console.log("sending password response ",response)
                if (response.status == 200) {
                    // Raise Success Message
                    Flash.create('success', 'Password is sent to the mentioned Email Address Successfully', 'large-text');
                    vm.signIn=true;vm.forgotPassword=false;
                } else {
                    // Raise Error Message
                    Flash.create('danger', 'User with mentioned Email Address does not exist', 'large-text');
                   vm.showsendpasswordbtn = false;
                }

            });
        };

 $('#changepassword').on('click', function(e) {
            if (vm.setUser.Password == vm.setUser.confirmPassword) {
                loginService.updateUser( vm.user, { emailid: vm.user.emailid, setclause: {password : vm.setUser.Password} } ).then(function (response) {
                    if (response) {
                        // Raise Success Message
                        Flash.create('success', 'Password is changed Successfully. Please SignIn now.', 'large-text');

                        vm.signIn = true;
                        updateLoginTime();
                    } else {
                        // Raise Error Message
                        Flash.create('danger', 'User with mentioned Email Address does not exist', 'large-text');
                    }
                });
            } else {
                // Passowrds does not match
                Flash.create('danger', 'Passwords does not match', 'large-text');
            }
 });


        // Change Password
        $scope.changePassword = function () {
            console.log("chaning passs first time")
          //--> Siva Changes: Modifed the calling parameter in below service calling. Added setclause notation.
            if (vm.setUser.Password == vm.setUser.confirmPassword) {
                loginService.updateUser( vm.user, { emailid: vm.user.emailid, setclause: {password : vm.setUser.Password} } ).then(function (response) {
                    if (response) {
                        // Raise Success Message
                        Flash.create('success', 'Password is changed Successfully. Please SignIn now.', 'large-text');

                        vm.signIn = true;
                        updateLoginTime();
                    } else {
                        // Raise Error Message
                        Flash.create('danger', 'User with mentioned Email Address does not exist', 'large-text');
                    }
                });
            } else {
                // Passowrds does not match
                Flash.create('danger', 'Passwords does not match', 'large-text');
            }
        };




        $scope.changeCurrentPassword = function(data) {
            console.log("here only....")
//            if ($scope.pwd.currentPassword != $localStorage.User.password) {
         //   if ($scope.pwd.currentPassword != window.localStorage.getItem("User").password) {
            //   if ($scope.pwd.currentPassword != vm.getUser.Password) {  
            //     Flash.create('danger', 'Password change failed - Current Password does not match!', 'large-text');
            // } else
             if ($scope.pwd.newPassword == $scope.pwd.currentPassword) {
                Flash.create('danger', 'Password change failed - Current Password and New Password should not be same!', 'large-text');
            } else {
//                vm.user = $localStorage.User;
  //                vm.user = window.localStorage.getItem("User");
                var changeuser = {};
                changeuser.emailid = JSON.parse(window.localStorage.getItem("User")).emailid;
                changeuser.newPassword = $scope.pwd.newPassword;
                vm.user = vm.getUser;
                vm.user.password = $scope.pwd.newPassword;            
                loginService.updateUserPassword(changeuser, changeuser).then(function (response) {
                    console.log(response)
                    if (response) {
                        $mdDialog.cancel();
                        // Raise Success Message
//                        $localStorage.password = $scope.pwd.newPassword;
                        window.localStorage.setItem("password", JSON.stringify($scope.pwd.newPassword));
                        Flash.create('success', 'Password changed Successfully!', 'large-text');
                    };
                }); 
            };
        };


        function updateLoginTime(){
            //-->Siva Changes Start: Modified
            // loginService.updateUser(vm.user, {lastlogin : Date()} );
            loginService.updateUser(vm.user, { emailid: vm.user.emailid, setclause: {lastlogin : Date()} });
            //<-- End
            $rootScope.User = vm.user;
//            $localStorage.User = vm.user;
            window.localStorage.setItem("User",JSON.stringify(vm.user));


        };
      $scope.cancel = function() {
            $mdDialog.cancel();
        };
        //--> Siva Changes Start: Added new Method
        function createUserrole(){
            vm.userflname = vm.user.firstname.concat(' ').concat(vm.user.lastname);
            loginService.createUserrole( { username: vm.userflname, emailid: vm.user.emailid }).then(function (response) {
                    if (response.statusCode == 400) {
                        // Raise Success Message
                        $rootScope.hduserrole = response.data;
                        // $localStorage.hduserrole = response.data;
                        window.localStorage.setItem("hduserrole", JSON.stringify(response.data));
                          $state.go('app.dashboard');
                    } else {
                        // Raise Error Message
                        console.log('HelpDesk UserRoles::Error:--->');
                    }
            });
        };

    }]);
