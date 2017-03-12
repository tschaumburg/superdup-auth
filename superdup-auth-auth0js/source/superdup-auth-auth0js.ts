import { Auth0jsOptions, AuthFlow } from "./options";
export { Auth0jsOptions, AuthFlow };
export * from "./identityprovider";
export * from "./plugin";

//import plugin = require("./plugin");
//import options = require("./options");
//import identityprovider = require("./identityprovider");

//export type Auth0jsPlugin = plugin.Auth0jsPlugin;
//export type Auth0jsOptions = options.Auth0jsOptions;
//export type AuthFlow = options.AuthFlow;

/////// <reference types="auth0-js" />
////declare function sha256(message, options);
////declare namespace Oidc
////{
////    var WebStorageStateStore;
////    var UserManager;
////    var Log;
////}
/////<reference types='angular'/>
/////<reference types='auth0-js'/>
/////<reference types='superdup-auth'/>
///////<reference types='auth0'/>
//import angular = require("angular");
//import sdpAuth = require("superdup-auth-core");
//var x = sdpAuth.pluginManager;
////import * as d from 'superdup-auth';
////import auth0js = require('auth0-js');
////var tmp: d.CC = new d.CC();

//declare namespace auth0
//{
//    // See https://auth0.com/docs/libraries/auth0js,
//    // section "Initialization"
//    export interface WebAuthOptions
//    {
//        domain: string;
//        clientID: string;
//        redirectUri?: string;
//        scope?: string;
//        audience?: string;
//        responseType?: string;
//        responseMode?: string;
//        _disableDeprecationWarnings?: boolean;
//    }

//    export interface AuthorizeOptions
//    {
//        domain: string;
//        clientID: string;
//        redirectUri?: string;
//        scope?: string;
//        audience?: string;
//        responseType?: string;
//        responseMode?: string;
//        connection?: string; // eg. 'facebook'
//        _disableDeprecationWarnings?: boolean;
//        // only visible in tests?:
//        state?: string,
//        nonce?: string,
//    }

//    export class WebAuth
//    {
//        constructor(options: WebAuthOptions);

//        /**
//         * To login via the hosted login page, use the authorize method.
//         *
//         * This redirects to the hosted login page to initialize an
//         * authN/authZ transaction.
//         *
//         * Note that the same authorize method can be used with a
//         * 'connection' parameter to facilitate social connection logins,
//         * as well.


//         * @param options
//         */
//        authorize(options: AuthorizeOptions): void;

//        /**
//         * Parse the url hash and extract the returned tokens depending on the transaction.
//         *
//         * Only validates id_tokens signed by Auth0 using the RS256 algorithm using the public key exposed
//         * by the `/.well-known/jwks.json` endpoint. Id tokens signed with other algorithms will not be
//         * accepted.
//         *
//         * @method parseHash
//         * @param {Object} options:
//         * @param {String} options.state [OPTIONAL] to verify the response
//         * @param {String} options.nonce [OPTIONAL] to verify the id_token
//         * @param {String} options.hash [OPTIONAL] the url hash. If not provided it will extract from window.location.hash
//         * @param {Function} cb: function(err, token_payload)
//         */
//        parseHash(options: ParseHashOptions, cb: (error: ParseHashError, token_payload: TokenPayload) => any): void;

//        /**
//         * Redirects to the auth0 logout page
//         *
//         * @method logout
//         * @param {Object} options: https://auth0.com/docs/api/authentication#!#get--v2-logout
//         */
//        logout(options: LogoutOptions): void;
//    }

//    export interface LogoutOptions
//    {
//        clientID?: string;
//        returnTo: string;
//    }

//    export interface ParseHashError
//    {
//        error: string;
//        errorDescription: string;
//        state?: string;
//    }

//    export interface ParseHashOptions
//    {
//        state?: string;
//        nonce?: string;
//        hash?: string;
//    }

//    export interface TokenPayload
//    {
//        accessToken: string;
//        idToken: string;
//        idTokenPayload: string;
//        appStatus: string;
//        refreshToken: string;
//        state: string;
//        expiresIn: string;
//        tokenType: string;
//    }
//}

//import Auth0jsOptions = require("./options");

//export class Auth0jsModule implements sdpAuth.IAuthModule<Auth0jsOptions>
//    {
//        public constructor() 
//        {};

//        private readonly idps: { [id: string]: Auth0jsIdentityProvider; } = {};
//        private _create(
//            $injector: ng.auto.IInjectorService,
//            accessTokenManager: sdpAuth.IAccessTokenManager,
//            identityProviderName: string,
//            providerOptions: Auth0jsOptions,
//            log: sdpAuth.ILogger
//        ): Auth0jsIdentityProvider
//        {
//            var idp = this.idps[identityProviderName];

//            if (!idp)
//            {
//                idp =
//                    new Auth0jsIdentityProvider(
//                        $injector,
//                        accessTokenManager,
//                        providerOptions,
//                        log
//                    );
//                this.idps[identityProviderName] = idp;
//            }

//            return idp;
//        }

//    }

//    export class Auth0jsIdentityProvider implements sdpAuth.IIdentityProvider
//    {
//        private readonly $q: ng.IQService;
//        private webauth: auth0.WebAuth;
//        public constructor(
//            private $injector: ng.auto.IInjectorService,
//            private readonly accessTokenManager: sdpAuth.IAccessTokenManager,
//            private readonly options: Auth0jsOptions,
//            private log: sdpAuth.ILogger
//        )
//        {
//            this.$q = $injector.get<ng.IQService>("$q");
//        }

