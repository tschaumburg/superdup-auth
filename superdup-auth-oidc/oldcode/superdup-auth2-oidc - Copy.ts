//declare function sha256(message, options);
//declare namespace Oidc
//{
//    var WebStorageStateStore;
//    var UserManager;
//    var Log;
//}

namespace superdup.auth
{
    export interface IAuthService
    {
        connect(providerName: string, providerOptions: {}): IAuthContext;
    }

    export class AuthService implements IAuthService
    {
        public connect(providerName: string, providerOptions: {}): IAuthContext
        {
            if ("oidc-client" === providerName)
            {
                return new OidcAuthContext(providerOptions);
            }

            throw new Error("Unknown authentication provider " + providerName);
        }
    }

    export interface IAuthContext
    {
        login(): ng.IPromise<void>;
        logout(): ng.IPromise<void>;
        getIdToken(): string;

        acquireAccessToken(resource: string, scopes: string[], refresh: boolean): ng.IPromise<string>;
        getAccessToken(resource: string, minScopes: string[]): string;

        dispose(): void;
    }

    export enum LoginMechanism
    {
        popup = 0,
        redirect = 1,
        iframe = 2
    }

    export class OidcAuthContext implements IAuthContext
    {
        private log: any;
        private manager: Oidc.UserManager;//.UserManager;
        private loginMechanism: LoginMechanism;

        private static decideMechanism(): LoginMechanism
        {
            var browserInfo = superdup.webadmin.BrowserInfo.current();
            var browserName = browserInfo.browserName;
            var browserMajorVersion = browserInfo.majorVersion;

            var mechanism = LoginMechanism.popup;
            if (browserName === 'IE')
                mechanism = LoginMechanism.redirect;

            return mechanism;
        }

        public constructor(options: OidcOptions)
        {
            this.loginMechanism = OidcAuthContext.decideMechanism();
        }

        public login(data?: any): ng.IPromise<void>
        {
            switch (this.loginMechanism)
            {
                case LoginMechanism.popup:
                    return this.signinPopup(data);
                case LoginMechanism.redirect:
                    return this.signinRedirect(data);
                default:
                    throw new Error("Only popup and redirect login mechanisms are currently supported");
            }
        }

        private signinPopup(data: any): ng.IPromise<void>
        {
            this.log.verbose('Calling signinPopup()');

            var self = this;
            return this.manager
                .signinPopup()
                .then(() =>
                {
                    //this.superdupLoggingService.username = self.username;
                    self.log.verbose('signingPopup() succeeded');
                })
                .catch(function (error)
                {
                    self.log.info('signinPopup() failed: ' + JSON.stringify(error));
                });
        }

        private signinRedirect(data: any): ng.IPromise<void>
        {
            this.log.verbose('Calling signinRedirect()');

            var self = this;

            return this
                .manager
                .signinRedirect({ data: data })
                .catch(function (error)
                {
                    self.log.info('signinRedirect() failed: ' + JSON.stringify(error));
                });
        }

        public getIdToken(): string
        {
            var tokenStr = this.manager.getUser().id_token;
            if (!tokenStr)
                return null;

            //return this.jwtHelper.decodeToken(tokenStr);
            return tokenStr;
        }

        public logout(): ng.IPromise<void>
        {
            this.log.verbose('Calling signoutRedirect()');

            var self = this;
            this.manager
                .signoutRedirect()
                .then(() =>
                {
                    self._oidcUser = null;
                })
                .catch(function (error)
                {
                    self.log.info('signoutRedirect() failed: ' + JSON.stringify(error));
                });
        }


        public acquireAccessToken(resource: string, scopes: string[], refresh: boolean): ng.IPromise<string>
        {
        }

        public getAccessToken(resource: string, minScopes: string[]): string
        {
        }


        public dispose(): void
        {
        }

    }







    class XServiceProvider
    {
        public constructor(private oidcModule)
        { }

        public config(providerName: string, options: {}): void
        {
            if (providerName == "oidc")
            {
                if (this.oidcModule == null)
                    throw new Error("");

                this.factory = new OidcProvider();
                this.provider.config(options)
            }
        }
    }

    class OidcFactory
    {
        public config(): void
        {
        }

        public run()
        {
        }
    }
}