import { UserInfo } from "./userinfo";
import { IIdTokenStore, LocalStorageIdTokenStore } from "./idtokenstore";
import { ILogger } from "../logger";

export interface IUserManager
{
    setLog(log: ILogger): void;

    saveUser(pluginName: string, identityProviderName: string, user: UserInfo): void;
    readonly user: UserInfo;
    clearUser(pluginName: string, identityProviderName: string): void;
}

export function createUserManager(): IUserManager
{
    return new UserManager(new LocalStorageIdTokenStore());
}

class UserManager implements IUserManager
{
    public constructor(private readonly tokenStore: IIdTokenStore)
    {
        this.loadState();
    }
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
        this.saveState();
    }

    public get user(): UserInfo
    {
        return this._user;
    }

    public clearUser(pluginName: string, identityProviderName: string): void
    {
        this._user = null;
        this.saveState();
    }

    private loadState()
    {
        this.log.info("Reloading persisted user state...");
        this._user = this.tokenStore.loadAll();

        if (!this._user)
        {
            this.log.info("...no user found");
        }
    }

    private saveState()
    {
        this.log.info("Persisting user state...");
        this.tokenStore.saveAll(this._user);
    }
}