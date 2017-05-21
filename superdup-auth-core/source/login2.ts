import { UserInfo } from "superdup-auth-core-providers";
import { IToken } from "superdup-auth-core-tokens";

import { ILogin } from "superdup-auth-core-login";
import { ITokenManager } from "superdup-auth-core-tokens";

export interface ILogin2
{
    onLoginSuccess: (userstate: any) => void;
    onLoginError: (reason: any) => void;
    onLogout: () => void;
    onLoadedFromCache: () => void;

    login(userstate?: any): void;
    logout(): void;

    readonly user: UserInfo;
    readonly tokens: IToken[];
}

export class Login2 implements ILogin2
{
    constructor(
        private readonly _login: ILogin,
        //private readonly defaultAccessToken: IToken,
        private readonly _tokenMgr: ITokenManager,
        private _onLoginSuccess: (userstate: any) => void,
        private _onLoginError: (reason: any) => void,
        private _onLogout: () => void,
        private _onLoadedFromCache: () => void
    ) { }

    public get onLoginSuccess(): (userstate: any) => void { return this._onLoginSuccess; }
    public set onLoginSuccess(value: (userstate: any) => void) { this._onLoginSuccess = value; }

    public get onLoginError(): (reason: any) => void { return this._onLoginError; }
    public set onLoginError(value: (reason: any) => void) { this._onLoginError = value; }

    public get onLogout(): () => void { return this._onLogout; }
    public set onLogout(value: () => void) { this._onLogout = value; }

    public get onLoadedFromCache(): () => void { return this._onLoadedFromCache; }
    public set onLoadedFromCache(value: () => void) { this._onLoadedFromCache = value; }

    public login(
        userstate: any = null
    ): void
    {
        this._login.login(
            userstate,
            this._onLoginSuccess,
            null,
            this._onLoginError
        );
    }

    public logout(): void
    {
        this._login.logout();

        if (!!this._onLogout)
            this._onLogout();
    }

    public get user(): UserInfo
    {
        return this._login.user;
    }

    public get tokens(): IToken[]
    {
        return this._tokenMgr.tokensByProvider(this._login.name);
    }
}