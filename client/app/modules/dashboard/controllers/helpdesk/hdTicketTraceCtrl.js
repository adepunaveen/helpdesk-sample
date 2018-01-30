/*var hdtickettracectrl = angular.module('hdtickettracectrl', ['ui.router', 'ngAnimate','ngMaterial','md.data.table','rzModule']);*/
dashboard.controller("hdtickettracectrl", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash','createTicketService','categoryService',
function ($rootScope, $scope, $state, $location, dashboardService, Flash,createTicketService,categoryservice) {

  $scope.open ="circle done"
  $scope.inprogress = "circle"
  $scope.closed = "circle"
  $scope.completed = "circle"
  $scope.query = "circle"
  

	
}]);