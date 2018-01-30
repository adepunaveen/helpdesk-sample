/*==========================================================
   Author      : Siva Kella
   Date Created: 20 Oct 2016
   Description : To handle the service to assign Ticket
   
   Change Log
   s.no      date    author     description     
===========================================================*/


dashboard.service('assignticketService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

   var assignticketService = {};
   
   var getassignedTickets = function ( pUser ) {
        var deferred = $q.defer();
        apiService.get("assignTickets/getassignedtickets", { pUser : pUser }).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

     var updateticketpriority = function(object,parameters){
      var deferred = $q.defer();
      apiService.update("assignTickets/updateticketpriority",object,parameters).then(function (response) {
          if (response)
              deferred.resolve(response);
          else
              deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
      },
          function (response) {
              deferred.reject(response);
          });
      return deferred.promise;

  };



    assignticketService.getassignedTickets = getassignedTickets;
    assignticketService.updateticketpriority = updateticketpriority;
 
    return assignticketService;

}]);
