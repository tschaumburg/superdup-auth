import { ILogin } from "../../ilogin";
import { ILogger } from "../../logger";
import { IImplicitBuilder } from "../iimplicit";
import { IImplicitProvider } from "../../providers";

import { IBuilderManager, IInternalBuilderManager } from "../imanager";
import { ILoginManager } from "../../iloginmanager";

export class ImplicitBuilder<TOptions> implements IImplicitBuilder<TOptions>
{
    constructor(
        private readonly builderManager: IInternalBuilderManager,
        private readonly loginManager: ILoginManager,
        private readonly flow: new (args: TOptions, log: ILogger) => IImplicitProvider
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

        var login = this.loginManager.registerImplicitProvider(this.loginName, this.flow, this.parameters, this.token);
        this.builderManager.registerLogin(this.loginName, login);

        return login;
    }

}