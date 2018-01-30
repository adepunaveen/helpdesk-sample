app.controller("appCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'loginService', '$mdDialog', 'Flash', 'appSettings',
    function($rootScope, $scope, $state, $location, $localStorage, loginService, $mdDialog, Flash, appSettings) {
       // console.log("we are in app control...........---->>>><<<<<-------.................",$localStorage.userType );
       // if ($localStorage.userType == undefined ) {
       //      $state.go('login');
       //      return
       //   }
       console.log("window.localStorage.getItem(User) ",window.localStorage.getItem("User"));
       if (window.localStorage.getItem("User") == null ) {
            $state.go('login');
            return
         }
        if ($state.current.name == "app") {
            $state.go('app.dashboard')
        }


        $rootScope.theme = appSettings.theme;
        $rootScope.layout = appSettings.layout;

        var vm = this;
        //--> Siva Changes Start
//        if ($localStorage.User != undefined) {
        if (JSON.parse(window.localStorage.getItem("User")) != undefined) {


            // $scope.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
//             var name = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
                //console.log("showing here ....", JSON.parse(window.localStorage.getItem("User")))
               var name = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);
            $scope.userflname = name.toUpperCase().charAt(0) + name.substring(1);
            
            // $scope.usertype = $localStorage.userType;
            // $scope.userdesignation = $localStorage.User.designation;
            // $scope.userempid = $localStorage.User.employeeid;
            // $scope.hduserhome = "";
            // $scope.profilefilename = $localStorage.User.profilefilename 
  
            $scope.usertype = JSON.parse(window.localStorage.getItem("userType"));
            $scope.userdesignation = JSON.parse(window.localStorage.getItem("User")).designation;
            $scope.userempid = JSON.parse(window.localStorage.getItem("User")).employeeid;
            $scope.hduserhome = "";
            $scope.profilefilename = JSON.parse(window.localStorage.getItem("User")).profilefilename 
  


        }
        vm.mmconnectmenuItems = [];
        vm.menuItems = [];
        $scope.imageFileFormats = ".jpg,.jpeg";

        $scope.triggerUpload = function(ev) {
            var btn = "button";
            var fileuploader = angular.element("#fileInput");

            fileuploader.on('click', function() {
                console.log("File upload triggered programatically");
            });

            fileuploader.trigger('click');

            // var confirm = $mdDialog.confirm()
            //                 .title('Update Profile Picture')
            //                 .textContent('Do You Want to ')
            //                     // .html (true)
            //                 .ariaLabel('Lucky day')
            //                 .targetEvent(ev)
            //                 .ok('Upload/Modify')
            //                 .cancel('Remove');

            //  res = $mdDialog.show(confirm).then( function() {
            //         alert("Upload clicked");

            //         var fileuploader = angular.element("#fileInput");
            //         console.log("fileuploader", fileuploader)
            //         fileuploader.on('click',function(){
            //             console.log("File upload triggered programatically");
            //         });

            //         fileuploader.trigger('click');
            //         console.log("doneeee");
            //  }

            //  , function() {
            //      alert("Remove clicked");
            //      }
            //  );


        };
        $(document).on('click', "#modifyButton", function() {

            if ($scope.inswal) {
                var fileuploader = angular.element("#fileInput");

                fileuploader.on('click', function() {
                    console.log("File upload triggered programatically");
                });

                fileuploader.trigger('click');
                $scope.inswal = false;
            }

        });

        $(document).on('click', "#logoutbtn", function() {
                $mdDialog.cancel();
                // $localStorage.User = undefined;
                // $localStorage.userType = undefined;
                // $localStorage.hduserrole = '';

                // window.localStorage.setItem("User",undefined);
                // window.localStorage.setItem("userType", undefined);
                // window.localStorage.setItem("hduserrole" , '');
                
                window.localStorage.removeItem("User");
                window.localStorage.removeItem("userType");
                window.localStorage.removeItem("hduserrole");


        });


        $(document).on('click', "#removeButton", function() {

            if ($scope.inswal) {
                var data = JSON.stringify({
                    email: email
                });

                if ($scope.profilePicture != "images/default.jpg") {
                    $http.post('http://localhost:3000/removeFromFolder', data)
                        .success(function(data) {
                            swal("Updated!", "Your Profile Picture is Removed.", "success");
                            $scope.profilePicture = "images/default.jpg";
                        });

                }
                $scope.inswal = false;
            }
        });

        window.uploadImage = function(selectedFile) {
            console.log('In upload image ---->', selectedFile);
            var file = selectedFile.files[0];
            var size = parseFloat((file.size / (1024)).toFixed(4));

            if ($scope.imageFileFormats.indexOf(file.name.toLowerCase().split(".")[1]) == -1) {
                var msg = "Please select only JPG or JPEG images only";
                /*alert(msg);*/
                Flash.create('danger',"Please select only JPG or JPEG images only",'large-text');
                return false
            };

            if (size > 1500) {
                var msg = "Please select only JPG or JPEG images with size < 1500 KB";
               /* alert(msg);*/
                Flash.create('danger',"Please select only JPG or JPEG images only with size < 1500 KB",'large-text');
                return false
            };

            var fr = new FileReader();

            fr.onload = function(event) {
                var fileData = this.result.split(",")[1];
                var data = JSON.stringify({
                    name: file.name,
                    type: file.type,
                    content: fileData,
                    empid: $scope.userempid,
                //    userinfo : $localStorage.User
                userinfo : JSON.parse(window.localStorage.getItem("User"))
                });

                loginService.uploadEmpPic(data).then(function(response) {
                    console.log(" response ", response)
                    if (response.statusCode == 200) {
                       
                       // $localStorage.User.profilefilename = response.filename;
                       JSON.parse(window.localStorage.getItem("User")).profilefilename = response.filename;
                       var updatedUserProfile = JSON.parse(window.localStorage.getItem("User"));
                       updatedUserProfile.profilefilename = response.filename;
                        window.localStorage.setItem("User",JSON.stringify(updatedUserProfile));
//                        $('#profilePic').attr("src", "../../images/empidpics/"+$localStorage.User.profilefilename);
                        $('#profilePic').attr("src", "../../images/empidpics/"+JSON.parse(window.localStorage.getItem("User")).profilefilename);
                        console.log('HelpDesk UserPic::Success:--->');
                    } else {
                        console.log('HelpDesk UserPic::Error:--->');
                    }
                });


                // $http.post('http://localhost:3000/uploadToFolder', data)
                //   .success(function(data) {
                //     swal("Updated!", "Your Profile Picture is Updated.", "success");
                //     $scope.profilePicture = "images/ProfilePictures/" + email.split("@")[0].replace(".","_") + ".jpg";
                //   });
            };

            fr.readAsDataURL(file);
        };

        // <-- End
        //avalilable themes
        /* vm.themes = [
        {
            theme: "black",
            color: "skin-black",
            title: "Dark - Black Skin",
            icon:""
        },
        {
            theme: "black",
            color: "skin-black-light",
            title: "Light - Black Skin",
            icon:"-o"
        },
        {
            theme: "blue",
            color: "skin-blue",
            title: "Dark - Blue Skin",
            icon:""
        },
        {
            theme: "blue",
            color: "skin-blue-light",
            title: "Light - Blue Skin",
            icon:"-o"
        },
        {
            theme: "green",
            color: "skin-green",
            title: "Dark - Green Skin",
            icon:""
        },
        {
            theme: "green",
            color: "skin-green-light",
            title: "Light - Green Skin",
            icon:"-o"
        },
        {
            theme: "yellow",
            color: "skin-yellow",
            title: "Dark - Yellow Skin",
            icon:""
        },
        {
            theme: "yellow",
            color: "skin-yellow-light",
            title: "Light - Yellow Skin",
            icon:"-o"
        },
        {
            theme: "red",
            color: "skin-red",
            title: "Dark - Red Skin",
            icon: ""
        },
        {
            theme: "red",
            color: "skin-red-light",
            title: "Light - Red Skin",
            icon: "-o"
        },
        {
            theme: "purple",
            color: "skin-purple",
            title: "Dark - Purple Skin",
            icon: ""
        },
        {
            theme: "purple",
            color: "skin-purple-light",
            title: "Light - Purple Skin",
            icon: "-o"
        },
    ];

    //available layouts
    vm.layouts = [
        {
            name: "Boxed",
            layout: "layout-boxed"
        },
        {
            name: "Fixed",
            layout: "fixed"
        },
        {
            name: "Sidebar Collapse",
            layout: "sidebar-collapse"
        },
    ];
*/
        // if ( $localStorage.userType=='' ||   $localStorage.hduserrole =='') {
        //     $state.go('login');
        // }
        if ( JSON.parse(window.localStorage.getItem("userType"))=='' ||  JSON.parse( window.localStorage.getItem("hduserrole")) =='') {
            $state.go('login');
        }



        // if ($localStorage.userType == 'Admin') {
        //     $scope.hduserhome = "";
        //     vm.mmconnectmenuItems = [{
        //         title: "Manage Users",
        //         icon: "fa fa-user",
        //         state: "users"
        //     }];

        if (JSON.parse(window.localStorage.getItem("userType")) == 'Admin') {
            $scope.hduserhome = "";
            vm.mmconnectmenuItems = [{
                title: "Manage Users",
                icon: "fa fa-user",
                state: "users"
            }];



//            if ($localStorage.hduserrole.role.includes("Admin")) { // Admin to MM Connect
            if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("Admin") != -1   ) { // Admin to MM Connect
                vm.menuItems = [
                {
                        title: "Manage Users",
                        icon: "fa fa-user",
                        state: "users"
                    },{
                        title: "Manage Category",
                        icon: "fa fa-list",
                        state: "managecategory"
                    }, {
                        title: "Configure Notification",
                        icon: "fa fa-tags",
                        state: "managenotifications"
                    }
                    // , {
                    //     title: "Manage User Roles",
                    //     icon: "fa fa-users ",
                    //     state: "manageuserroles"
                    // }

                ]; // Admin to MM Connect and also Admin to MMHelpdesk

            } else {
                vm.menuItems = [];
            } // Though Admin to MM Connect but User to MMHelpdesk
        } else { // User to MM Connect
            $scope.hduserhome = "hduserhome";
            console.log('In User');
            vm.menuItems = [

                {
                    title: "Create Ticket",
                    icon: "fa fa-ticket",
                    state: "createticket"
                }, {
                    title: "My Tickets",
                    icon: "fa fa-list",
                    state: "mytickets"
                }

            ];
//            if ($localStorage.hduserrole.role.includes("BUGroupIndividual")) { // MMHelpdesk UserRole is BUGroupIndividual

            if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupIndividual") != -1) { // MMHelpdesk UserRole is BUGroupIndividual
                console.log('In BUGroupIndividual', vm.menuItems);
                vm.menuItems.push({
                    title: "Assigned Tickets",
                    icon: "fa fa-sign-in",
                    state: "assigntickets"
                });
            };

