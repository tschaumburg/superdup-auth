//declare function sha256(message, options);
//declare namespace Oidc
//{
//    var WebStorageStateStore;
//    var UserManager;
//    var Log;
//}

namespace superdup.auth2
{
    export interface IAuthServiceProvider extends ng.IServiceProvider
    {
        config(url: string): void;

        registerAuthModule<TOptions>(
            moduleName: string,
            authModule: IAuthModule<TOptions>
        ): void;

        registerIdentityProvider<TOptions>(
            authModuleName: string,
            identityProviderName: string,
            providerOptions: TOptions
        ): void;

        registerAccessToken(
            authModuleName: string,
            identityProviderName: string,
            tokenName: string,
            resource: string,
            scopes: string[],
            protectUrls: string[]
        ): void;

        module<TOptions>(moduleName: string, authModule: IAuthModule<TOptions>): IModuleHelper<TOptions>;
    }

    export interface IModuleHelper<TOptions>
    {
        identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>;
    }

    export interface IIdentityProviderHelper<TOptions>
    {
        identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>;
        accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IIdentityProviderHelper<TOptions>;
    }

    export interface IAuthService
    {
        login(authModuleName: string, identityProviderName: string, data?: any): ng.IPromise<void>;
        handleRedirect(): ng.IPromise<any>;

        //identityProvider(authModuleName: string, identityProviderName: string): IIdentityProvider;
    }

    export interface IAccessTokenManager
    {
        getByName(moduleName: string, identityProviderName: string, accessTokenName: string): AccessTokenInfo;
        getByProvider(moduleName: string, identityProviderName: string): { name: string, info: AccessTokenInfo }[];
        getByUrl(url: string): AccessTokenInfo;
    }

    export interface IAuthModule<TOptions>
    {
        login(
            $injector: ng.auto.IInjectorService,
            accessTokenManager: IAccessTokenManager,
            identityProviderName: string,
            state: any,
            identityProviderOptions: TOptions,
            redirectUrl: string,
            log: ILogger
        ): ng.IPromise<void>;

        handleRedirect(
            $injector: ng.auto.IInjectorService,
            accessTokenManager: IAccessTokenManager,
            state: any,
            identityProviderOptions: TOptions,
            redirectUrl: string,
            log: ILogger
        ): ng.IPromise<void>;
    }

    export interface IIdentityProvider
    {
        login(state?: string): ng.IPromise<void>;
        logout(): ng.IPromise<void>;
        getIdToken(): string;

        acquireAccessToken(resource: string, scopes: string[], refresh: boolean): ng.IPromise<string>;

        dispose(): void;
    }

    export interface ILogger
    {
        error(message?: any, ...optionalParams: any[]): void;
        warn(message?: any, ...optionalParams: any[]): void;
        log(message?: any, ...optionalParams: any[]): void;
        info(message?: any, ...optionalParams: any[]): void;
        debug(message?: string, ...optionalParams: any[]): void;
        trace(message?: any, ...optionalParams: any[]): void;
    }
}
