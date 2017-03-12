import { AccessTokenInfo } from "./tokeninfo";
export interface ITokenStore
{
    loadAll(): AccessTokenInfo[];
    saveAll(accessTokens: AccessTokenInfo[]): void;
}

export class LocalStorageTokenStore implements ITokenStore
{
    private readonly key = "sdpTokens";
    public loadAll(): AccessTokenInfo[]
    {
        var value = window.localStorage[this.key];
        if (!value)
            return [];

        return JSON.parse(value) as AccessTokenInfo[];
    }

    public saveAll(accessTokens: AccessTokenInfo[]): void
    {
        if (!accessTokens)
            accessTokens = [];

        var value = JSON.stringify(accessTokens);
        window.localStorage[this.key] = value;
    }
}
