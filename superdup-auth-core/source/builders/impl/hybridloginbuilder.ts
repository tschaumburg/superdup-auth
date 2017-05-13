import { ILog } from "superdup-auth-log";
import { ILoginManager, IHybridLogin } from "../../loginmanager";
import { IHybridProvider } from "../../providermanager";
import { IToken, ITokenManager, ITokenProvider } from "../../tokenmanager";
import { ILogin2, Login2 } from "../../login2";
import { ITHybridLoginBuilder, IHybridLoginBuilder } from "../ihybridloginbuilder";

export class THybridLoginBuilder<TOptions> implements ITHybridLoginBuilder<TOptions>
{
    public constructor(private readonly _loginManager: ILoginManager, private readonly _tokenManager: ITokenManager, private readonly flow: new (args: TOptions, log: ILog) => IHybridProvider)
    { }

    public withOptions(options: TOptions): HybridLoginBuilder
    {
        return new HybridLoginBuilder(this._loginManager, this._tokenManager, (log: ILog) => { return new this.flow(options, log); });
    }
}

export class HybridLoginBuilder implements IHybridLoginBuilder
{
    requestAccessToken: { name: string, resource: string, scopes: string[] } = null;
    //providesTokens: IToken[] = [];
    requestRefreshToken: boolean = false;
    idScopes: string[];

    public constructor(
        private readonly _loginManager: ILoginManager,
        private readonly _tokenManager: ITokenManager,
        private readonly flow: (log: ILog) => IHybridProvider
    ) { }

    //public providesToken(token: IToken): HybridLoginBuilder
    //{
    //    this.providesTokens.push(token);
    //    return this;
    //}

    //public implicitToken(token: IToken): HybridLoginBuilder
    //{
    //    if (!token)
    //    {
    //        this.requestAccessToken = null;
    //        return;
    //    }

    //    if (!!this.requestAccessToken)
    //        throw new Error("only one implict token");

    //    this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };

    //    return this;
    //}

    public idToken(...idScopes: string[]): IHybridLoginBuilder
    {
        return this;
    }

    public accessToken(token: IToken): IHybridLoginBuilder
    {
        if (!!this.requestAccessToken)
            throw new Error("only one default access token");

        this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };

        return this;
    }

    public refreshToken(val: boolean): HybridLoginBuilder
    {
        this.requestRefreshToken = val;
        return this;
    }

    public registerAs(name: string): ILogin2 // IHybridLogin
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

        var provider: ITokenProvider =
            {
                providerId: login.name,
                provideTokenValue: (res, scp, success, error) => { success(login.implicitTokenValue); },
                loggedIn: login.loggedIn,
                loggingOut: login.loggingOut
            };

        var defaultAccessToken = this._tokenManager.registerToken(name, this.requestAccessToken.resource, this.requestAccessToken.scopes);//, provider);

        if (!!this.requestAccessToken)
            this._tokenManager.registerProvider(this.requestAccessToken.name, provider);

        //for (var token of this.providesTokens)
        //{
        //    this._tokenManager.registerProvider(token.tokenName, provider);
        //}

        //return new Login2(login, defaultAccessToken, this._tokenManager);
        return new Login2(login, this._tokenManager);
    }
}
