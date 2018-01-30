var managenotificationCtrl = angular.module('managenotificationCtrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);

dashboard.controller("managenotificationCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage','dashboardService', 'Flash','categoryService','categoryService','$mdDialog',
function ($rootScope, $scope, $state, $location, $localStorage,dashboardService, Flash,categoryService,categoryService,$mdDialog) {
	var self = this;
  	//var useremail = $localStorage.User.emailid;

  	// if ($localStorage.userType !='Admin' ) {
   //    $state.go('app.dashboard');
   //  }
    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='Admin' ) {
      $state.go('app.dashboard');
    }


    var useremail = JSON.parse(window.localStorage.getItem("User")).emailid;

	categoryService.getschduledays().then(function(resp){
      for (var i = 0; i < resp.length; i++) {
        if (resp[i].name == "highpriorityopendays" ) {
          self.opendaysforhigh= resp[i].days;
        }
        else if (resp[i].name == "mediumpriorityopendays") {
          self.opendaysformedium = resp[i].days;
        }
        else if (resp[i].name == "lowpriorityopendays") {
          self.opendaysforlow = resp[i].days;
        }
        else if (resp[i].name == "highclosedays") {
          self.daysforhigh = resp[i].days;
        }
        else if (resp[i].name == "mediumclosedays") {
          self.daysformedium = resp[i].days;
        }
        else if (resp[i].name == "lowclosedays") {
          self.daysforlow = resp[i].days;
        }
        else if (resp[i].name == "querynotificationdays") {
          self.querynotificationdays = resp[i].days;
        }
        else if (resp[i].name == "autoclosedays") {
          self.autoclosedays = resp[i].days;
        }
      }

    });
	self.updatescheduletime = function(){
    	categoryService.updatescheduletime(self,self).then(function (response) {
	        console.log("response",response);
	    	if (response == 200) {
	              // Raise Success Message
	                Flash.create('success', 'Prirority has been updated successfully', 'large-text');
	                message={};
	         }
	    	else if(response==202){
	      			// Raise Failure message
	                Flash.create('danger', 'Prirority Cannot be updated', 'large-text');
	                message={};

			}
		 });
  		Flash.create('success', 'Prirority has been updated successfully', 'large-text');
	};
}]);