import { ILog } from "superdup-auth-log";
import { ILoginManager, IImplicitLogin, IHybridLogin } from "superdup-auth-core-login";
import { IHybridProvider, IImplicitProvider } from "superdup-auth-core-providers";
import { IToken, ITokenManager } from "superdup-auth-core-tokens";
import { IAuthenticationManager } from "../../iauthenticationmanager";
import { ILogin2, Login2 } from "../../login2";
import { IImplicitLoginBuilder, ITImplicitLoginBuilder } from "../iimplicitloginbuilder";


export class TImplicitLoginBuilder<TOptions> implements ITImplicitLoginBuilder<TOptions>
{
    public constructor(
        private readonly _loginManager: ILoginManager,
        private readonly _tokenManager: ITokenManager,
        private readonly _authenticationManager: IAuthenticationManager,
        private readonly flow: new (args: TOptions, log: ILog) => IImplicitProvider
    )
    { }

    public withOptions(options: TOptions): ImplicitLoginBuilder
    {
        return new ImplicitLoginBuilder(this._loginManager, this._tokenManager, this._authenticationManager, (log: ILog) => { return new this.flow(options, log); });
    }
}

export class ImplicitLoginBuilder implements IImplicitLoginBuilder
{
    requestAccessToken: { name: string, resource: string, scopes: string[] } = null;
    requestRefreshToken: boolean = false;
    idScopes: string[];

    public constructor(
        private readonly _loginManager: ILoginManager,
        private readonly _tokenManager: ITokenManager,
        private readonly _authenticationManager: IAuthenticationManager,
        private readonly flow: (log: ILog) => IImplicitProvider
    )
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

        var login2 = new Login2(login, this._tokenManager, this._onLoginSuccess, this._onLoginError, this._onLogout, this._onLoadedFromCache);
        this._authenticationManager.registerLogin(name, login2);

        return login2;
    }
}
