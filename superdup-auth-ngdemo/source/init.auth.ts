import ng = require("angular");
import auth = require("superdup-auth-angular");
import auth0js = require("superdup-auth-auth0js");
var authSecrets = require("./auth-secrets.json");

import { IAuthServiceProvider } from "superdup-auth-angular";
var angular = require("angular");

angular
    .module('superdup.auth.ngdemo')
    .config(
    [
        'superdupAuthServiceProvider',
        function (
            authProvider: auth.AuthServiceProvider
        )
    {
        var authBuilder = authProvider.config;

        // Define accesss tokens:
        // ======================
        var editBoardsToken =
            authBuilder
                .token("https://api.superdup.dk", ["read:boards", "edit:boards"])
                .registerAs("superdupApi");


        // Define the login(s) providing the tokens:
        // =========================================
        var myImplicitLogin =
            authBuilder
                .implicitLogin<auth0js.Auth0jsOptions>(auth0js.Auth0Implicit)
                .withOptions(
                    {
                        domain: authSecrets.auth0.domain,
                        clientId: authSecrets.auth0.clientId,
                        redirectUri: "http://localhost:58378", //authConf.redirectUri,
                        flow: auth0js.AuthFlow.implicit,
                    })  
                .registerAs("newauth0");

        var myHybridLogin =
            authBuilder
                .hybridLogin<auth0js.Auth0jsOptions>(auth0js.Auth0Hybrid)
                .withOptions(
                    {
                        domain: authSecrets.auth0.domain,
                        clientId: authSecrets.auth0.clientId,
                        redirectUri: "http://localhost:58378", //authConf.redirectUri,
                        flow: auth0js.AuthFlow.implicit,
                })
                .accessToken(editBoardsToken)
                .registerAs("xxxx");

        // Specify the URLS requirig the tokens:
        // =====================================
        authBuilder
            .api("https://api.superdup.dk/boards")
            .requiresToken(editBoardsToken)
            .providedBy(myHybridLogin)
            .registerAs("boardApi");

            ////.accessToken(
            ////    "userinfo",
            ////    "https://schaumburgit.auth0.com/userinfo",
            ////    [],
            ////    [
            ////        "https://api.superdup.dk/whoami"
            ////    ]
            ////)
            ////.setDefault("auth0js", "auth0", "localSuperdupApi")
            //.registerAs("newauth0")
            //;

        var state = authProvider.config.toString();
        authProvider.config.verify();
    }
    ]
    );
