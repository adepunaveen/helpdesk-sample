/*==========================================================
   Author      : Naveen Adepu
   Date Created: 27 Sep 2016
   Description : To handle the service for Create Ticket

   Change Log
   s.no      date    author     description
===========================================================*/


dashboard.service('categoryService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

    var categoryService = {};

   var getCategories = function () {
        var deferred = $q.defer();
        apiService.get("managecategory/getcategories", {}).then(function (response) {
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

    var getOwnedCategories = function (parameters) {
        var deferred = $q.defer();
        apiService.get("managecategory/getownedcategories", {parameters : parameters}).then(function (response) {
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


    var createCategory = function (parameters) {
        var deferred = $q.defer();
        apiService.create("managecategory/createcategories", parameters).then(function (response) {
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

    var updateCategory = function(object,parameters){
        var deferred = $q.defer();
        apiService.update("managecategory/updatecategory",object,parameters).then(function (response) {
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

    var updatescheduletime = function(object,parameters){
        var deferred = $q.defer();
        apiService.update("schedule/updatescheduletime",object,parameters).then(function (response) {
            if (response){
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



 var updatePriority = function(object,parameters){
        var deferred = $q.defer();
        apiService.update("managecategory/updatepriority",object,parameters).then(function (response) {
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


   var getusers = function () {
        var deferred = $q.defer();
        apiService.get("managecategory/gethelpdeskusers", {}).then(function (response) {
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


    var getExcutives = function(){
        var deferred = $q.defer();
        apiService.get("managecategory/gethelpdeskexecutives", {}).then(function (response) {
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
    var getschduledays = function(){
    var deferred = $q.defer();
    apiService.get("schedule/getscheduledays", {}).then(function (response) {
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

 var deleteCategory = function (parameters) {
        var deferred = $q.defer();
        apiService.delet("managecategory/deletecategory",parameters).then(function (response) {
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


    categoryService.getOwnedCategories = getOwnedCategories;
    categoryService.getExcutives = getExcutives;
    categoryService.deleteCategory = deleteCategory;
    categoryService.updatecategory = updateCategory;
    categoryService.getCategories = getCategories;
    categoryService.createCategory = createCategory;
    categoryService.getusers = getusers;
    categoryService.updatePriority = updatePriority;
    categoryService.updatescheduletime = updatescheduletime;
    categoryService.getschduledays = getschduledays;
    return categoryService;

}]);
