import ng = require("angular");
import auth = require("superdup-auth-angular");
import auth0js = require("superdup-auth-auth0js");
var authSecrets = require("./auth-secrets.json");

import { IAuthServiceProvider } from "superdup-auth-angular";
//export function config(
//    authProvider: auth.AuthServiceProvider
//)
//{
//    {
//        authProvider
//            .setLog(console)
//            .registerPlugin("auth0js", new auth0js.Auth0jsPlugin())
//            .identityProvider(
//                "auth0",
//                {
//                    domain: authSecrets.auth0.domain,
//                    clientId: authSecrets.auth0.clientId,
//                    redirectUri: "http://localhost:58378", //authConf.redirectUri,
//                    flow: auth0js.AuthFlow.implicit,
//                }
//            )
//            //.accessToken(
//            //    "superdupApi",
//            //    "https://api.superdup.dk",
//            //    [
//            //        "read:boards",
//            //        "edit:boards"
//            //    ],
//            //    [
//            //        "https://api.superdup.dk/boards",
//            //        "https://api.superdup.dk/boards/long"
//            //    ]
//            //)
//            .accessToken(
//                "localSuperdupApi",
//                "https://localhost/SuperDup.API",
//                [
//                    "read:boards",
//                    "edit:boards"
//                ],
//                [
//                    "https://localhost/SuperDup.API"
//                ]
//            )
//            //.accessToken(
//            //    "userinfo",
//            //    "https://schaumburgit.auth0.com/userinfo",
//            //    [],
//            //    [
//            //        "https://api.superdup.dk/whoami"
//            //    ]
//            //)
//            .setDefault("auth0js", "auth0", "localSuperdupApi");
//    }
//}

export function config(
    authProvider: IAuthServiceProvider,
    url: string
): any
{
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

        return authProvider.handleRedirect(url, null, null);
    }
}

//export function run(
//    superdupAuthService: auth.IAuthService,
//    currentUrl: string
//): void
//{
//    var self = this;
//    superdupAuthService
//        .handleRedirect(currentUrl)
//        .then((userstate: any) => { })
//        .catch((reason) => { /* not a redirect - never mind */ });
//}

export function run2(
    superdupAuthService: auth.IAuthService,
    currentUrl: string
): void
{
    //var self = this;
    //return superdupAuthService
    //    .handleRedirect2(currentUrl);
}
