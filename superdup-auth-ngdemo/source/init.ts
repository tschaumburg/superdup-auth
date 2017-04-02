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
            $stateProvider: ng.ui.IStateProvider,
            $locationProvider: ng.ILocationProvider,
            authProvider: auth.AuthServiceProvider
            //$httpProvider: ng.IHttpProvider,
            //jwtOptionsProvider: any,
        )
        {
            var uistate = authmodule.config(authProvider, pristineUrl) as string;

            // Get initial state for UI-Router:
            // ================================
            //var uistate =
            //    authmodule.handleRedirect2(
            //        pristineUrl,
            //        (userstate: any) => { uistate = userstate; },
            //        (reason: string) => { /* not a redirect - which is OK */ }
            //    ) as string;
            //console.info("pristineUrl: " + pristineUrl);
            //var redirectState = authProvider.extractUserState(pristineUrl) as { uistate?: string, custom?: any };
            //if (redirectState && redirectState.uistate)
            //    uistate = redirectState.uistate;

            $urlRouterProvider.otherwise(uistate || '/admin');

            statemodule.config($stateProvider, $urlRouterProvider, $locationProvider);
        }
    ]
);

app.run(
    [
        '$urlRouter',
        '$state',
        '$location',
        'superdupAuthService',
        function (
            $urlRouterProvider: ng.ui.IUrlRouterService,
            $stateProvider: ng.ui.IStateService,
            $locationProvider: ng.ILocationService,
            superdupAuthService: auth.IAuthService
        )
        {
            
            authmodule.run2(superdupAuthService, pristineUrl);
                //.then(
                //(userstate: any) =>
                //{
                //    $stateProvider.go('landingpage');
                //})
                //.catch((reason: any) => { /* not a redirect - never mind */ });
        }
    ]
);

