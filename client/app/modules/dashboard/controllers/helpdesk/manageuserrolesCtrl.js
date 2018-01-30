dashboard.controller("manageuserrolesCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage','manageuserrolesService',  'Flash','$mdDialog',
function ($rootScope, $scope, $state, $location, $localStorage, manageuserrolesService,  Flash, $mdDialog) {



    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='Admin' ) {
      $state.go('app.dashboard');
    }

    var vm = this;
    self = this;

    vm.role = {};
//    vm.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
    vm.userflname = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);
//    vm.emailid = $localStorage.User.emailid;
    vm.emailid = JSON.parse(window.localStorage.getItem("User")).emailid;

    $scope.hdusers = {};
    $scope.roles = {};

    self.hduserrole = {};


    $scope.roleOptions = {
    User: true,
    Admin: false,
    BUGroupHead: false,
    BUGroupIndividual: false
  };

  //  if ($localStorage.userType !='Admin' ) {
  //   $state.go('app.dashboard');
  // } 
  $scope.selRoles = [];
  //------------------------------------------
  $scope.$watchCollection('roleOptions', function () {
    $scope.selRoles = [];

    angular.forEach($scope.roleOptions, function (value, key) {
      if (value) {
        $scope.selRoles.push(key);
      }
    });

    console.log("selRoles", $scope.selRoles);
  });

   //------------------------------------------
    console.log("vm.emailid", vm.emailid)
    manageuserrolesService.gethdusers( vm.emailid ).then(function (response) {
      console.log("gethdusers:<-- Recieved the response ", response)
      $scope.hdusers = response;
    })

   //------------------------------------------
   $scope.$watch('vm.user', function(newvalue,oldvalue) {
     if(newvalue){

         self.hduserrole = JSON.parse(newvalue);
        console.log(self.hduserrole)
        if(self.hduserrole.role.length > 0){
          $scope.roleOptions = {
                                  User: true,
                                  Admin: false,
                                  BUGroupHead: false,
                                  BUGroupIndividual: false
                                };

         for(i=0 ; i< self.hduserrole.role.length; i++ )
          {

            var urole = self.hduserrole.role[i];
            console.log("user role", urole, $scope.roleOptions[urole]);
            $scope.roleOptions[urole] = true;

          }// for loop
          console.log($scope.roleOptions);
          }
        }
    });


  var WarMessage = function(wm) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Warning')
        .textContent(wm)
        //.ariaLabel('Alert Dialog Demo')
        .ok('OK')
     /*   .targetEvent(ev)*/
    );
  };


   //------------------------------------------
    self.updateUserRole = function () {

      var uemailid = self.hduserrole.useremailid;
      var oldroles = self.hduserrole.role;
      var newroles = $scope.selRoles;
      var warningMessage = "";
      console.log("New roles", newroles , uemailid)

      if (uemailid == undefined) {
        //commented the alert
        /*alert("Please select User to grant roles.");*/
        warningMessage = "Please select User to grant roles.";
        WarMessage(warningMessage);
         return };
      //console.log("Does old roles and newroles are Equal--> ", JSON.stringify(oldroles)==JSON.stringify(newroles));

      // Validations Section
      if (JSON.stringify(oldroles)==JSON.stringify(newroles)) { console.log("roles values");
      warningMessage ="No Roles Modified. Please choose the roles and proceed";
      WarMessage(warningMessage);/*alert("No Roles Modified. Please choose the roles and proceed");*/
      return  }
      //console.log("Does BUGroupIndividual and Admin both Exists", newroles.includes("Admin", "BUGroupIndividual"));
      if (newroles.includes("Admin") && newroles.includes("BUGroupIndividual") && !newroles.includes("BUGroupHead")) {
      /*  alert(" BUGroupIndividual can not be an Admin");*/
       warningMessage = "BUGroupIndividual can not be an Admin";
       WarMessage(warningMessage);
        return   }
      if (newroles.includes("User") && newroles.includes("BUGroupHead")) {
               if (!newroles.includes("Admin")) {
                /*alert(" User can not be BUGroupHead")*/
                warningMessage = " User can not be BUGroupHead";
                WarMessage(warningMessage);

                return }
           }


      manageuserrolesService.updatehHDUserRole( self.hduserrole, { emailid: uemailid, setclause: {role : newroles } }).then(function (response) {
      console.log("updateUserRole:<-- Recieved the response ", response)
      if (response == 200) {
                // Raise Success Message
                Flash.create('success', 'Role has been Granted successfully', 'large-text');

                manageuserrolesService.gethdusers( vm.emailid ).then(function (response) {
                console.log("gethdusers:<-- Recieved the response ", response)
                $scope.hdusers = response;
                  })

                  }
        else {
               // Raise Error Message
               Flash.create('danger', 'Unable to grant roles', 'large-text');
             }

      })

    }


   self.showDetails = function(event){
   	
   };


}]);
