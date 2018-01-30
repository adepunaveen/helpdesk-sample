//var assignTicketCtrl = angular.module('assignTicketCtrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);
dashboard.controller("managegroupticketCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage','manageticketService', 'manageticketService','Flash','$mdDialog',
function ($rootScope, $scope, $state, $location, $localStorage, manageticketService,manageticketService, Flash, $mdDialog) {
    var vm = this;
    // if ( $localStorage.User == undefined) {
    //   $state.go('login')
    // }
    // if ($localStorage.userType !='User' ) {
    //   $state.go('app.dashboard');
    // }

    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }

    if (JSON.parse(window.localStorage.getItem("userType")) !='User' ) {
      $state.go('app.dashboard');
    }

    vm.message = {};
    vm.curTicketSel = {};
    $scope.myValue = false;
//    vm.useremail = $localStorage.User.emailid;
      vm.useremail = JSON.parse(window.localStorage.getItem("User")).emailid; 
//    vm.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
    vm.userflname = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);
    vm.usercategories ;
    vm.cates = [];
    vm.selectedtickets = [];
    $scope.init=function(){
      $(document).ready(function() {
          setTimeout(function(){  $("#dataTables-example").DataTable()},1000);
        } );
    };
    $scope.$watch('ticket.Assigned_to', function(newvalue,oldvalue) {
    });
    //$scope.nonassignedtickets = assignticketService.getnonassignedTickets();//   [1,2,3,4,5];\
  manageticketService.getCatogories( vm.useremail ).then(function (response) {
          vm.usercategories = response;
          for(var i=0; i < response.length;i++){
            vm.cates.push(response[i].name);
          }
         manageticketService.gettickets( vm.cates ).then(function (response) {
                 vm.mytickets = response;
           });
    });
   vm.setticket = function (pticket) {
    vm.selectedtickets = [];
    vm.selectedtickets.push(pticket);
     // body..
   }
   vm.categoryusers = function(categoryname){
        //vm.usercategories
        var execu;
        for ( var i =0 ;i  < vm.usercategories.length;i++){

          if (vm.usercategories[i].name == categoryname){
            execu = vm.usercategories[i].executives
//            return vm.usercategories[i].executives;
          }
        }
        return execu;
   };

  vm.updatetickets = function(){
     $mdDialog.show({
                templateUrl: 'app/modules/dashboard/views/helpdesk/assigndescription.html',
               // style : "height: 169px;width: 482px;"
                parent: angular.element(document.body),
                windowClass: 'large-Modal',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: false,
                disableParentScroll: true,
                controller: function DialogController($scope, $mdDialog) {
                     $scope.submitcomments = function() {
                        vm.comments = $scope.comments;
                        $scope.vm.assigntickets();
                        vm.selectedtickets = [];
                        $mdDialog.cancel();
                     }
                     $scope.cancel =function(){
                      $mdDialog.cancel();
                      vm.comments = undefined;
                     }
                   }
            });
     }
   vm.assigntickets = function(){

          manageticketService.updatetickets(vm.mytickets,vm).then(function (response) {
          if (response == 200) {
            // Raise Success Message
              Flash.create('success', 'Ticket has been updated successfully', 'large-text');
              message={};
              vm.comments = undefined;
              manageticketService.gettickets( vm.cates ).then(function (response) {
                vm.mytickets = response;
             });
          }
          else if(response==202){
            // Raise Failure message
                      Flash.create('danger', 'Ticket not been updated', 'large-text');
                      message={};
          }
         else {
                 // Raise Error Message
                      Flash.create('danger', 'Unable to create', 'large-text');
             }
              });
   };

   vm.showDescription = function(event) {
     var msg='';
     manageticketService.gettickethistories( event ).then(function (response) {
            // vm.mytickets = response;
             for (var i = 0; i < response.length; i++) {
               msg = msg + '<b>'+response[i].Action+ ' : By '+ response[i].performed_by+ "</b><br>" 
               msg = msg + response[i].description;
               msg = msg + '<br></br>'
             }
             $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog> <div class="md-dialog-content">' +
                            '  <md-dialog-content><pre>' +
                                msg +
                            '  </pre></md-dialog-content></div>' +
                            '</md-dialog>',
                controller: function DialogController($scope, $mdDialog) {
                   $scope.closeDialog = function() {
                      $mdDialog.hide();
                   }
                }
             });
       });
    };

}]);
