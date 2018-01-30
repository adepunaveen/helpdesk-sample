

login.service('loginService', ['$http', '$q', 'Flash', 'apiService','$localStorage','$rootScope', function ($http, $q, Flash, apiService,$localStorage,$rootScope) {

    var loginService = {};


    //service to communicate with users model to verify login credentials
    var accessLogin = function (parameters) {
        var deferred = $q.defer();
        apiService.get("users", parameters).then(function (response) {
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

    var sendPassword = function (parameters) {
        var deferred = $q.defer();
        apiService.get("users/forgotPassword", parameters).then(function (response) {
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

    var updateUser = function ( object, parameters) {
        var deferred = $q.defer();
        console.log("Server --> for response");
        console.log(parameters);
        apiService.update("users", object, parameters).then(function (response) {
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

     var updateUserPassword = function ( object, parameters) {
            var deferred = $q.defer();
            apiService.update("users/updateuserpassword", object, parameters).then(function (response) {
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


    
    //--> Siva Changes start: Added new method
    // Service to create HelpDesk User role 
    var createUserrole = function ( parameters ) {
    console.log(" --->>>>>> createUserroleservice---> Sending to Server..........");
        
        var deferred = $q.defer();
        apiService.create("hduserroles/createUserrole", parameters).then(function (response) {
            if (response){                
                 console.log(" <<<<-----------createUserroleservice  <<<------ receving from Server..........");
                deferred.resolve(response);
            }
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;

    };

    var uploadEmpPic = function ( parameters ) {
    console.log("In uploadEmpPic service---> Sending to Server..........");
    
        var deferred = $q.defer();
        apiService.create("hduserroles/uploadempimage", parameters).then(function (response) {
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
    
    loginService.accessLogin = accessLogin;
    loginService.sendPassword = sendPassword;
    loginService.updateUser = updateUser;
    loginService.uploadEmpPic = uploadEmpPic;
    loginService.updateUserPassword = updateUserPassword;
    //--> Siva Changes Start
    loginService.createUserrole = createUserrole;
    //<-- End
    return loginService;

}]);
