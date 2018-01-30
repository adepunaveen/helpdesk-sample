dashboard.controller("assignTicketCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage','assignticketService', 'myticketsService','ticketstatusupdateService', 'Flash','$mdDialog','createTicketService',
function ($rootScope, $scope, $state, $location, $localStorage, assignticketService, myticketsService, ticketstatusupdateService, Flash, $mdDialog,createTicketService) {
    var vm = this;
//    if ( $localStorage.User == undefined) {
    if ( window.localStorage.getItem("User") == null) {
      $state.go('login')
    }
//    if ($localStorage.userType !='User' ) {
    if (JSON.parse(window.localStorage.getItem("userType")) !='User' ) {
      $state.go('app.dashboard');
    }
    vm.message = {};
    vm.curTicketSel = {};
    vm.status = {};
    vm.attachfiles ;
    vm.newstatus = {};
//    vm.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
    vm.userflname = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);
    $scope.myValue = false;
    $scope.myUpdValue = false;
    $scope.validTicket = {};
    vm.priorities= {};
    vm.selticketpriority='';
    vm.acceptTypes = ".jpg,.jpeg,.doc,.docx";
    $scope.init=function(){
      vm.watchEvents();
      $(document).ready(function() {
          setTimeout(function(){  $("#dataTables-example").DataTable()},1000);
        } );

    };
    createTicketService.getPriorities().then(function(response){
      vm.priorities = response;
    });
//    assignticketService.getassignedTickets( $localStorage.User.emailid ).then(function (response) {
      assignticketService.getassignedTickets( JSON.parse(window.localStorage.getItem("User")).emailid ).then(function (response) {
       $scope.assignedTickets = response;
    })

    $scope.newValue = function(pValue){
      //var ticket = JSON.parse(pValue);
      var ticket = pValue;
      vm.status = ticket.status;
      vm.selticketpriority = ticket.priority;
      if (vm.curTicketSel == ticket.ticketNo) {  return  }
      $scope.myValue = true;
      $scope.myUpdValue = true;
      vm.curTicketSel = ticket.ticketNo;

      myticketsService.getmyTickethistories( ticket.ticketNo ).then(function (response) {
        $scope.groups = response;
       })
      reviseStatusSates();
    }

    $scope.UpdateStatusitemselected = function(item) {
      $scope.updatestatusselected = item;
      vm.newstatus = item;

      vm.message = $("#commentsStr").val();
       if (vm.message == '') {
                Flash.create('danger', 'Please Provide Additional Comments', 'large-text');
                return
            }
      ticketstatusupdateService.updateticketStatus( vm ).then(function (response) {

        if (response.statuscode == 200) {
                // Raise Success Message
                Flash.create('success', 'Ticket has been Updated successfully', 'large-text');
                vm.message='';
                //vm.curTicketSel = {};
                $("#commentsStr").val('');
                $("#fileUpload").val('');
//                $scope.myValue = false;
                vm.attachfiles= undefined;
                $scope.groups.push(response.data);
               //vm.sendMailTOHead();
//               assignticketService.getassignedTickets( $localStorage.User.emailid ).then(function (response) {
               assignticketService.getassignedTickets( JSON.parse(window.localStorage.getItem("User")).emailid ).then(function (response) {
                  $scope.assignedTickets = response;
                })
               // revise states
               vm.status = vm.newstatus;
               $("#fileUpload").val('');
               vm.attachfiles= undefined;
               reviseStatusSates();
                  }
        else {
               // Raise Error Message
               Flash.create('danger', 'Unable to update', 'large-text');
             }
       }
      );

    };

  function reviseStatusSates(){
      if (vm.status == "Assigned") {
        $scope.statusStates = ["In-Progress","Cancel" ] }
      else if (vm.status == "In-Progress") {
        $scope.statusStates = ["Query" , "Completed","Cancel" ]; }
      else if (vm.status == "Query") {
        $scope.statusStates = ["Cancel"]; }
      else if (vm.status == "Completed") {
        $scope.statusStates = ["Closed"]; }
      else if (vm.status == "Closed") {
        $scope.statusStates = []; }
      else if (vm.status == "Cancel") {
        $scope.myUpdValue = false;}
      else {
       // $scope.statusStates = ["In-Progress"];

      }

      $scope.updatestatusselected = vm.status;

    };


  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };

  $scope.oneAtATime = true;
  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };


   self = this;
   self.showDetails = function(event){

   };

   self.watchEvents = function() {
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
           });
       });
   };

   self.downloadattachment = function(filename) {
       myticketsService.downloadattachment(filename).then(function(data) {
           var content = data['data'];
           var fname = data['name'];
           var txt = atob(content);
           var length = txt.length;

           var ab = new ArrayBuffer(length);
           var ua = new Uint8Array(ab);
           for (var i = 0; i < length; i++) {
               ua[i] = txt.charCodeAt(i);
           }
           var a = document.createElement('a');
           var blob = new Blob([ab], {
               type: "application/octet-stream"
           });
           a.href = window.URL.createObjectURL(blob);
           a.download = fname;
           vm.toggleLoading();
           a.click();

           //   $scope.groups = response;
       })
   }


   self.updateticketpriority = function(p_priority){
          self.p_priority = p_priority;
          assignticketService.updateticketpriority(self,self).then(function (response) {
          if (response == 200) {
                // Raise  Success Message
                Flash.create('success', 'Ticket priority has been updated', 'large-text');
                vm.selticketpriority = p_priority;
               }
         else {
                 // Raise Error Message
                      Flash.create('danger', 'Ticket priority has not been updated', 'large-text');
             }
              });    
   }

   self.toggleLoading = function() {
       $scope.loading = !($scope.loading);
   };

   $scope.init();

}]);
