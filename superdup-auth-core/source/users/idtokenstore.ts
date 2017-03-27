import { UserInfo } from "./userinfo";
export interface IIdTokenStore
{
    loadAll(): UserInfo;
    saveAll(accessTokens: UserInfo): void;
}

export class LocalStorageIdTokenStore implements IIdTokenStore
{
    private readonly key = "sdpIdTokens";
    public loadAll(): UserInfo
    {
        var value = window.localStorage[this.key];
        if (!value)
            return null;

        return JSON.parse(value) as UserInfo;
    }

    public saveAll(accessTokens: UserInfo): void
    {
        if (!accessTokens)
            accessTokens = null;

        var value = JSON.stringify(accessTokens);
        window.localStorage[this.key] = value;
    }
}
