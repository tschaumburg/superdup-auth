import logging = require("../../logger");
import { IProviderManager, IProviderAdapter } from "../imanager";
import { IImplicitProvider } from "../iimplicit";
import { IHybridProvider } from "../ihybrid";
import { IBaseProvider } from "../ibase";
import { UserInfo } from "../../userinfo";

export function createProviderManager(): IProviderManager
{
    return new ProviderManager();
}

class ProviderManager implements IProviderManager
{
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
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        log: logging.ILogger
    ): void 
    {
        log.debug("Registering authentication flow \"" + loginName + "\"");

        this._flows[loginName] = new ImplicitProviderAdapter(creator, requestAccessToken);// { creator: creator, flow: null };
    }

    public registerHybridProvider(
        loginName: string,
        creator: () => IHybridProvider,
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        requestRefreshToken: boolean,
        log: logging.ILogger
    ): void 
    {
        log.debug("Registering hybrid flow \"" + loginName + "\"");

        this._flows[loginName] = new HybridProviderAdapter(creator, requestAccessToken, requestRefreshToken);// { creator: creator, flow: null };
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
        private readonly requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] }
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
        if (!!this.requestAccessToken)
            accessTokenName = this.requestAccessToken.name;

        this.provider.login(
            nonce,
            state,
            this.requestAccessToken,
            (user, accesstoken) =>
            {
                success(user, accessTokenName, accesstoken);
            },
            redirecting,
            error
        );
    }
    public acquireAccessToken(
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
        if (!!this.requestAccessToken)
            accessTokenName = this.requestAccessToken.name;

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

class HybridProviderAdapter implements IProviderAdapter
{
    constructor(
        private readonly creator: () => IHybridProvider,
        private readonly requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
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
        if (!!this.requestAccessToken)
            accessTokenName = this.requestAccessToken.name;

        this.provider.login(
            this.requestRefreshToken,
            nonce,
            state,
            this.requestAccessToken,
            (user, accesstoken) =>
            {
                success(user, accessTokenName, accesstoken);
            },
            redirecting,
            error
        );
    }

    public acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        this.provider.acquireAccessToken(resource, scopes, success, error);
    }

    public handleRedirect(
        url: string,
        nonce: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        var accessTokenName: string = null;
        if (!!this.requestAccessToken)
            accessTokenName = this.requestAccessToken.name;

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
