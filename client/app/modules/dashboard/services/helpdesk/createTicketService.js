/*==========================================================
   Author      : Naveen Adepu
   Date Created: 23 Sep 2016
   Description : To handle the service for Create Ticket

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('createTicketService', ['$http', '$q', 'Flash', 'apiService', function($http, $q, Flash, apiService) {

    var ticketService = {};

    var createTicket = function(parameters) {
        file = parameters.attachfiles;
        var deferred = $q.defer();
        if (file != undefined) {
            fr = new FileReader();
            fr.onload = function(event) {
                var data = {
                    "name": file.name,
                    "content": event.target.result.split(",")[1],
                    "size": file.size,
                };
                parameters.filedata = data;
                 if (file.size > 6861600) {
                     Flash.create('danger', 'Attachment file size exceed 5 MB', 'large-text');
                     return deferred.promise;
                  }
                apiService.create("ticket/createticket", parameters).then(function(response) {
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
            parameters.filedata = undefined;
            apiService.create("ticket/createticket", parameters).then(function(response) {
                    if (response)
                        deferred.resolve(response);
                    else
                        deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                },
                function(response) {
                    deferred.reject(response);
                }
            );
        }
        return deferred.promise;
    };

    var sendmail = function(ticketinfo) {
        var deferred = $q.defer();
        apiService.get("ticket/sendmail", {
       //     ticketinfo
        }).then(function(response) {
                if (response)
                    deferred.resolve(response);
                else
                    deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
            },
            function(response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getPriorities = function() {
        var deferred = $q.defer();
        apiService.get("ticket/getpriorities", {}).then(function(response) {
                if (response)
                    deferred.resolve(response);
                else
                    deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
            },
            function(response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    ticketService.createTicket = createTicket;
    ticketService.sendmail = sendmail;
    ticketService.getPriorities = getPriorities;
    return ticketService;

}]);
