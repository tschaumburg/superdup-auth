import { ILogin } from "../../ilogin";
import { ILog } from "superdup-auth-log";
import { IImplicitBuilder } from "../iimplicit";
import { IImplicitProvider } from "../../../providermanager";

import { IBuilderManager, IInternalBuilderManager } from "../imanager";
import { ILoginManager } from "../../iloginmanager";

export class ImplicitBuilder<TOptions> implements IImplicitBuilder<TOptions>
{
    constructor(
        private readonly builderManager: IInternalBuilderManager,
        private readonly loginManager: ILoginManager,
        private readonly flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ) { }

    private parameters: TOptions;
    public withParameters(parameters: TOptions): IImplicitBuilder<TOptions> {
        this.parameters = parameters;
        return this;
    }

    private token: {name: string, resource: string, scopes: string[], protectUrls: string[]} = null;
    public providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IImplicitBuilder<TOptions>
    {
        if (!!this.token)
            throw new Error("Only one access token for an implicit flow");
        this.token = { name: tokenName, resource: resource, scopes: scopes, protectUrls: protectUrls};
        return this;
    }

    private loginName: string;
    public registerAs(loginName: string): ILogin
    {
        this.loginName = loginName;

        var login = this.loginManager.createImplicitLogin(this.loginName, (log: ILog) => { return new this.flow(this.parameters, log); }, null, this.token);
        this.builderManager.registerLogin(this.loginName, login);

        return login;
    }

}