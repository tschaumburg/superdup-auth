import { UserInfo } from "./userinfo";
import { IToken } from "./tokenmanager";

import { ILogin } from "./loginmanager";
import { ITokenManager } from "./tokenmanager";

export interface ILogin2
{
    login(
        userstate: any,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void;

    logout(): void;

    readonly user: UserInfo;
    readonly tokens: IToken[];
}

export class Login2 implements ILogin2
{
    constructor(
        private readonly _login: ILogin,
        //private readonly defaultAccessToken: IToken,
        private readonly _tokenMgr: ITokenManager
    ) { }

    public login(
        userstate: any,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void
    {
        this._login.login(userstate, success, redirecting, error);
    }

    public logout(): void
    {
        this._login.logout();
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