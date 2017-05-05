export interface ITokenInfo
{
    name: string;
    value: string;
}

export interface ITokenStore
{
    loadAll(): ITokenInfo[];
    //saveAll(accessTokens: ITokenInfo[]): void;
    saveToken(name: string, value: string): void;
    clearToken(name: string): void;
}

export class LocalStorageTokenStore implements ITokenStore
{
    private readonly key = "sdpTokens";
    public loadAll(): ITokenInfo[]
    {
        var value = window.localStorage[this.key];
        if (!value)
            return [];

        return JSON.parse(value) as ITokenInfo[];
    }

    public saveAll(accessTokens: ITokenInfo[]): void
    {
        if (!accessTokens)
            accessTokens = [];

        var value = JSON.stringify(accessTokens);
        window.localStorage[this.key] = value;
    }

    public saveToken(name: string, value: string): void
    { }

    public clearToken(name: string): void
    { }
}
