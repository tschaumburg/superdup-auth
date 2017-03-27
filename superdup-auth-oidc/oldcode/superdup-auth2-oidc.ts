//declare function sha256(message, options);
//declare namespace Oidc
//{
//    var WebStorageStateStore;
//    var UserManager;
//    var Log;
//}

namespace superdup.auth2 {
    export enum LoginMechanism {
        popup = 0,
        redirect = 1,
        iframe = 2
    }

    export class OidcOptions {
        public metadataUrl: string;
        public protectedDomains: string[];
        public issuer: string;
        public clientId: string;
        public redirectUri: string;
        public post_logout_redirect_uri: string;
        public scope: string;
    }

    export class OidcModule implements IAuthModule<OidcOptions>
    {
        public constructor(
            //private readonly $injector: ng.auto.IInjectorService
        ) { }

        private readonly idps: { [id: string]: OidcIdentityProvider; } = {};
        public create($injector: ng.auto.IInjectorService, identityProviderName: string, flow: AuthFlow, providerOptions: {}, log: ILogger): IIdentityProvider {
            if (!!this.idps[identityProviderName])
                throw new Error("Identity provider " + identityProviderName + " has already been registered");

            var idp = new OidcIdentityProvider(providerOptions, log, $injector.get<ng.IQService>("$q"));
            this.idps[identityProviderName] = idp;

            return idp;
        }

        private findIdp(idpName: string): OidcIdentityProvider {
            return this.idps[idpName];
        }

        public login(
            $injector: ng.auto.IInjectorService,
            accessTokenManager: IAccessTokenManager,
            identityProviderName: string,
            state: any,
            identityProviderOptions: OidcOptions,
            redirectUrl: string,
            log: ILogger
        ): ng.IPromise<void> {
            state.idp = identityProviderName;

            var idp = this.findIdp(identityProviderName);
            if (!idp)
                return $injector.get<ng.IQService>("$q").when();

            return idp.login(state);
        }

        public handleRedirect(
            $injector: ng.auto.IInjectorService,
            accessTokenManager: IAccessTokenManager,
            state: any,
            identityProviderOptions: OidcOptions,
            redirectUrl: string,
            log: ILogger
        ): ng.IPromise<void> {
            var idpName = getUrlParameterValue(redirectUrl, "sdp:idp");
            if (!idpName)
                return $injector.get<ng.IQService>("$q").when(null);

            var idp = this.findIdp(idpName);
            if (!idp)
                return $injector.get<ng.IQService>("$q").when(null);

            return idp.handleRedirect(redirectUrl);
        }
    }

    export class OidcIdentityProvider implements IIdentityProvider {
        //private manager: Oidc.UserManager;
        private _oidcUser: any;
        //private loginMechanism: LoginMechanism;

        //private static decideMechanism(): LoginMechanism {
        //    var browserInfo = superdup.webadmin.BrowserInfo.current();
        //    var browserName = browserInfo.browserName;
        //    var browserMajorVersion = browserInfo.majorVersion;

        //    var mechanism = LoginMechanism.popup;
        //    if (browserName === 'IE')
        //        mechanism = LoginMechanism.redirect;

        //    return mechanism;
        //}

        public constructor(options: {}, private log: ILogger, private $q: ng.IQService) {
            var oidcOptions = <OidcOptions>options;

            Oidc.Log.logger =
                {
                    error(args: any[]) { log.error(args); },
                    warn(args: any[]) { log.info(args); },
                    info(args: any[]) { log.trace(args); }
                };

            //this.loginMechanism = OidcIdentityProvider.decideMechanism();

            //// point the redirectUri back here (lose the hash fragment, though)
            //var currentUrl = window.location.href;
            //var index = currentUrl.indexOf('#');
            //if (index > 0)
            //    currentUrl = currentUrl.substring(0, index);

            //this.manager =
            //    new Oidc.UserManager(
            //        {
            //            authority: oidcOptions.issuer,                        // "https://login.microsoftonline.com/superdup.onmicrosoft.com/v2.0/"
            //            metadataUrl: oidcOptions.metadataUrl,                 // "https://localhost/SuperDup.WebAdmin/api/Metadata"
            //            client_id: oidcOptions.clientId,                      // "37700246-3a66-4a42-8109-498458d2f7a3"
            //            scope: oidcOptions.scope,                             // "openid email profile 37700246-3a66-4a42-8109-498458d2f7a3"
            //            response_type: 'token id_token',                       // 'token id_token'
            //            popup_redirect_uri: oidcOptions.redirectUri || currentUrl, // currentUrl
            //            redirect_uri: oidcOptions.redirectUri || currentUrl,       // currentUrl
            //            silent_redirect_uri: currentUrl,                       // currentUrl
            //            post_logout_redirect_uri: oidcOptions.post_logout_redirect_uri || currentUrl, // currentUrl 
            //            // Setup to renew token access automatically
            //            automaticSilentRenew: true,
            //            silentRequestTimeout: 5000,
            //            // Add expiration nofitication time
            //            accessTokenExpiringNotificationTime: 20,
            //            filterProtocolClaims: true,
            //            userStore: new Oidc.WebStorageStateStore({ store: localStorage })
            //        });
        }

        public login(data?: any): ng.IPromise<void> {
            //switch (this.loginMechanism) {
            //    case LoginMechanism.popup:
            //        return this.signinPopup(data);
            //    case LoginMechanism.redirect:
            //        return this.signinRedirect(data);
            //    default:
            //        throw new Error("Only popup and redirect login mechanisms are currently supported");
            //}
        }

        //private signinPopup(data: any): ng.IPromise<void> {
        //    this.log.trace('Calling signinPopup()');

        //    var self = this;
        //    return this.manager
        //        .signinPopup()
        //        .then(() => {
        //            //this.superdupLoggingService.username = self.username;
        //            self.log.trace('signingPopup() succeeded');
        //        })
        //        .catch(function (error) {
        //            self.log.info('signinPopup() failed: ' + JSON.stringify(error));
        //        });
        //}

        //private signinRedirect(data: any): ng.IPromise<void> {
        //    this.log.trace('Calling signinRedirect()');

        //    var self = this;

        //    return this
        //        .manager
        //        .signinRedirect({ data: data })
        //        .catch(function (error) {
        //            self.log.info('signinRedirect() failed: ' + JSON.stringify(error));
        //        });
        //}

        public getIdToken(): string {
            var tokenStr = this.manager.getUser().id_token;
            if (!tokenStr)
                return null;

            //return this.jwtHelper.decodeToken(tokenStr);
            return tokenStr;
        }

        //public logout(): ng.IPromise<void> {
        //    this.log.trace('Calling signoutRedirect()');

        //    var self = this;
        //    return this.manager
        //        .signoutRedirect()
        //        .then(() => {
        //            self._oidcUser = null;
        //        })
        //        .catch(function (error) {
        //            self.log.info('signoutRedirect() failed: ' + JSON.stringify(error));
        //        });
        //}

        public acquireAccessToken(resource: string, scopes: string[], refresh: boolean): ng.IPromise<string> {
            //return this.$q.reject("Not implemented");
        }

        public getAccessToken(resource: string, minScopes: string[]): string {
            throw new Error("Not implemented");
        }

        public getAccessTokenFor(url: string): string {
            throw new Error("Not implemented");
        }

        handleRedirect(url: string): ng.IPromise<void> {
            //return this
            //    .manager
            //    .signinRedirectCallback(url)
            //    .then((user) => {
            //        //return user.state;
            //    });
        }

        public dispose(): void {
        }

    }

}