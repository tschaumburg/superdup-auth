import { ILog, ILogTarget, createLog } from "superdup-auth-log";
import { ILogin2, Login2 } from "./login2";
//import { ILogin, IHybridLogin } from "./loginmanager";
import { IImplicitProvider, IHybridProvider } from "superdup-auth-core-providers";
import { UserInfo} from "superdup-auth-core-providers";

import { ApiManager } from "superdup-auth-core-apis";
import { IAuthenticationManager } from "./iauthenticationmanager";
import { IProviderManager, createProviderManager } from "superdup-auth-core-providers";
import { ILoginManager, createLoginManager } from "superdup-auth-core-login";
import { IAuthenticationConfig, createConfigBuilder } from "./builders/iauthenticationconfig";
import { ITokenManager, ITokenProvider, createTokenManager } from "superdup-auth-core-tokens"; 

export function createAuthenticationManager(log: ILogTarget): IAuthenticationManager
{
    return new AuthenticationManager(createLog(log, "auth"));
}

export class AuthenticationManager implements IAuthenticationManager
{
    public readonly config: IAuthenticationConfig;
    private readonly _loginManager: ILoginManager;
    private readonly _tokenManager: ITokenManager;
    private readonly _apiManager: ApiManager = new ApiManager();
    private _logins: { [id: string]: ILogin2; } = {};
    constructor(private readonly _log: ILog)
    {
        var provider = createProviderManager(_log.sublog("providerManager"));
        this._loginManager = createLoginManager(provider, this._log);
        this._tokenManager = createTokenManager(this._log);
        this.config = createConfigBuilder(this._log, this._loginManager, this._tokenManager, this._apiManager, this);
    }

    public registerLogin(name: string, login: ILogin2): void
    {
        this._logins[name] = login;
    }

    public getLogin(loginName: string): ILogin2
    {
        //var impl = this._loginManager.getLogin(loginName);
        //return new Login2(impl, this._tokenManager);
        return this._logins[loginName];
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
        //noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): boolean
    {
        if (!success)
            success = (l, u, s) => { this.handleRedirectSucceeded(l, u, s); };

        if (!error)
            error = (l, r, s) => { this.handleRedirectFailed(l, r, s); };
        
        var res = this._loginManager.handleRedirect(
            url,
            success,
            error
        );

        if (!res)
        {
            this.handleReloaded();
        }

        return res;
    }
    private handleRedirectSucceeded(loginName: string, user: UserInfo, userstate: any): void
    {
        var login2 = this.getLogin(loginName);
        if (!login2)
            throw new Error("No login named " +  loginName + " registered");

        if (!!login2.onLoginSuccess)
            login2.onLoginSuccess(userstate);
    }

    private handleRedirectFailed(loginName: string, reason: any, userstate: any): void
    {
        var login2 = this.getLogin(loginName);
        if (!login2)
            throw new Error("No login named " + loginName + " registered");

        if (!!login2.onLoginError)
            login2.onLoginError(userstate);
    }

    private handleReloaded(): void
    {
        for (var loginName in this._logins)
        {
            var login2 = this.getLogin(loginName);
            if (!login2)
                continue;

            if (!login2.onLoadedFromCache)
                continue;

            var user = login2.user;
            if (!user)
                continue;

            login2.onLoadedFromCache();
        }
    }

    public resolveAccessToken(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        var tokenName = this._apiManager.resolveApi(url);
        if (!tokenName)
        {
            var msg = "URL " + url + " unprotected";
            this._log.debug(msg);
            success(null);
            return;
        }

        var token = this._tokenManager.tokenByName(tokenName);
        if (!token)
        {
            var msg = "Cannot get token " + tokenName + " for url " + url;
            this._log.debug(msg);
            error(msg);
            return;
        }

        token.getValue(success, error);
    }
}

