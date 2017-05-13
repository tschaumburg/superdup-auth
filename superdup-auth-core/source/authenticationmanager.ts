import { ILog, ILogTarget, createLog } from "superdup-auth-log";
import { ILogin2, Login2 } from "./login2";
//import { ILogin, IHybridLogin } from "./loginmanager";
import { IImplicitProvider, IHybridProvider } from "./providermanager";
import { UserInfo} from "./userinfo";

import { ApiManager } from "./apimanager";
import { IAuthenticationManager } from "./iauthenticationmanager";
import { IProviderManager, createProviderManager } from "./providermanager";
import { ILoginManager, createLoginManager } from "./loginmanager";
import { IAuthenticationConfig, createConfigBuilder } from "./builders/iauthenticationconfig";
import { ITokenManager, ITokenProvider, createTokenManager } from "./tokenmanager";

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
    constructor(private readonly _log: ILog)
    {
        var provider = createProviderManager();
        this._loginManager = createLoginManager(provider, this._log);
        this._tokenManager = createTokenManager(this._log);
        this.config = createConfigBuilder(this._log, this._loginManager, this._tokenManager, this._apiManager);
    }

    public getLogin(loginName: string): ILogin2
    {
        var impl = this._loginManager.getLogin(loginName);
        return new Login2(impl, this._tokenManager);
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

