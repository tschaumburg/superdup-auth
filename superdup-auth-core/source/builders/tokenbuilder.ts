import { ILog } from "superdup-auth-log";
import { IAuthCodeLogin } from "../loginmanager";
import { IToken, ITokenManager, ITokenProvider } from "../tokenmanager";

export class TokenBuilder
{
    constructor(private readonly _tokenManager: ITokenManager, private readonly resource: string, private readonly scopes: string[], private readonly _log: ILog)
    { }

    private provider: ITokenProvider = null;
    public providedBy(login: IAuthCodeLogin): TokenBuilder
    {
        if (!!this.provider)
        {
            throw new Error("Token can only have one provider");
        }
        this.provider =
            {
                providerId: login.name,
                provideTokenValue: login.acquireAccessToken,
                loggedIn: login.loggedIn,
                loggingOut: login.loggingOut
            };

        return this;
    }
    public registerAs(name: string): IToken
    {
        if (!this.provider)
        {
            throw new Error("Token must have a provider");
        }

        return this._tokenManager.registerToken(name, this.resource, this.scopes, this.provider, this._log);
    }
}