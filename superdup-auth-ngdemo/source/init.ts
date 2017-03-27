// We'll save this before ui-router has a chance to start messing with it:
var pristineUrl = window.location.href;
var angular = require("angular");

require("angular-ui-router");

var tt = require("superdup-auth-angular");
import auth = require("superdup-auth-angular");

var app =
    angular.module(
        'superdup.auth.ngdemo',
        [
            //'angular-jwt',
            'superdup.auth',
            'ui.router'
        ]
    );

var authmodule = require("./init.auth");
var statemodule = require("./init.uirouter");

app.config(
    [
        '$urlRouterProvider',
        '$stateProvider',
        '$locationProvider',
        'superdupAuthServiceProvider',
        //'$httpProvider',
        //'jwtOptionsProvider',
        function (
            $urlRouterProvider: ng.ui.IUrlRouterProvider,
            $stateProvider: any,
            $locationProvider: ng.ILocationProvider,
            authProvider: auth.AuthServiceProvider
            //$httpProvider: ng.IHttpProvider,
            //jwtOptionsProvider: any,
        )
        {
            authmodule.config(authProvider); //, $httpProvider, jwtOptionsProvider);

            // Get initial state for UI-Router:
            // ================================
            var uistate = null;
            console.info("pristineUrl: " + pristineUrl);
            var redirectState = authProvider.extractUserState(pristineUrl) as { uistate?: string, custom?: any };
            if (redirectState && redirectState.uistate)
                uistate = redirectState.uistate;

            $urlRouterProvider.otherwise(uistate || '/admin');

            statemodule.config($stateProvider, $urlRouterProvider, $locationProvider);
        }
    ]
);

app.run(
    [
        'superdupAuthService',
        function (
            superdupAuthService: auth.IAuthService
        )
        {
            authmodule.run(superdupAuthService, pristineUrl);
        }
    ]
);