//            if ($localStorage.hduserrole.role.includes("BUGroupHead")) { // MMHelpdesk UserRole is BUGroupHead
            if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupHead") != -1) { // MMHelpdesk UserRole is BUGroupHead

                console.log('In BUGroupHead', vm.menuItems);
                vm.menuItems.push({
                    title: "Assign Tickets",
                    icon: "fa fa-sign-in",
                    state: "managegrouptickets"
                },{
                        title: "Manage Priority",
                        icon: "fa fa-tags",
                        state: "managepriority"
                    });
            };


        };






        //     //Main menu items of the dashboard
        //     vm.menuItems = [
        //         {
        //             title: "Dashboard",
        //             icon: "dashboard",
        //             state: "dashboard"
        //         },
        //         /*{
        //             title: "Users",
        //             icon: "fa fa-users",
        //             state: "users"
        //         },
        //         {
        //             title: "Skills",
        //             icon: "gears",
        //             state: "skills"
        //         },
        //         {
        //             title: "Education",
        //             icon: "graduation-cap",
        //             state: "education"
        //         },
        //         {
        //             title: "Experience",
        //             icon: "suitcase",
        //             state: "experience"
        //         },

        //         {
        //             title: "About Me",
        //             icon: "user-secret",
        //             state: "about"
        //         },
        //         {
        //             title: "Contact",
        //             icon: "phone",
        //             state: "contact"
        //         },
        // */
        //         {
        //             title:"Home",
        //             icon: "home",
        //             state:"hduserhome"
        //         },

        //         {
        //             title:"Traceticket",
        //             icon: "trace",
        //             state:"hdtickettrace"
        //         },

        //         {
        //             title: "Create Ticket",
        //             icon: "ticket",
        //             state: "createticket"
        //         },
        //         {
        //             title: "Manage Category",
        //             icon: "category",
        //             state: "managecategory"
        //         },

        //         {
        //             title: "Assigned Tickets",
        //             icon: "inbox",
        //             state: "assigntickets"
        //         },
        //         {
        //             title: "Manage Users",
        //             icon: "fa fa-users",
        //             state: "users"
        //         },

        //         {
        //             title: "Manage Priority",
        //             state: "managepriority"
        //         },
        //         {
        //             title: "My Tickets",
        //             icon: "inbox",
        //             state: "mytickets"

        //         }


        //     ];

        //set the theme selected
        vm.setTheme = function(value) {
            $rootScope.theme = value;
        };


        //set the Layout in normal view
        vm.setLayout = function(value) {
            $rootScope.layout = value;
        };


        //controll sidebar open & close in mobile and normal view
        vm.sideBar = function(value) {

            if ($(window).width() <= 767) {
                if ($("body").hasClass('sidebar-open'))
                    $("body").removeClass('sidebar-open');
                else
                    $("body").addClass('sidebar-open');
            } else {

                if (value == 1) {
                    if ($("body").hasClass('sidebar-collapse'))
                        $("body").removeClass('sidebar-collapse');
                    else
                        $("body").addClass('sidebar-collapse');
                }
            }
        };


    $(document).on('click', "#changePassword", function() {
            $mdDialog.show({
                controller: "loginCtrl",
                templateUrl: 'app/modules/login/changePassword.html',
                parent: angular.element(document.body),
                windowClass: 'large-Modal',
                clickOutsideToClose: true,
                disableParentScroll: false,
                documentisableParentScroll: false                
            });
    });

    vm.chngpassword = function( ) {
        $mdDialog.show({
                controller: "loginCtrl",
                templateUrl: 'app/modules/login/changePassword.html',
                parent: angular.element(document.body),
                windowClass: 'large-Modal',
                clickOutsideToClose: true,
                disableParentScroll: false,
                documentisableParentScroll: false                
            });
    };


        //navigate to search page
        vm.search = function() {
            alert("i am here");
            $state.go('app.search');
        };


    }
]);
