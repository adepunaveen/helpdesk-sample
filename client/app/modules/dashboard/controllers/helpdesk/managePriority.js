var managepriorityCtrl = angular.module('managepriorityCtrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);

dashboard.controller("managepriorityCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage','dashboardService', 'Flash','categoryService','categoryService','$mdDialog',
function ($rootScope, $scope, $state, $location, $localStorage,dashboardService, Flash,categoryService,categoryService,$mdDialog) {


    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) =='Admin' ) {
      $state.go('app.dashboard');
    }

    var self = this;
    self.categories={};
    var category;
    var subcategories;
    var changedcategory;

//    var useremail = $localStorage.User.emailid;
    var useremail = JSON.parse(window.localStorage.getItem("User")).emailid;
      

    // if ( $localStorage.User == undefined) {
    //   $state.go('login')
    // }
    // if ($localStorage.userType =='Admin' ) {
    //   $state.go('app.dashboard');
    // }


    /*if ($localStorage.userType !='Admin' ) {
      $state.go('app.dashboard');
    }*/
    categoryService.getOwnedCategories(useremail).then(function(resp){
      self.categories = resp;
    });

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
      }

    });


    $scope.$watch('vm.category', function(newvalue,oldvalue) {
      for(var i = 0; i < self.categories.length; i++)
          {
            if(self.categories[i].name == newvalue)
            {
              self.priority = self.categories[i].priority;
              self.subcategories = self.categories[i].subcategories;
       //       console.log(vm.categories[i])

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

  self.updateCategory = function(){
    console.log("udating")
    console.log(self.categories)
    for(var i = 0; i < self.categories.length; i++)
          {
            if(self.categories[i].name == self.category)
            {
             self.changedcategory = self.categories[i];
              console.log(self.categories[i].subcategories)
            }
    }
    categoryService.updatePriority(self,self).then(function (response) {
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
   else {
           // Raise Error Message
                Flash.create('danger', 'Unable to create', 'large-text');
       }
        });


  };




  self.gotoSubcategory = function(name,event){
    console.log("clickin..");
//    console.log(name);
  //  console.log(event);
  };
}]);
