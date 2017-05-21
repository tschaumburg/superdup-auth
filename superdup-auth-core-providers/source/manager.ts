import logging = require("superdup-auth-log");
import { IProviderManager, IProviderAdapter } from "./imanager";
import { IImplicitProvider } from "./iimplicit";
import { IAuthcodeProvider } from "./iauthcode";
import { IHybridProvider } from "./ihybrid";
import { IBaseProvider } from "./ibase";
import { UserInfo } from "./userinfo";

export function createProviderManager(log: logging.ILog): IProviderManager
{
    return new ProviderManager(log);
}

class ProviderManager implements IProviderManager
{
    constructor(private readonly _log: logging.ILog)
    { }

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _flows: { [id: string]: IProviderAdapter; } = {};

    public registerImplicitProvider(
        loginName: string,
        creator: () => IImplicitProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] }
    ): IProviderAdapter 
    {
        this._log.debug("Registering authentication flow \"" + loginName + "\"");

        var res = new ImplicitProviderAdapter(creator, idScopes, requestAccessToken);// { creator: creator, flow: null };
        this._flows[loginName] = res;

        return res;
    }

    public registerAuthcodeProvider(
        loginName: string,
        creator: () => IAuthcodeProvider,
        requestRefreshToken: boolean
    ): IProviderAdapter 
    {
        this._log.debug("Registering code flow \"" + loginName + "\"");

        var res = new AuthcodeProviderAdapter(creator, requestRefreshToken);// { creator: creator, flow: null };
        this._flows[loginName] = res;

        return res;
    }
    public registerHybridProvider(
        loginName: string,
        creator: () => IHybridProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean
    ): IProviderAdapter 
    {
        this._log.debug("Registering hybrid flow \"" + loginName + "\"");

        var res = new HybridProviderAdapter(creator, idScopes, requestAccessToken, requestRefreshToken);// { creator: creator, flow: null };
        this._flows[loginName] = res;

        return res;
    }

    public findProvider(name: string): IProviderAdapter
    {
        var info = this._flows[name];

        return info;//as IImplicitProvider;
    }
}

class ImplicitProviderAdapter implements IProviderAdapter
{
    constructor(
        private readonly creator: () => IImplicitProvider,
        private readonly idScopes: string[],
        private readonly requestInitialAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] }
    )
    { }

    private _provider: IImplicitProvider = null;
    private get provider(): IImplicitProvider
    {
        if (!this._provider)
            this._provider = this.creator();

        return this._provider;
    }

    public login(
        nonce: string,
        state: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void
    {
        var accessTokenName: string = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;

        this.provider.login(
            nonce,
            state,
            this.idScopes,
            this.requestInitialAccessToken,
            (user, accesstoken) =>
            {
                success(user, accessTokenName, accesstoken);
            },
            redirecting,
            error
        );
    }
    public requestAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        throw new Error("Implicit flow does not support token acquisition after login");
    }

    public handleRedirect(
        url: string,
        nonce: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        var accessTokenName: string = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;

        this.provider.handleRedirect(
            url,
            nonce,
            (user, accessToken) =>
            {
                success(user, accessTokenName, accessToken);
            },
            error
        );
    }

    public logout(): void
    {
        this.provider.logout();
    }
}

class AuthcodeProviderAdapter implements IProviderAdapter
{
    constructor(
        private readonly creator: () => IAuthcodeProvider,
        private readonly requestRefreshToken: boolean
    )
    { }

    private _provider: IAuthcodeProvider = null;
    private get provider(): IAuthcodeProvider
    {
        if (!this._provider)
            this._provider = this.creator();

        return this._provider;
    }

    public login(
        nonce: string,
        state: string,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.login(
            this.requestRefreshToken,
            nonce,
            state,
            () =>
            {
                success();
            },
            redirecting,
            error
        );
    }

    public requestAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.requestAccessToken(resource, scopes, success, error);
    }

    public handleRedirect(
        url: string,
        nonce: string,
        success: () => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.handleRedirect(
            url,
            nonce,
            () =>
            {
                success();
            },
            error
        );
    }

    public logout(): void
    {
        this.provider.logout();
    }
}

class HybridProviderAdapter implements IProviderAdapter
{
    constructor(
        private readonly creator: () => IHybridProvider,
        private readonly idScopes: string[],
        private readonly requestInitialAccessToken: { name: string, resource: string, scopes: string[] },
        private readonly requestRefreshToken: boolean
    )
    { }

    private _provider: IHybridProvider = null;
    private get provider(): IHybridProvider
    {
        if (!this._provider)
            this._provider = this.creator();

        return this._provider;
    }

    public login(
        nonce: string,
        state: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void
    {
        var accessTokenName: string = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;

        this.provider.login(
            this.requestRefreshToken,
            nonce,
            state,
            this.idScopes,
            this.requestInitialAccessToken,
            (user, accesstoken) =>
            {
                success(user, accessTokenName, accesstoken);
            },
            redirecting,
            error
        );
    }

    public requestAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.requestAccessToken(resource, scopes, success, error);
    }

    public handleRedirect(
        url: string,
        nonce: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        var accessTokenName: string = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;

        this.provider.handleRedirect(
            url,
            nonce,
            (user, accessToken) =>
            {
                success(user, accessTokenName, accessTokenName);
            },
            error
        );
    }

    public logout(): void
    {
        this.provider.logout();
    }
}
