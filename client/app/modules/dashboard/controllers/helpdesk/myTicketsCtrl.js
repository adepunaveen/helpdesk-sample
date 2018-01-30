 //var assignTicketCtrl = angular.module('assignTicketCtrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table']);
dashboard.controller("myTicketsCtrl", ['$rootScope', '$scope', '$state', '$location', '$localStorage', 'myticketsService', 'ticketstatusupdateService', 'Flash', '$mdDialog',
    function($rootScope, $scope, $state, $location, $localStorage, myticketsService, ticketstatusupdateService, Flash, $mdDialog) {
   
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
        self = this;
        vm.message = {};
        vm.curTicketSel = {};
        $scope.myValue = false;
        $scope.canValue = false;
        $scope.canValue1 = false;
        $scope.canValue2 = false;
        vm.selectedticket;
//        console.log("$scope.prestate");
//        console.log($scope.prestate);
        vm.acceptTypes = ".jpg,.jpeg,.doc,.docx";
        vm.attachfiles;
        $scope.opValue = false;
//        vm.useremail = $localStorage.User.emailid;
         vm.useremail = JSON.parse(window.localStorage.getItem("User")).emailid;
 //       vm.userflname = $localStorage.User.firstname.concat(' ').concat($localStorage.User.lastname);
        vm.userflname = JSON.parse(window.localStorage.getItem("User")).firstname.concat(' ').concat(JSON.parse(window.localStorage.getItem("User")).lastname);


        $scope.submit = "Update";
        $scope.anyprevState = false;
        vm.opval = {};
        $scope.init = function() {
            vm.watchEvents();
            $(document).ready(function() {
                setTimeout(function() {
                    $("#dataTables-example").DataTable()
                }, 1000);
            });
        };

        //$scope.nonassignedtickets = assignticketService.getnonassignedTickets();//   [1,2,3,4,5];\

        myticketsService.getmyTickets(vm.useremail).then(function(response) {
            $scope.mytickets = response;
        })

        $scope.newValue = function(pValue) {
            var ticket = JSON.parse(pValue);
            vm.selectedticket = ticket
            if (ticket.status == 'Cancel') {
                $scope.commentsValue = false;
                $scope.buttonValue = false;
            } 
            else if (ticket.status == 'Closed'){
                $scope.commentsValue = false;
                $scope.buttonValue = false;  
                $scope.opValue = false;
            }else {
                $scope.commentsValue = true;
                $scope.buttonValue = true;
            }
            $scope.myValue = true;
            vm.ticketinfo = ticket;
            if (vm.curTicketSel == ticket.ticketNo) {
                return
            }
            vm.curTicketSel = ticket.ticketNo;

            $scope.currentstatus = ticket.status;

            var status_cycle = (ticket.status_cycle.length) - 2;
            $scope.prestate = ticket.status_cycle[status_cycle];
            $scope.canValue = false;
            $scope.canValue1 = false;
            $scope.canValue2 = false;
            if ($scope.currentstatus == "Open") {
                $scope.nextstates = {
                    barclass1: "col-xs-2 smpl-step-step active",
                    barclass2: "col-xs-2 smpl-step-step disabled",
                    barclass3: "col-xs-2 smpl-step-step disabled",
                    barclass4: "col-xs-2 smpl-step-step disabled",
                    barclass5: "col-xs-2 smpl-step-step disabled",

                };

            } else if ($scope.currentstatus == "Assigned") {

                $scope.nextstates = {
                    barclass1: "col-xs-2 smpl-step-step complete",
                    barclass2: "col-xs-2 smpl-step-step active",
                    barclass3: "col-xs-2 smpl-step-step disabled",
                    barclass4: "col-xs-2 smpl-step-step disabled",
                    barclass5: "col-xs-2 smpl-step-step disabled"
                };

            } else if ($scope.currentstatus == "In-Progress" || $scope.currentstatus == "Query") {
                $scope.nextstates = {
                    barclass1: "col-xs-2 smpl-step-step complete",
                    barclass2: "col-xs-2 smpl-step-step complete",
                    barclass3: "col-xs-2 smpl-step-step active",
                    barclass4: "col-xs-2 smpl-step-step disabled",
                    barclass5: "col-xs-2 smpl-step-step disabled"
                };
            }
            /*else if ($scope.currentstatus == "Query" ) {

              $scope.nextstates = [{barclass: "visited first" , statelabel: "Open"} ,
                                  {barclass: "previous visited" , statelabel: "Assigned"} ,
                                  {barclass: "previous visited" , statelabel: "In-Progress"} ,
                                  {barclass: "active" , statelabel: "Querry"} ,
                                  {barclass: "next" , statelabel: "Completed"},
                                  {barclass: "next" , statelabel: "Closed"}  ]  ;
            }*/
            else if ($scope.currentstatus == "Completed") {

                $scope.nextstates = {
                    barclass1: "col-xs-2 smpl-step-step complete",
                    barclass2: "col-xs-2 smpl-step-step complete",
                    barclass3: "col-xs-2 smpl-step-step complete",
                    barclass4: "col-xs-2 smpl-step-step active",
                    barclass5: "col-xs-2 smpl-step-step disabled"
                };
            } else if ($scope.currentstatus == "Closed") {

                $scope.nextstates = {
                    barclass1: "col-xs-2 smpl-step-step complete",
                    barclass2: "col-xs-2 smpl-step-step complete",
                    barclass3: "col-xs-2 smpl-step-step complete",
                    barclass4: "col-xs-2 smpl-step-step complete",
                    barclass5: "col-xs-2 smpl-step-step active",
                };
            } else if ($scope.currentstatus == "Cancel") {
                console.log("cancel condition");

                if ($scope.prestate == "In-Progress" || $scope.prestate == "Query") {
                    console.log("hello");
                    $scope.canValue = true;

                    $scope.nextstates = {
                        barclass1: "col-xs-2 smpl-step-step complete",
                        barclass2: "col-xs-2 smpl-step-step complete",
                        barclass3: "col-xs-2 smpl-step-step complete",
                        barclass6: "col-xs-2 smpl-step-step active",
                        barclass4: "col-xs-2 smpl-step-step disabled",
                        barclass5: "col-xs-2 smpl-step-step disabled"
                    };

                } else if ($scope.prestate == "Created" || $scope.prestate == "Assigned to Group") {
                    console.log("assign trace")
                    $scope.canValue1 = true;
                    $scope.nextstates = {
                        barclass1: "col-xs-2 smpl-step-step complete",
                        barclass7: "col-xs-2 smpl-step-step active",
                        barclass2: "col-xs-2 smpl-step-step disabled",
                        barclass3: "col-xs-2 smpl-step-step disabled",
                        barclass4: "col-xs-2 smpl-step-step disabled",
                        barclass5: "col-xs-2 smpl-step-step disabled"
                    };

                } else if ($scope.prestate == "Assigned to individual") {
                    console.log("individ")
                    $scope.canValue2 = true;
                    $scope.nextstates = {
                        barclass1: "col-xs-2 smpl-step-step complete",
                        barclass2: "col-xs-2 smpl-step-step complete",
                        barclass8: "col-xs-2 smpl-step-step active",
                        barclass3: "col-xs-2 smpl-step-step disabled",
                        barclass4: "col-xs-2 smpl-step-step disabled",
                        barclass5: "col-xs-2 smpl-step-step disabled"
                    };

                }


            }


            /*$scope.nextstates =  [{barclass: "visited first" , statelabel: "Open"} ,
                                 {barclass: "previous visited" , statelabel: "Assigned"} ,
                                 {barclass: "active" , statelabel: "In-Progress"} ,
                                 {barclass: "next" , statelabel: "Closed"}  ]  ;*/



            myticketsService.getmyTickethistories(ticket.ticketNo).then(function(response) {
                $scope.groups = response;
            })
        }

        $scope.statusValue = function(pValue) {

            $scope.submit = pValue;
            $scope.opValue = true;
            vm.opval = pValue;
        };

        //  if(!confirm($(this).data('confirm'))){
      
        // }

        $('#updateTicketBtn').on('click', function(e) {
            if (vm.opval == "Cancel") {
                //var r = confirm("Are you sure, you want to Cancel the ticket?");
                // if (r == true) {
                    vm.newstatus = "Cancel";
                    vm.message = $("#commentsStr").val();
                    if (vm.message == '') {
                        Flash.create('danger', 'Comments can not be empty', 'large-text');
                        return
                    }
                    ticketstatusupdateService.updateticketStatus(vm).then(function(response) {
                        if (response.statuscode == 200) {
                            // Raise Success Message
                            Flash.create('success', 'Ticket has been Updated successfully', 'large-text');
                            vm.message = {};
                            //vm.curTicketSel = {};
                            $("#commentsStr").val('');
                            $scope.groups.push(response.data);
                             $scope.commentsValue = false;
                            $scope.buttonValue = false;
                            $scope.opValue  = false;
                            $scope.myValue = false;
                        } else {
                            // Raise Error Message
                            Flash.create('danger', 'Unable to update', 'large-text');
                        }
                    });


//                } 
                return
            }


            vm.message = $("#commentsStr").val();
            if (vm.message == '') {
                Flash.create('danger', 'Please Provide Additional Comments', 'large-text');
                return
            }
            myticketsService.createTickethistory(vm).then(function(response) {
                console.log("updating history....");
                console.log(response);
                if (response.statuscode == 200) {
                    // Raise Success Message
                    Flash.create('success', 'Ticket has been Updated successfully', 'large-text');
                    vm.message = {};
                    //vm.curTicketSel = {};
                    $("#commentsStr").val('');
                    $("#fileUpload").val('');
                    vm.attachfiles= undefined;
                    $scope.groups.push(response.data);
                    myticketsService.getmyTickets(vm.useremail).then(function(response) {
                        $scope.mytickets = response;
                    })
                    //vm.sendMailTOHead();
                } else {
                    console.log("cmoing here...")
                    // Raise Error Message
                    Flash.create('danger', 'Unable to update', 'large-text');
                }
            });
        })


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



        self.showDetails = function(event) {
        

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

        self.toggleLoading = function() {
            $scope.loading = !($scope.loading);
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
                    else{
                        vm.attachfiles = undefined;
                    }
                });
            });
        };


        // $scope.init= function () {
        //   console.log("watching events.....");
        //   vm.watchEvents();
        // };

        $scope.init();



    }
]);
