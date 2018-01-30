/*==========================================================
   Author      : Naveen Adepu.
   Date Created: 7 Nov 2016
   Description : To handle the service to for ticket assignment to individual..

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('manageticketService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

   var manageticketService = {};

   var getCatogories = function ( useremail ) {
        var deferred = $q.defer();
        apiService.get("ticket/getcategories/", { useremail : useremail }).then(function (response) {
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

    var gettickethistories = function(ticketid) {
      var deferred = $q.defer();
      apiService.get("ticket/gethistories/", { ticketid : ticketid }).then(function (response) {
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

     var gettickets = function (category) {
    //return [1,2,3,4,5,6,7,8,9];
        var deferred = $q.defer();

        apiService.get("ticket/gettickets", { category : category }).then(function (response) {
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


    var updatetickets = function(object,parameters){
        var deferred = $q.defer();
        apiService.update("ticket/updatetickets",object,parameters).then(function (response) {
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




  var createTickethistory = function ( pmessage ) {
      var deferred = $q.defer();
      apiService.create("myTickets/createTickethistory", { pmessage : pmessage }).then(function (response) {
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
    manageticketService.updatetickets = updatetickets;
    manageticketService.gettickets =gettickets ;
    manageticketService.getCatogories = getCatogories;
    manageticketService.gettickethistories = gettickethistories;
//    manageticketService.getmyTickethistories = getmyTickethistories;
//   manageticketService.createTickethistory = createTickethistory;

    return manageticketService;

}]);
