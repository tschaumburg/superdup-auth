import { ILog } from "superdup-auth-log";
import { ILoginManager, IHybridLogin } from "../loginmanager";
import { IHybridProvider } from "../providermanager";
import { IToken } from "../tokenmanager";

export class THybridLoginBuilder<TOptions>
{
    public constructor(private readonly _loginManager: ILoginManager, private readonly flow: new (args: TOptions, log: ILog) => IHybridProvider)
    { }

    public withOptions(options: TOptions): HybridLoginBuilder
    {
        return new HybridLoginBuilder(this._loginManager, (log: ILog) => { return new this.flow(options, log); });
    }
}

export class HybridLoginBuilder
{
    requestAccessToken: { name: string, resource: string, scopes: string[] } = null;
    requestRefreshToken: boolean = false;
    idScopes: string[];

    public constructor(private readonly _loginManager: ILoginManager, private readonly flow: (log: ILog) => IHybridProvider)
    { }

    public implicitToken(token: IToken): HybridLoginBuilder
    {
        if (!token)
        {
            this.requestAccessToken = null;
            return;
        }

        if (!!this.requestAccessToken)
            throw new Error("only one implict token");

        this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };

        return this;
    }

    public refreshToken(val: boolean): HybridLoginBuilder
    {
        this.requestRefreshToken = val;
        return this;
    }

    public registerAs(name: string): IHybridLogin
    {
        var login =
            this._loginManager
                .createHybridLogin(
                name,
                this.flow,
                this.idScopes,
                this.requestAccessToken,
                this.requestRefreshToken
                );

        return login;
    }
}
