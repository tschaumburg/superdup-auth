// We'll save this before ui-router has a chance to start messing with it:
var pristineUrl = window.location.href;

// required for es6 async/await:
require("babel-core/register");
require("babel-polyfill");

import angular = require("angular");
import auth = require("superdup-auth-angular");
var uirouter = require("angular-ui-router");

var app = angular.module('superdup.auth.ngdemo', ['superdup.auth', 'ui.router']);

app.constant('pristineUrl', pristineUrl);
var authmodule = require("./init.auth");
var statemodule = require("./init.uirouter");





app.run(
    [
        '$state',
        'superdupAuthService',
        async function (
            $state: ng.ui.IStateService,
            superdupAuthService: auth.IAuthService
        )
        {
            try
            {
                var mylogin = superdupAuthService.getLogin("newauth0");

                $state.go("initializing");
                mylogin.onLoginSuccess =
                    (userdata) =>
                    {
                        $state.go("userpage");
                    };
                mylogin.onLoginError =
                    (reason) =>
                    {
                        $state.go("error");
                    };
                mylogin.onLogout =
                    () =>
                    {
                        $state.go("login");
                    };
                //mylogin.onLoadedFromCache =
                //    () =>
                //    {
                //        $state.go("userpage");
                //    };

                var isRedirect = await superdupAuthService.handleRedirect(pristineUrl)

                if (!isRedirect)
                {
                    // not a redirect - do we have cached credentials?
                    if (!!mylogin.user)
                        $state.go("userpage");
                    else
                        $state.go("login");
                }
            }
            catch (reason)
            {
                $state.go("error");
            }
        }
    ]
);
