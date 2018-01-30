/*==========================================================
   Author      : Siva Kella
   Date Created: 20 Oct 2016
   Description : To handle the service to assign Ticket

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('myticketsService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

   var myticketsService = {};

   var getmyTickets = function ( useremail ) {
        var deferred = $q.defer();
        apiService.get("myTickets/getmyTickets", { useremail : useremail }).then(function (response) {
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

    var downloadattachment =function (filename) {
         var deferred = $q.defer();
         apiService.create("ticket/getattachment", { filename : filename }).then(function (response) {
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

     var getmyTickethistories = function (pvalue) {
        var deferred = $q.defer();
        apiService.get("myTickets/getmyTickethistories", { pvalue : pvalue }).then(function (response) {
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
        file = pmessage.attachfiles;
        var deferred = $q.defer();
        if (file != undefined) {
            fr = new FileReader();
            fr.onload = function(event) {
                var data = {
                    "name": file.name,
                    "content": event.target.result.split(",")[1],
                    "size": file.size,
                };
                pmessage.filedata = data;
            //    apiService.create("assignTickets/updateticketStatus", {
               if (file.size > 6861600) {
                     Flash.create('danger', 'Attachment file size exceed 5 MB', 'large-text');
                     return deferred.promise;
                  }
            apiService.create("myTickets/createTickethistory", {     pmessage :    pmessage
                }).then(function(response) {
                        //apiService.create("ticket/createticket", parameters).then(function(response) {
                        if (response)
                            deferred.resolve(response);
                        else
                            deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                    },
                    function(response) {
                        deferred.reject(response);
                    }
                );
            };
            if (file != undefined) {
                fr.readAsDataURL(file);
            }
        } else {
          //  apiService.create("assignTickets/updateticketStatus", {
          apiService.create("myTickets/createTickethistory", {
                  pmessage : pmessage
            }).then(function(response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function(response) {
                    deferred.reject(response);
                });
        }

        return deferred.promise;


    //
    //   var deferred = $q.defer();
    //   apiService.create("myTickets/createTickethistory", { pmessage }).then(function (response) {
    //       console.log("Recieved teh response from Server");
    //       console.log(response);
    //         if (response)
    //             deferred.resolve(response);
    //         else
    //             deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
    //     },
    //         function (response) {
    //             deferred.reject(response);
    //         });
    //     return deferred.promise;
    //


    };


    myticketsService.getmyTickets = getmyTickets;
    myticketsService.getmyTickethistories = getmyTickethistories;
    myticketsService.createTickethistory = createTickethistory;
    myticketsService.downloadattachment = downloadattachment;

    return myticketsService;

}]);
