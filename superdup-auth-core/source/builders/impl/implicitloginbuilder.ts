import { ILog } from "superdup-auth-log";
import { ILoginManager, IImplicitLogin, IHybridLogin } from "../../loginmanager";
import { IHybridProvider, IImplicitProvider } from "../../providermanager";
import { IToken, ITokenManager } from "../../tokenmanager";
import { ILogin2, Login2 } from "../../login2";
import { IImplicitLoginBuilder, ITImplicitLoginBuilder } from "../iimplicitloginbuilder";


export class TImplicitLoginBuilder<TOptions> implements ITImplicitLoginBuilder<TOptions>
{
    public constructor(private readonly _loginManager: ILoginManager, private readonly _tokenManager: ITokenManager, private readonly flow: new (args: TOptions, log: ILog) => IImplicitProvider)
    { }

    public withOptions(options: TOptions): ImplicitLoginBuilder
    {
        return new ImplicitLoginBuilder(this._loginManager, this._tokenManager, (log: ILog) => { return new this.flow(options, log); });
    }
}

export class ImplicitLoginBuilder implements IImplicitLoginBuilder
{
    requestAccessToken: { name: string, resource: string, scopes: string[] } = null;
    requestRefreshToken: boolean = false;
    idScopes: string[];

    public constructor(private readonly _loginManager: ILoginManager, private readonly _tokenManager: ITokenManager, private readonly flow: (log: ILog) => IImplicitProvider)
    { }

    public idToken(...idScopes: string[]): IImplicitLoginBuilder
    {
        return this;
    }

    public accessToken(token: IToken): IImplicitLoginBuilder
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

    public registerAs(name: string): ILogin2 // IImplicitLogin
    {
        var login =
            this._loginManager
                .createImplicitLogin(
                name,
                (log: ILog) => { return this.flow(log); },
                this.idScopes,
                this.requestAccessToken
                );

        return new Login2(login, this._tokenManager);
    }
}
