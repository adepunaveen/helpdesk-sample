dashboard.controller("hduserhome", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash','createTicketService','assignticketService','userHomeService', '$localStorage',
function ($rootScope, $scope, $state, $location, dashboardService, Flash,createTicketService,assignticketService,userHomeService, $localStorage) {
	var vm = this;
  var userdetails;
  $scope.ticketsOpened = {};
  $scope.ticketsInprogress = {};
  $scope.querytickets = {};
  $scope.closedTickets = {};
  $scope.raisedTickets = {};
  $scope.cancelTickets = {};

  $scope.GroupallocatedTickets = {};
  $scope.GroupticketsInprogress = {};
  $scope.Groupquerytickets = {};
  $scope.GroupclosedTickets = {};
  $scope.GroupticketsOpened = {};
  $scope.Groupcanceltickets = {};

  $scope.IndvcancelTickets ={};

  $scope.myValue = true;
  $scope.GroupValue = false;
  $scope.IndvValue = false;
  $scope.HeadValue = false;
  $scope.IndividualValue = false;
  $scope.BUValue = true;
  $scope.IndBUValue = true;
  
  vm.emailid = {};
  vm.userrole = {};
  
  var userfilteredticks = {};
  var indvfilteredticks = {};
  var headfilteredticks = {};

  $scope.init=function(){
      
//      userdetails = $localStorage.User;
    userdetails = JSON.parse(window.localStorage.getItem("User"));
//      vm.emailid = $localStorage.User.emailid;
  if (userdetails != null) {
    vm.emailid = userdetails.emailid;
  }

    vm.userrole = "User";
     
  if (JSON.parse(window.localStorage.getItem("hduserrole")) != null) {

//      if ($localStorage.hduserrole.role.includes("BUGroupIndividual")) { 
    if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupIndividual") != -1) { 
        vm.userrole = "BUGroupIndividual"
    } 
//     else if ($localStorage.hduserrole.role.includes("BUGroupHead")) { 
    else if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupHead") != -1) { 
      vm.userrole = "BUGroupHead" 
    };
  }



    userHomeService.getRaisedTickets(  [vm.emailid , vm.userrole] ).then(function(response){
    
        var inprogressTicks = [];
        var queryTicks = [];
        var completedTicks = [];
        var closedTicks = [];
        var openedTicks = [];
        var cancelTicks = [];
        
        var indvinprogressTicks = [];
        var indvqueryTicks = [];
        var indvclosedTicks = [];
        var indvcompletedTicks = [];
        var indvassignedTicks = [];
        var indvcancelTicks = [];


        var headinprogressTicks = [];
        var headqueryTicks = [];
        var headclosedTicks = [];
        var headopenedTicks = [];
        var headAssignedTicks = [];
        var headcompletedTicks = [];
        var headcancelTicks =[];
        var jresonse = JSON.stringify(response);

        userfilteredticks = JSON.parse(jresonse).filter( function(entry) {
                                                                  if (entry.owneremail == vm.emailid) {
                                                                      
                                                                      if(entry.status == "In-Progress")  {
                                                                         inprogressTicks.push(entry);     }
                                                                      else if(entry.status == "Query")  {
                                                                          queryTicks.push(entry);         }  
                                                                      else if(entry.status == "Completed")  {
                                                                          completedTicks.push(entry);           }
                                                                      else if(entry.status == "Closed")  {
                                                                          closedTicks.push(entry);        }
                                                                      else if(entry.status == "Open"||entry.status == "Assigned") {
                                                                          openedTicks.push(entry);        }
                                                                       else if(entry.status == "Cancel")  {
                                                                          cancelTicks.push(entry);        }
                                                                      return true;

                                                                  }
                                                                  else
                                                                    { return false;}
                                                           // return entry.owneremail == vm.emailid;
                                                                         });
        indvfilteredticks = JSON.parse(jresonse).filter( function(entry) {
                                                                if (entry.Assigned_to == vm.emailid) {
                                                                      
                                                                      if(entry.status == "In-Progress")  {
                                                                         indvinprogressTicks.push(entry);     }
                                                                      else if(entry.status == "Query")  {
                                                                          indvqueryTicks.push(entry);        } 
                                                                      else if(entry.status == "Completed")  {
                                                                          indvcompletedTicks.push(entry);    }
                                                                       else if(entry.status == "Assigned") {
                                                                          indvassignedTicks.push(entry);        }
                                                                      else if(entry.status == "Closed")  {
                                                                          indvclosedTicks.push(entry);        }
                                                                      else if(entry.status == "Cancel")  {
                                                                          indvcancelTicks.push(entry);        }
                                                                          
                                                                      
                                                                      return true;

                                                                  }
                                                                  else
                                                                    { return false;}
                                                           //return entry.Assigned_to == vm.emailid;
                                                                         });
        headfilteredticks = JSON.parse(jresonse).filter( function(entry) {
                                                                if (entry.categoryhead == vm.emailid) {
                                                                      
                                                                      if(entry.status == "In-Progress")  {
                                                                          headinprogressTicks.push(entry);     }
                                                                      else if(entry.status == "Query")  {
                                                                          headqueryTicks.push(entry);        }
                                                                      else if(entry.status == "Completed")  {
                                                                          headcompletedTicks.push(entry);  }    
                                                                      else if(entry.status == "Closed")  {
                                                                          headclosedTicks.push(entry);        }
                                                                      else if(entry.status == "Assigned") {
                                                                          headAssignedTicks.push(entry);      }   
                                                                      else if(entry.status == "Open")    {
                                                                          headopenedTicks.push(entry);        }
                                                                      else if(entry.status == "Cancel")  {
                                                                          headcancelTicks.push(entry);        }
                                                                      return true;

                                                                  }
                                                                  else
                                                                    { return false;}
                                                           //return entry.categoryhead == vm.emailid;
                                                                         });
        $scope.raisedTickets     = userfilteredticks.length;
        $scope.ticketsOpened     = openedTicks.length;                                       
        $scope.ticketsInprogress = inprogressTicks.length;
        $scope.ticketsCompleted  = completedTicks.length;
        $scope.querytickets      = queryTicks.length;
        $scope.closedTickets     = closedTicks.length;
        $scope.cancelTickets     = cancelTicks.length;
        if ($scope.raisedTickets == 0 ) { $scope.myValue = false;};


      if ( JSON.parse(window.localStorage.getItem("hduserrole")) != null){
//        if ( $localStorage.hduserrole.role.includes("BUGroupIndividual") ) {
        if ( JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupIndividual") != -1 ) {
          $scope.IndvValue  = true;
          $scope.IndvassignedTickets  = indvfilteredticks.length;
          $scope.IndvticketsAssigned  = indvassignedTicks.length;
          $scope.IndvticketsInprogress = indvinprogressTicks.length;
          $scope.Indvquerytickets      = indvqueryTicks.length;
          $scope.IndvcompletedTickets  = indvcompletedTicks.length;
          $scope.IndvclosedTickets     = indvclosedTicks.length;
          $scope.IndvcancelTickets     = indvcancelTicks.length;
        }

//        if ($localStorage.hduserrole.role.includes("BUGroupHead") ) {
        if (JSON.parse(window.localStorage.getItem("hduserrole")).role.indexOf("BUGroupHead") != -1) {
          $scope.GroupValue = true;
          $scope.HeadValue  = true;
          $scope.GroupallocatedTickets  = headfilteredticks.length;
          $scope.GroupticketsOpened     = headopenedTicks.length;
          $scope.GroupticketsAssigned   = headAssignedTicks.length;
          $scope.GroupticketsInprogress = headinprogressTicks.length;
          $scope.Groupquerytickets      = headqueryTicks.length;
          $scope.GroupcompletedTickets  = headcompletedTicks.length;
          $scope.GroupclosedTickets     = headclosedTicks.length;
          $scope.Groupcanceltickets     = headcancelTicks.length;
        };
      }
        if ($scope.GroupallocatedTickets == 0 ) { $scope.BUValue = false;};
        if ($scope.IndvassignedTickets == 0 ) { $scope.IndBUValue = false;};

        setTimeout(function(){
          $scope.$apply(function(){
          $scope.options = {
  
                            data: [
                                    {
                                      Opened    : $scope.ticketsOpened,
                                      Inprogress: $scope.ticketsInprogress,
                                      Query     : $scope.querytickets,
                                      Completed : $scope.ticketsCompleted,
                                      Closed    : $scope.closedTickets,
                                      Cancel    : $scope.cancelTickets
                                    }
                                  ],

                            dimensions: {
                                        Opened:     { type : 'pie'}, 
                                        Inprogress: { type : 'pie'},
                                        Query:      { type : 'pie'},
                                        Completed:  { type : 'pie'},
                                        Closed:     { type : 'pie'},
                                        Cancel:     { type : 'pie'}
                                        }


                            }

                            
          $scope.groupoptions = {
  
                            data: [
                                    {
                                      ActionRequired : $scope.GroupticketsOpened,
                                      Assigned  : $scope.GroupticketsAssigned,
                                      Inprogress: $scope.GroupticketsInprogress,
                                      Query     : $scope.Groupquerytickets,
                                      Completed : $scope.GroupcompletedTickets,
                                      Closed    : $scope.GroupclosedTickets,
                                      Cancel    : $scope.Groupcanceltickets
                                    }
                                  ],

                            dimensions: {
                                        ActionRequired:     { type : 'pie'}, 
                                        Assigned:   { type : 'pie'},
                                        Inprogress: { type : 'pie'},
                                        Query:      { type : 'pie'},
                                        Completed:  { type : 'pie'},
                                        Closed:     { type : 'pie'},
                                        Cancel:     { type : 'pie'}
                                        }

                            } 


                            
          $scope.indvoptions = {
  
                            data: [
                                    {
                                      ActionRequired  : $scope.IndvticketsAssigned,
                                      Inprogress      : $scope.IndvticketsInprogress,
                                      Query           : $scope.Indvquerytickets,
                                      Completed       : $scope.IndvcompletedTickets,
                                      Closed          : $scope.IndvclosedTickets,
                                      Cancel          : $scope.IndvcancelTickets
                                    }
                                  ],

                            dimensions: {
                                        ActionRequired: { type : 'pie'}, 
                                        Inprogress    : { type : 'pie'},
                                        Query         : { type : 'pie'},
                                        Completed     : { type : 'pie'},
                                        Closed        : { type : 'pie'},
                                        Cancel        : { type : 'pie'}
                                        }

                            } 
        });});
    

   }); // service Get call end

  };// Init call end
    
  $scope.init();

$scope.go = function(ai) {
  window.location.replace('#/app/mytickets');
  
};

   
}

]);


