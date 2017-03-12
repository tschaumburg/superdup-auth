import { UserInfo } from "./userinfo";
import { ILogger } from "../logger";

export interface IUserManager
{
    setLog(log: ILogger): void;

    saveUser(pluginName: string, identityProviderName: string, user: UserInfo): void;
    readonly user: UserInfo;
}

export function createUserManager(): IUserManager
{
    return new UserManager();
}

class UserManager implements IUserManager
{
    // 
    // =============
    private log: ILogger = console;
    public setLog(_log: ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;
    }

    private _user: UserInfo = null;
    public saveUser(pluginName: string, identityProviderName: string, user: UserInfo): void
    {
        this._user = user;
    }

    public get user(): UserInfo
    {
        return this._user;
    }
}