import { ILog } from "superdup-auth-log";
//import { IAuthCodeLogin } from "../../loginmanager";
import { IToken, ITokenManager, ITokenProvider } from "../../tokenmanager";
//import { IApiManager } from "../../apimanager";
import { ITokenBuilder } from "../itokenbuilder";

export class TokenBuilder implements ITokenBuilder
{
    constructor(
        private readonly _tokenManager: ITokenManager,
        //private readonly _apiManager: IApiManager,
        private readonly resource: string,
        private readonly scopes: string[],
        private readonly _log: ILog
    ) { }

    //private provider: ITokenProvider = null;
    //public providedBy(login: IAuthCodeLogin): TokenBuilder
    //{
    //    if (!!this.provider)
    //    {
    //        throw new Error("Token can only have one provider");
    //    }
    //    this.provider =
    //        {
    //            providerId: login.name,
    //            provideTokenValue: login.acquireAccessToken,
    //            loggedIn: login.loggedIn,
    //            loggingOut: login.loggingOut
    //        };

    //    return this;
    //}

    //private _requiredBy: string[] = [];
    //public requiredBy(url: string): TokenBuilder
    //{
    //    this._requiredBy.push(url);
    //    return this;
    //}

    public registerAs(name: string): IToken
    {
        //if (!this.provider)
        //{
        //    throw new Error("Token must have a provider");
        //}

        //for (var url of this._requiredBy)
        //{
        //    this._apiManager.registerApi(url, name);
        //}

        return this._tokenManager.registerToken(name, this.resource, this.scopes);//, this.provider);
    }
}