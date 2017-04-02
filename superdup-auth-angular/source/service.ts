import angular = require("angular");
import auth = require("superdup-auth-core");

export interface IAuthService
{
    login2(loginName: string, accessTokenName: string, userstate?: any): ng.IPromise<void>;
    //handleRedirect2(url: string): ng.IPromise<any>;
    logout2(loginName: string): ng.IPromise<void>;

    //********************************************************************
    //* Redirect handling:
    //* ==================
    //* Redirect URLs are expected to be of the form
    //* 
    //*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    //* 
    //* where
    //*    https://host/whatever is the registered URL
    //*    "sdp:auth=oidc"       identifies the auth module
    //*    "#..."                is the has fragment carrying 
    //*                          the auth result
    //* 
    //********************************************************************
    readonly user: auth.UserInfo;

    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    getAccessTokens(): { tokenName: string, tokenValue: string }[];
    getAccessTokenFor(url: string): ng.IPromise<string>;
}

export class AuthService implements IAuthService
{
    constructor(
        private $injector: ng.auto.IInjectorService,
        private $q: ng.IQService,
        private readonly authManager: auth.IAuthManager,
        public log: auth.ILogger)
    {
    }

    public get user(): auth.UserInfo
    {
        return this.authManager.userManager.user;
    }

    //********************************************************************
    //* New API:
    //* ========
    //* 
    //* 
    //********************************************************************
    public login2(loginName: string, accessTokenName: string, userstate: { uistate?: string, custom?: any } = null): ng.IPromise<void>
    {
        var deferred = this.$q.defer<void>();

        this.authManager.login2(
            loginName,
            accessTokenName,
            userstate,
            (user, state) =>
            {
                deferred.resolve();
            },
            (reason, state) =>
            {
                deferred.reject(reason);
            }
        );

        return deferred.promise;
    }

    public logout2(loginName: string): ng.IPromise<void>
    {
        var deferred = this.$q.defer<void>();

        this.authManager.logout2(loginName);

        return deferred.promise;
    }


    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    public getAccessTokens(): {tokenName: string, tokenValue: string}[]
    {
        return this.authManager.tokenManager.getAccessTokens();
    }

    public getAccessTokenFor(url: string): ng.IPromise<string>
    {
        var deferred = this.$q.defer<string>();

        this.authManager
            .tokenManager
            .getAccessTokenFor(
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

    //private acquireAccessTokenFor(tokeninfo: interfaces.AccessTokenInfo): ng.IPromise<string>
    //{
    //    return this.$q.when(null);
    //}
}
