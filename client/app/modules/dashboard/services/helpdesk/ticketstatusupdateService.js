/*==========================================================
   Author      : Siva Kella
   Date Created: 05 Nov 2016
   Description : To handle the status update of Ticket

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('ticketstatusupdateService', ['$http', '$q', 'Flash', 'apiService', function($http, $q, Flash, apiService) {

    var ticketstatusupdateService = {};
    var updateticketStatus = function(pmessage) {
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
                if (file.size > 68616) {
                     Flash.create('danger', 'Attachment file size exceed 50 KB', 'large-text');
                     return deferred.promise;
                }
                apiService.create("assignTickets/updateticketStatus", {
                    pmessage : pmessage
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
            apiService.create("assignTickets/updateticketStatus", {
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
    };



    ticketstatusupdateService.updateticketStatus = updateticketStatus;

    return ticketstatusupdateService;

}]);
