import ngui = require("angular-ui-router");
import ng = require("angular");
import router = require("angular-ui-router");
import views = require("./views");

var angular = require("angular");

angular
    .module('superdup.auth.ngdemo')
    .config(
    [
        '$urlRouterProvider',
        '$stateProvider',
        'superdupAuthServiceProvider',
        function (
            $urlRouterProvider: ng.ui.IUrlRouterProvider,
            $stateProvider: ng.ui.IStateProvider,
            $locationProvider: ng.ILocationProvider
        )
        {

            // UI-Router config:
            // =================
            $urlRouterProvider.otherwise('/initializing');

            var viewBase = "views";
            $stateProvider
                .state('initializing', {
                    url: '/initializing',
                    templateUrl: viewBase + '/initializing.html',
                    controller: 'InitializingController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: viewBase + '/login.html',
                    controller: 'LoginController'
                })
                .state('error', {
                    url: '/error',
                    templateUrl: viewBase + '/error.html',
                    controller: 'ErrorController'
                })
                .state('userpage', {
                    url: "/userpage",
                    templateUrl: viewBase + "/userpage.html",
                    controller: 'UserPageController'
                });
        }
    ]
);

