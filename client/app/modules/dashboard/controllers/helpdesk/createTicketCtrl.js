var createTicketCtrl = angular.module('createTicketCtrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);

dashboard.controller("createTicketCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'dashboardService', 'Flash','createTicketService','categoryService',
function ($rootScope, $scope, $state, $location, $localStorage, dashboardService, Flash,createTicketService,categoryservice) {

   // if ( $localStorage.User == undefined) {
   //    $state.go('login')
   //  }
   //  if ($localStorage.userType !='User' ) {
   //    $state.go('app.dashboard');
   //  }

    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='User' ) {
      $state.go('app.dashboard');
    }

    var vm = this;
    vm.message = {};
    vm.categories = {};
    vm.subcategories = {};
    vm.priorities = {};
    vm.categoryhead;
  //  vm.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
    vm.userflname = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);
//    vm.useremail = $localStorage.User.emailid;
    vm.useremail = JSON.parse(window.localStorage.getItem("User")).emailid;
    vm.attachfiles;
    vm.filedata;
    vm.acceptTypes = ".jpg,.jpeg,.doc,.docx,.mp3";
    categoryservice.getCategories().then(function(response){
      vm.categories = response;
    });

    createTicketService.getPriorities().then(function(response){
      vm.priorities = response;
    });
    $scope.init= function () {
      vm.watchEvents();
    };

    vm.clearall = function(){
      vm.type = undefined;
      vm.category= undefined;
      vm.subcategory = undefined;
      vm.priority = undefined;
      vm.attachfiles = undefined;
    };
    $scope.$watch('vm.category', function(newvalue,oldvalue) {
      var selcate;
      if( oldvalue != newvalue & newvalue != undefined ){
          for(var i = 0; i < vm.categories.length; i++)
          {
            if(vm.categories[i].name == newvalue)
            {
              selcate = vm.categories[i].name;
              vm.subcategories=vm.categories[i].subcategory;
              vm.categoryhead = vm.categories[i].categoryhead;

            }
          }
      }
    });

    vm.watchEvents = function() {
                /*
              Method which watches for the events emitted etc.
              */
               $scope.$on("fileSelected", function(event, args) {
                    $scope.$apply(function() {
                        if (args.file) {
                            var reader = new FileReader();
                            reader.onload = function(data) {
                              vm.attachfiles = args.file;
//                              vm.filedata = data;
                            }
                            reader.readAsDataURL(args.file);
                        }
                        else{
                          vm.attachfiles = undefined;
                        }
                    });
                });
            };


    vm.submitForm = function () {
    	if(vm.category== undefined || vm.type== undefined || vm.subcategory == undefined || vm.priority == undefined )
			Flash.create('danger', 'Provide all Values', 'large-text');
		else{
	        createTicketService.createTicket(vm).then(function (response) {
            if (response.statuscode == 200) {
	                    // Raise Success Message
	                      Flash.create('success', 'Ticket has been Submitted successfully', 'large-text');
	                      vm.message={};
	                      vm.type=undefined;
	                      vm.category = "";
	                      vm.priority ="";
	                      vm.subcategory="";
                        $("#fileUpload").val('');
                        vm.attachfiles= undefined;
	               }
	         else {

                   // Raise Error Message
	                      Flash.create('danger', 'Unable to create', 'large-text');
	                  }
	              });
	   	}

      };

    vm.sendMailTOHead = function(ticketinfo){
      console.log("coming here...... caling.")
      createTicketService.sendmail(ticketinfo).then(function(response){
      });
    };



    $scope.init();

}])  .config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
