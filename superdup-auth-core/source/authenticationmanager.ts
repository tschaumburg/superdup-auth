import { ILog } from "superdup-auth-log";
import { ILogin, IHybridLogin } from "./loginmanager";
import { IImplicitProvider, IHybridProvider } from "./providermanager";
import { UserInfo} from "./userinfo";

import { ApiManager } from "./apimanager";
import { IAuthenticationManager } from "./iauthenticationmanager";
import { IProviderManager, createProviderManager } from "./providermanager";
import { ILoginManager, createLoginManager } from "./loginmanager";
import { ITokenManager, ITokenProvider } from "./tokenmanager";
import { TImplicitLoginBuilder, ImplicitLoginBuilder, THybridLoginBuilder, HybridLoginBuilder, TokenBuilder } from "./builders";

export function createAuthenticationManager(log: ILog): IAuthenticationManager
{
    return new AuthenticationManager(log);
}

export class AuthenticationManager implements IAuthenticationManager
{
    private readonly _loginManager: ILoginManager;
    private readonly _tokenManager: ITokenManager;
    private readonly _apiManager: ApiManager = new ApiManager();
    constructor(private readonly _log: ILog)
    {
        var provider = createProviderManager();
        this._loginManager = createLoginManager(provider, this._log);
    }

    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    public implicitLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ): TImplicitLoginBuilder<TOptions>
    {
        return new TImplicitLoginBuilder<TOptions>(this._loginManager, flow);
    }

    public hybridLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IHybridProvider
    ): THybridLoginBuilder<TOptions>
    {
        return new THybridLoginBuilder<TOptions>(this._loginManager, flow);
    }

    public getLogin(loginName: string): ILogin
    {
        return this._loginManager.getLogin(loginName);
    }

    //********************************************************************
    //* Tokens:
    //* =======
    //* 
    //* 
    //********************************************************************
    public token(resource: string, scopes: string[]): TokenBuilder
    {
        return new TokenBuilder(this._tokenManager, resource, scopes, this._log);
    }

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    public handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any
    {
        this._loginManager.handleRedirect(url, success, noRedirect, error);
    }

    public resolveAccessToken(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        var tokenName = this._apiManager.resolve(url);
        if (!tokenName)
        {
            var msg = "URL " + url + " unprotected";
            this._log.debug(msg);
            success(null);
        }

        var token = this._tokenManager.tokenByName(tokenName);
        if (!token)
        {
            var msg = "Cannot get token " + tokenName + " for url " + url;
            this._log.debug(msg);
            error(msg);
        }

        token.getValue(success, error);
    }
}

