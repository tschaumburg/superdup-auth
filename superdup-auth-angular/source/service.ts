import angular = require("angular");
import auth = require("superdup-auth-core");

export interface IAuthService
{
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
    login(userstate?: any): ng.IPromise<void>;
    handleRedirect(url: string): ng.IPromise<any>;
    readonly user: auth.UserInfo;

    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
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

    public login(userstate: {uistate?: string, custom?: any} = null): ng.IPromise<void>
    {
        var deferred = this.$q.defer<void>();

        this.authManager.login(
            //null,
            //null,
            userstate,
            (user, state) =>
            {
                this._user = user;
                deferred.resolve();
            },
            (reason, state) =>
            {
                this._user = null;
                deferred.reject(reason);
            }
        );

        return deferred.promise;
    }

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
    public handleRedirect(url: string): ng.IPromise<any>
    {
        var deferred = this.$q.defer<any>();

        this.authManager.handleRedirect(
            url,
            (user, state) =>
            {
                this._user = user;
                deferred.resolve(state);
            },
            (reason, state) =>
            {
                this._user = null;
                deferred.reject(reason);
            }
        );

        return deferred.promise;
    }

    private _user: auth.UserInfo = null;
    public get user(): auth.UserInfo
    {
        return this._user;
    }


    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
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
