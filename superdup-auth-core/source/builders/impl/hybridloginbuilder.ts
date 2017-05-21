import { ILog } from "superdup-auth-log";
import { ILoginManager, IHybridLogin } from "superdup-auth-core-login";
import { IHybridProvider } from "superdup-auth-core-providers";
import { IToken, ITokenManager, ITokenProvider } from "superdup-auth-core-tokens";
import { IAuthenticationManager } from "../../iauthenticationmanager";
import { ILogin2, Login2 } from "../../login2";
import { ITHybridLoginBuilder, IHybridLoginBuilder } from "../ihybridloginbuilder";

export class THybridLoginBuilder<TOptions> implements ITHybridLoginBuilder<TOptions>
{
    public constructor(
        private readonly _loginManager: ILoginManager,
        private readonly _tokenManager: ITokenManager,
        private readonly _authenticationManager: IAuthenticationManager,
        private readonly flow: new (args: TOptions, log: ILog) => IHybridProvider
    )
    { }

    public withOptions(options: TOptions): HybridLoginBuilder
    {
        return new HybridLoginBuilder(this._loginManager, this._tokenManager, this._authenticationManager, (log: ILog) => { return new this.flow(options, log); });
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
        private readonly _authenticationManager: IAuthenticationManager,
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

    private _onLoginSuccess: (userState: any) => void = null;
    public onLoginSuccess(callback: (userState: any) => void): void
    {
        if (!!this._onLoginSuccess)
            throw new Error("only one loginSuccess handler");

        this._onLoginSuccess = callback;
    }

    private _onLoginError: (reason: any) => void = null;
    public onLoginError(callback: (reason: any) => void): void
    {
        if (!!this._onLoginError)
            throw new Error("only one loginError handler");

        this._onLoginError = callback;
    } 

    private _onLogout: () => void = null;
    public onLogout(callback: () => void): void
    {
        if (!!this._onLogout)
            throw new Error("only one logout handler");

        this._onLogout = callback;
    }

    private _onLoadedFromCache: () => void = null;
    public_onLoadedFromCache(callback: () => void): void
    {
        if (!!this._onLoadedFromCache)
            throw new Error("only one loadedFromCache handler");

        this._onLoadedFromCache = callback;
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
        var login2 = new Login2(login, this._tokenManager, this._onLoginSuccess, this._onLoginError, this._onLogout, this._onLoadedFromCache);
        this._authenticationManager.registerLogin(name, login2);

        return login2;
    }
}
