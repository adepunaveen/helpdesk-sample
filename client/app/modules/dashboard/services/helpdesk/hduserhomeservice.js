/*==========================================================
   Author      : Chandana
   Date Created: 23 Sep 2016
   Description : To handle the home page service
   
   Change Log
   s.no      date    author     description     
===========================================================*/
dashboard.service('userHomeService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

	var userHomeService = {};

	var getRaisedTickets = function (parameter) {
	      var deferred = $q.defer();
        
        apiService.get("hduserhome/getraisedtickets/", {parameter : parameter}).then(function (response) {
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

    userHomeService.getRaisedTickets = getRaisedTickets;   
    return userHomeService;
    }]);