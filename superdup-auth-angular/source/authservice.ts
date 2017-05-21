import angular = require("angular");
import auth = require("superdup-auth-core");

export interface IAuthService
{
    getLogin(loginName: string): auth.ILogin2;
    handleRedirect(url: string): boolean;// Promise<RedirectInfo>;
    resolveAccessToken(url: string): ng.IPromise<string>;
}

export interface RedirectInfo
{
    error: RedirectError;
    success: RedirectSuccess;
}

export interface RedirectError
{
    providerError: any;
    userMessage: string;
}

export interface RedirectSuccess
{
    userState: any;
}

export class AuthService implements IAuthService
{
    constructor(
        private $injector: ng.auto.IInjectorService,
        private $q: ng.IQService,
        private readonly authManager: auth.IAuthenticationManager,
        public log: auth.ILog)
    {
    }

    public getLogin(loginName: string): auth.ILogin2
    {
        return this.authManager.getLogin(loginName);
    }

    public handleRedirect(url: string): boolean //Promise<RedirectInfo> 
    {
        return this.authManager.handleRedirect(url, null, null);
        //return new Promise<RedirectInfo>(
        //    (resolve, reject) =>
        //    {
        //        this.authManager.handleRedirect(
        //            url,
        //            (loginName, user, state) =>
        //            {
        //                resolve({ success: { userState: state }, error: null});
        //            },
        //            () =>
        //            {
        //                resolve(null);
        //            },
        //            (loginName, reason, state) =>
        //            {
        //                resolve({ error: {providerError: reason, userMessage: "Login failed"}, success: null });
        //            }
        //        );
        //    }
        //);
    }

    public resolveAccessToken(url: string): ng.IPromise<string>
    {
        var deferred = this.$q.defer<string>();

        this.authManager
            .resolveAccessToken(
                url,
                (token) =>
                {
                    deferred.resolve(token);
                },
                (reason) =>
                {
                    deferred.reject(reason);
                }
            );

        return deferred.promise;
    }
}
