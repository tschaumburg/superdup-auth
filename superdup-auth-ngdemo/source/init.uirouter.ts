import ngui = require("angular-ui-router");
import ng = require("angular");
import router = require("angular-ui-router");
import views = require("./views");

export function config(
    $stateProvider: ngui.IStateProvider,
    $urlRouterProvider: ngui.IUrlRouterProvider,
    $locationProvider: ng.ILocationProvider,
	initialState: string = null
)
{
    var viewBase = "views";

    // UI-Router config:
    // =================
    $urlRouterProvider.otherwise(initialState || '/landingpage');

    $stateProvider
        .state('landingpage', {
            url: '/landingpage',
            templateUrl: viewBase + '/landingpage.html',
            controller: 'LandingPageController'
        })
        .state('adminpage', {
            url: '/adminpage',
            templateUrl: viewBase + '/adminpage.html',
            controller: 'AdminController'
        })
        .state('userpage', {
            url: "/userpage",
            templateUrl: viewBase + "/userpage.html",
            controller: 'UserController'
        });
}
