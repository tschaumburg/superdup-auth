import { ILog } from "superdup-auth-log";
import { ILoginManager, IImplicitLogin, IHybridLogin } from "../loginmanager";
import { IHybridProvider, IImplicitProvider} from "../providermanager";
import { IToken } from "../tokenmanager";


export class TImplicitLoginBuilder<TOptions>
{
    public constructor(private readonly _loginManager: ILoginManager, private readonly flow: new (args: TOptions, log: ILog) => IImplicitProvider)
    { }

    public withOptions(options: TOptions): ImplicitLoginBuilder
    {
        return new ImplicitLoginBuilder(this._loginManager, (log: ILog) => { return new this.flow(options, log); });
    }
}

export class ImplicitLoginBuilder
{
    requestAccessToken: { name: string, resource: string, scopes: string[] } = null;
    requestRefreshToken: boolean = false;
    loginName: string = null;
    idScopes: string[];

    public constructor(private readonly _loginManager: ILoginManager, private readonly flow: (log: ILog) => IImplicitProvider)
    { }

    public implicitToken(token: IToken): ImplicitLoginBuilder
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

    public registerAs(name: string): IImplicitLogin
    {
        var login =
            this._loginManager
                .createImplicitLogin(
                this.loginName,
                (log: ILog) => { return this.flow(log); },
                this.idScopes,
                this.requestAccessToken
                );

        return login;
    }
}
