//import { IApi} from "../apimanager";
import { IToken, ITokenManager } from "superdup-auth-core-tokens";
import { ILog } from "superdup-auth-log";
import { IApiManager } from "superdup-auth-core-apis";
import { ILogin2 } from "../../login2";
import { IApiBuilder, IApiTokenRequirement } from "../iapibuilder";


export class ApiBuilder implements IApiBuilder
{
    constructor(
        private readonly urls: string[],
        private readonly _tokenManager: ITokenManager,
        private readonly _apiManager: IApiManager,
        private readonly _log: ILog
    ) { }

    private _requires: IToken = null;
    public requiresToken(accessToken: IToken): IApiTokenRequirement
    {
        this._requires = accessToken;
        return new ApiTokenRequirement(this);
    }

    private _providedBy: ILogin2 = null;
    providedBy(login: ILogin2): IApiBuilder
    {
        this._providedBy = login;
        return this;
    }

    public registerAs(name: string): void
    {
        if (!!this._requires && !!this.urls)
        {
            for (var url of this.urls)
            {
                this._apiManager.registerApi(url, this._requires.tokenName);
            }
        }

        if (!!this._requires && !!this._providedBy)
        {
            this._tokenManager.registerToken
        }
    }
}

export class ApiTokenRequirement implements IApiTokenRequirement
{
    constructor(private readonly _builder: ApiBuilder)
    { }

    public providedBy(login: ILogin2): IApiBuilder
    {
        return this._builder.providedBy(login);
    }
}
