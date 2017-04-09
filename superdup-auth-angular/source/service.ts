import angular = require("angular");
import auth = require("superdup-auth-core");

export interface IAuthService
{
    //********************************************************************
    //* Login and logout:
    //* =================
    //* 
    //* 
    //********************************************************************
    login(loginName: string, accessTokenName: string, userstate?: any): ng.IPromise<void>;
    logout(loginName: string): ng.IPromise<void>;

    //********************************************************************
    //* Browsing:
    //* ==============
    //* Mostly for test and demo purposes
    //* 
    //********************************************************************
    getLoginNames(): string[];
    getLogin(loginName: string): auth.ILogin;

    //********************************************************************
    //* Resolving access tokens:
    //* ========================
    //* 
    //* 
    //********************************************************************
    resolveAccessToken(url: string): ng.IPromise<string>;
}

export class AuthService implements IAuthService
{
    constructor(
        private $injector: ng.auto.IInjectorService,
        private $q: ng.IQService,
        private readonly authManager: auth.ILoginManager,
        private readonly builder: auth.IBuilderManager,
        public log: auth.ILogger)
    {
    }

    //********************************************************************
    //* New API:
    //* ========
    //* 
    //* 
    //********************************************************************
    public login(loginName: string, accessTokenName: string, userstate: { uistate?: string, custom?: any } = null): ng.IPromise<void>
    {
        var deferred = this.$q.defer<void>();

        this.authManager.login(
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
            },
            this.log
        );

        return deferred.promise;
    }

    public logout(loginName: string): ng.IPromise<void>
    {
        var deferred = this.$q.defer<void>();

        this.authManager.logout2(loginName, this.log);

        return deferred.promise;
    }

    public getLoginNames(): string[]
    {
        return this.builder.getLoginNames();
    }

    public getLogin(loginName: string): auth.ILogin
    {
        return this.builder.getLogin(loginName);
    }

    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
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

    //private acquireAccessTokenFor(tokeninfo: interfaces.AccessTokenInfo): ng.IPromise<string>
    //{
    //    return this.$q.when(null);
    //}
}
