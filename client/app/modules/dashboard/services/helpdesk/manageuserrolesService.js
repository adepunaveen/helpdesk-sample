/*==========================================================
   Author      : Siva Kella
   Date Created: 08 Nov 2016
   Description : To handle the service to manage help desk user roles
   
   Change Log
   s.no      date    author     description     
===========================================================*/


dashboard.service('manageuserrolesService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

   var manageuserrolesService = {};
   
   var updateUserRole = function ( object, parameters ) {
        var deferred = $q.defer();
        apiService.update("hduserroles/modifyuserrole", object, parameters).then(function (response) {
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


    var updatehHDUserRole = function ( object, parameters ) {
        var deferred = $q.defer();
        apiService.update("hduserroles/modifyhduserrole", object, parameters).then(function (response) {
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


    var gethdusers = function ( pUser ) {
    var deferred = $q.defer();
    apiService.get("hduserroles/gethdusers", { pUser : pUser }).then(function (response) {
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

    manageuserrolesService.updateUserRole = updateUserRole;
    manageuserrolesService.gethdusers = gethdusers;
    manageuserrolesService.createUserrole = createUserrole;
//    manageuserrolesService.updateUserrole = updateUserrole;
    manageuserrolesService.updatehHDUserRole = updatehHDUserRole;
    return manageuserrolesService;

}]);