//        isConnected(): boolean
//        {
//            return (!!this.webauth);
//        }

//        connect(): void
//        {
//            if (!this.webauth)
//                this.webauth =
//                    new auth0.WebAuth(
//                        {
//                            clientID: this.options && this.options.clientId,
//                            domain: this.options && this.options.domain,
//                            audience: 'https://api.superdup.dk',
//                            responseType: 'token',
//                            redirectUri: this.options.redirectUri,
//                        }
//                    );
//        }

            
//        handleRedirect(
//            $injector: ng.auto.IInjectorService,
//            state: any,
//            accessTokenManager: sdpAuth.IAccessTokenManager,
//            redirectUrl: string
//        ): ng.IPromise<void>
//        {
//            var authModuleName = state.mod as string;
//            var identityProviderName = state.idp as string;
//            var accessTokenName = state.at as string;

//            var accessTokenInfo: sdpAuth.AccessTokenInfo = null;
//            if (!!accessTokenName)
//            {
//                accessTokenInfo = this.accessTokenManager.getByName(authModuleName, identityProviderName, accessTokenName);
//            }

//            //var currentHash = window.location.hash;
//            var redirectHash: string = sdpAuth.utils.parseUrl(redirectUrl).fragment as string;
//            //window.location.hash = redirectHash;

//            var $q = $injector.get<ng.IQService>("$q");
//            var deferred = $q.defer<void>();

//            if (!this.isConnected())
//                this.connect();

//            this.webauth.parseHash(
//                {
//                    hash: redirectHash,
//                    nonce: "x",
//                    state: undefined
//                },
//                (err: auth0.ParseHashError, data: auth0.TokenPayload) =>
//                {
//                    console.log(err, data);
//                    if (err)
//                    {
//                        deferred.reject(err);
//                        return;
//                    }
//                    if (data)
//                    {
//                        if (data.accessToken)
//                        {
//                            if (!!accessTokenInfo)
//                            {
//                                accessTokenInfo.token = data.accessToken;
//                                accessTokenInfo.expiresAt = sdpAuth.utils.getExpiration(data.accessToken);
//                            }
//                            //this.getAccessTokenFor.webauth.client.userInfo(data.accessToken, htmlConsole.dumpCallback.bind(htmlConsole));
//                        }
//                    }
//                    //window.location.hash = '';
//                    deferred.resolve();
//                }
//            );
//            return deferred.promise;
//        }

//        login(state: any): ng.IPromise<void>
//        {
//            var deferred = this.$q.defer<void>();

//            var moduleName = state.mod as string;
//            var providerName = state.idp as string;
//            var tokeninfos = this.accessTokenManager.getByProvider(moduleName, providerName) || [];

//            if (this.options.flow == sdpAuth.AuthFlow.implicit)
//            {
//                // Implicit flow only handles a single token:
//                if (tokeninfos.length > 1)
//                {
//                    deferred.reject("Implicit flow only handles a single token");
//                    return deferred.promise;
//                }

//                var audience: string = undefined;
//                var scope: string = undefined;
//                if (tokeninfos.length == 1)
//                {
//                    state.at = tokeninfos[0].name;
//                    audience = tokeninfos[0].info.resource; // 'https://api.superdup.dk' 
//                    scope = tokeninfos[0].info.scopes.join(" "); // 'read:boards edit:boards' 
//                }
//                var encodedState = JSON.stringify(state);
//                //this.lock.show({ auth: { params: { state: encodedState, scope: "openid" } } });

//                if (!this.isConnected())
//                    this.connect();

//                this.webauth.authorize(
//                    {
//                        domain: this.options && this.options.domain,
//                        clientID: this.options && this.options.clientId,
//                        audience: audience,
//                        scope: scope,
//                        state: encodedState,
//                        responseType: 'id_token token',
//                        redirectUri: this.options.redirectUri,
//                        nonce: "x",
//                    }
//                );
//            }
//            else
//            {
//                deferred.reject("Unsupported auth flow " + this.options.flow + " requested");
//            }
//            return deferred.promise;
//        }

//        public getIdToken(): string
//        {
//            var tokenStr = localStorage.getItem('id_token');
//            if (!tokenStr)
//                return null;

//            //return this.jwtHelper.decodeToken(tokenStr);
//            return tokenStr;
//        }

//        public logout(): ng.IPromise<void>
//        {
//            this.webauth.logout({ returnTo: this.options.redirectUri});
//            localStorage.removeItem("id_token");
//            return this.$q.reject("Not implemented");
//        }

//        public acquireAccessToken(resource: string, scopes: string[], refresh: boolean): ng.IPromise<string>
//        {
//            return this.$q.reject("Not implemented");
//        }

//        public getAccessToken(resource: string, minScopes: string[]): string
//        {
//            throw new Error("Not implemented");
//        }

//        public getAccessTokenFor(url: string): string
//        {
//            throw new Error("Not implemented");
//        }

//        public dispose(): void
//        {
//        }

//    }







//    //class XServiceProvider
//    //{
//    //    public constructor(private oidcModule)
//    //    { }

//    //    public config(providerName: string, options: {}): void
//    //    {
//    //        if (providerName == "oidc")
//    //        {
//    //            if (this.oidcModule == null)
//    //                throw new Error("");

//    //            this.factory = new OidcProvider();
//    //            this.provider.config(options)
//    //        }
//    //    }
//    //}

//    //class OidcFactory
//    //{
//    //    public config(): void
//    //    {
//    //    }

//    //    public run()
//    //    {
//    //    }
//    //}

