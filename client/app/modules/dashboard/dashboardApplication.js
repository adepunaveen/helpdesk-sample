    /*==========================================================
    Author      : Ranjithprabhu K
    Date Created: 24 Dec 2015
    Description : Base for Dashboard Application module

    Change Log
    s.no      date    author     description


 ===========================================================*/

var dashboard = angular.module('dashboard', ['ui.router', 'ngAnimate','ngMaterial','angularChart']);


dashboard.config(["$stateProvider", function ($stateProvider) {

    //dashboard home page state
    $stateProvider.state('app.dashboard', {
        url: '/dashboard',
      //  templateUrl: 'app/modules/dashboard/views/home.html',
        templateUrl: 'app/modules/dashboard/views/helpdesk/hduser_home.html',
        controller: 'hduserhome',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Home'
        }
    });


    //skills page state
    $stateProvider.state('app.skills', {
        url: '/skills',
        templateUrl: 'app/modules/dashboard/views/skills.html',
        controller: 'SkillController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Skills'
        }
    });

    //About Me page state
    $stateProvider.state('app.about', {
        url: '/about-me',
        templateUrl: 'app/modules/dashboard/views/about.html',
        controller: 'AboutController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'About Me'
        }
    });

    //Contact page state
    $stateProvider.state('app.contact', {
        url: '/contact',
        templateUrl: 'app/modules/dashboard/views/contact.html',
        controller: 'ContactController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Contact Me'
        }
    });

    //Search page state
    $stateProvider.state('app.search', {
        url: '/search',
        templateUrl: 'app/modules/dashboard/views/search.html',
        controller: 'appCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Search'
        }
    });

    // Ticket Create page state
     $stateProvider.state('app.createticket', {
        url: '/createticket',
        templateUrl: 'app/modules/dashboard/views/createticket.html',
        controller: 'createTicketCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'createticket'
        }
    });

     $stateProvider.state('app.hduserhome', {
        url: '/Home',
        templateUrl: 'app/modules/dashboard/views/helpdesk/hduser_home.html',
        controller: 'hduserhome',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Home'
        }
    });
      $stateProvider.state('app.hdtickettrace', {
        url: '/tickettrace',
        templateUrl: 'app/modules/dashboard/views/helpdesk/hdtickettrace.html',
        controller: 'hdtickettracectrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Ticket Trace'
        }
    });
      $stateProvider.state('app.managecategory', {
        url: '/managecategory',
        templateUrl: 'app/modules/dashboard/views/helpdesk/managecategory.html',
        controller: 'categoryctrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Manage Category'
        }
    });
    $stateProvider.state('app.assigntickets', {
        url: '/assignedtickets',
        templateUrl: 'app/modules/dashboard/views/helpdesk/assigntickets.html',
        controller: 'assignTicketCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Assigned Tickets'
        }
    });
    $stateProvider.state('app.mytickets', {
        url: '/mytickets',
        templateUrl: 'app/modules/dashboard/views/helpdesk/mytickets.html',
        controller: 'myTicketsCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'My Tickets'
        }
    });
    // Users page state
     $stateProvider.state('app.users', {
        url: '/users',
        templateUrl: 'app/modules/dashboard/views/users.html',
        controller: 'UserController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Manage Users'
        }
    });


    $stateProvider.state('app.managepriority', {
        url: '/managepriority',
        templateUrl: 'app/modules/dashboard/views/helpdesk/managepriority.html',
        controller: 'managepriorityCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Manage Priority'
        }
    });

    $stateProvider.state('app.managenotifications', {
        url: '/configurenotifications',
        templateUrl: 'app/modules/dashboard/views/helpdesk/managenotifications.html',
        controller: 'managenotificationCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Configure Notifications'
        }
    });

     $stateProvider.state('app.manageuserroles', {
        url: '/manageuserroles',
        templateUrl: 'app/modules/dashboard/views/helpdesk/manageuserroles.html',
        controller: 'manageuserrolesCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Manage User Roles'
        }
    });
    $stateProvider.state('app.managegrouptickets', {
        url: '/assignticket',
        templateUrl: 'app/modules/dashboard/views/helpdesk/managegrouptickets.html',
        controller: 'managegroupticketCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Assign Ticket'
        }
    });



}]);
