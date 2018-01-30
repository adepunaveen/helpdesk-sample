var categoryctrl = angular.module('categoryctrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);

dashboard.controller("categoryctrl", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash','categoryService','$mdDialog','$q','$timeout','$localStorage',
function ($rootScope, $scope, $state, $location, dashboardService, Flash,categoryService,$mdDialog,$q,$timeout,$localStorage) {

    self = this;
    var message={};
    self.catname ;
    self.subcategory=[];
    self.head={};
    self.categories = {};
    self.editmessage={};
    self.editsubcategory = {};
    self.selectedcathead ={};
    self.subcategorywithprirority= [];
    self.editsubcategorywithprirority= [];
    self.executives= [];
    self.editexecutive = {};
    self.editexecutives = [];
    var edithead;
    var editcategory;
    var actualcatname;
    //  if ( $localStorage.User == undefined) {
    //     $state.go('login')
    //   }

    // if ($localStorage.userType !='Admin' ) {
    //     $state.go('app.dashboard');
    //   }
    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='Admin' ) {
      $state.go('app.dashboard');
    }

    categoryService.getExcutives().then(function(resp){
      self.executives = resp;
    });

    categoryService.getusers().then(function(resp){
      self.head = resp;
    });

    categoryService.getCategories().then(function(resp){
      self.categories = resp;
    });

    $scope.$watch('vm.editcategory', function(newvalue,oldvalue) {
      if(newvalue){
        if(self.categories[newvalue]){
          self.selectedcathead=self.head;
          self.edithead=self.categories[newvalue].categoryhead;
          self.editsubcategory = self.categories[newvalue].subcategory;
          self.actualcatname = self.categories[newvalue].name;
          self.editexecutives = self.executives;
          self.editexecutive = self.categories[newvalue].executives;
          self.editautoassign = self.categories[newvalue].autoassign;
          self.editsubcategorywithprirority = self.categories[newvalue].subcategories;
          }
        }
    });
    self.clearall = function(){
      self.message.name = "";
      self.message.head = "";
      self.message.individual = [];
      self.subcategory = [];
      self.autoassign = false;
    };
    self.submitForm = function () {
      if (self.message.name.length > 20) {
        Flash.create("danger","Category Name Cannot exceed 20 characters",'large-text');
        return;
      }
          self.subcategorywithprirority= [];
          for(var i = 0; i < self.subcategory.length; i++)
          {
            self.subcategorywithprirority.push(
                  {
                    name : self.subcategory[i],
                    priority : "Low"
                  }
              );
          }
          if(self.categories !=undefined && self.message.head != undefined && self.subcategory.length != 0){
                categoryService.createCategory(this).then(function (response) {
                if (response == 200) {
                          // Raise Success Message
                            Flash.create('success', 'Category has been Created successfully', 'large-text');
                            message={};
                            categoryService.getCategories().then(function(resp){
                            self.categories = resp;
                            self.message.name = [];
                            self.message.head = [];
                            self.subcategory = [];
                            self.message.individual= [];
                    });

                     }
                else if(response==202){
                  // Raise Failure message
                            Flash.create('danger', 'Category Cannot be Created with same name', 'large-text');
                            message={};
                            vm.editsubcategory = [];
                }
               else {
                       // Raise Error Message
                            Flash.create('danger', 'Unable to create', 'large-text');
                   }
                    });
          }
          else{
              Flash.create('danger', 'Please Provide all values', 'large-teext');
          }
    };

    self.updateCategory = function(data,data){
        var present;
        var tempcat=[];
        if(self.editsubcategory.length == 0 ||self.editexecutive == undefined || self.edithead == undefined){
          Flash.create("danger","Please provide all values !",'large-text');
          return;
        }

          for (var i = 0; i < self.editsubcategory.length; i++) {
            present = false;
            for (var j = 0; j < self.editsubcategorywithprirority.length; j++) {
              if (self.editsubcategorywithprirority[j].name ==  self.editsubcategory[i]){
                  present = true;
                  break;
              }
            }

            if(present == false){
               self.editsubcategorywithprirority.push(
                     {
                       "name" : self.editsubcategory[i],
                       "priority" : "Low"
                     });
            }
          }

          for(var i = 0; i < self.editsubcategory.length; i++)
          {
              var priorityvalue = "Low"
              for (var j = 0; j < self.editsubcategorywithprirority.length; j++) {
                if(self.editsubcategorywithprirority[j].name == self.editsubcategory [i]){
                  priorityvalue = self.editsubcategorywithprirority[j].priority;
                }
              }
              tempcat.push( {
                    name : self.editsubcategory[i],
                    priority : priorityvalue
                  }
              );
          }
          self.editsubcategorywithprirority = tempcat;
          categoryService.updatecategory(data,self).then(function (response) {
          if (response == 200) {
          // Raise  Success Message
            Flash.create('success', 'Category has been updated successfully', 'large-text');
            message={};
            categoryService.getCategories().then(function(resp){
              self.categories = resp;
            });
          }
          else if(response==202){
            // Raise Failure message
            Flash.create('danger', 'Unable to Update Category', 'large-text');
            message={};
          }
         else {
                 // Raise Error Message
                      Flash.create('danger', 'Unable to create', 'large-text');
             }
              });
    };

     self.deleteConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Would you like to delete Category')
              .textContent('Category will be deleted Permanently')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Please do it.')
              .cancel('Stop doing it!');

        $mdDialog.show(confirm).then(function() {
          self.removecat(self.editcategory)
        }, function() {

        });
      };


    self.removecat = function(parameter){
      var record = self.categories[parameter];
       categoryService.deleteCategory(record).then(function (response) {
          if (response == 200) {
                    // Raise Success Message
                    Flash.create('success', 'Category has been Deleted successfully', 'large-text');
                    self.editmessage=[];
                    self.edithead=[];
                    self.editexecutive = [];
                    self.editcategory=[];
                    self.editsubcategory = [];
                    self.editexecutives = [];
                    categoryService.getCategories().then(function(resp){
                      self.categories = resp;
                    });

               }
          else if(response == 203) {
            Flash.create('danger', 'Please close all category tickets and try again', 'large-text');
          }
         else {
                 // Raise Error Message
            Flash.create('danger', 'Unable to delete', 'large-text');
          }
              });
    };

}]);
