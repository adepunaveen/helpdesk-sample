/*==========================================================
   Author      : Ranjithprabhu K
   Date Created: 05 Jan 2016
   Description : To handle the service for Dashboard module

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('manageUsersService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

    var manageUsersService = {};

     var addUser = function (parameters) {
        var deferred = $q.defer();
        apiService.create("manageusers", parameters).then(function (response) {
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

    var getUsers = function (parameters) {
        var deferred = $q.defer();
        apiService.get("manageusers/getusers",parameters).then(function (response) {
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

    var modifyUser = function (object,parameters) {
        var deferred = $q.defer();
        apiService.update("manageusers/modifyuser",object,parameters).then(function (response) {
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


     var deleteUser = function (parameters) {
            var deferred = $q.defer();
            apiService.delet("manageusers/deleteuser",parameters).then(function (response) {
                if (response)
                    deferred.resolve(response);
                else
                {
                    deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
                };
            },
                function (response) {
                    deferred.reject(response);
                });
            return deferred.promise;

        };




    //--> Siva Changes start: Added new method
    // Service to create HelpDesk User role
    var createUserrole = function ( parameters ) {
        var deferred = $q.defer();
        apiService.create("hduserroles/createUserrole", parameters).then(function (response) {
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
    //<-- End
     var sendloginmail = function(userinfo) {
            var deferred = $q.defer();
            apiService.create("manageusers/sendloginmail",  userinfo).then(function(response) {
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

    // var updateUserrole = function (object,parameters) {
    //     var deferred = $q.defer();
    //     apiService.update("hduserroles/modifyuserrole",object,parameters).then(function (response) {
    //         if (response)
    //             deferred.resolve(response);
    //         else
    //             deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
    //     },
    //         function (response) {
    //             deferred.reject(response);
    //         });
    //     return deferred.promise;
    // };





    manageUsersService.addUser = addUser;
    manageUsersService.getUsers = getUsers;
    manageUsersService.deleteUser = deleteUser;
    manageUsersService.modifyUser = modifyUser;
    manageUsersService.sendloginmail = sendloginmail;
    //--> Siva Changes Start
    manageUsersService.createUserrole = createUserrole;
    //<-- End
    return manageUsersService;

}]);
