import { ILogin } from "../ilogin";
import { ILogger } from "../../logger";
import { IImplicitBuilder } from "../iimplicit";
import { IImplicitProvider } from "../../providers";

import { IBuilderManager, IInternalBuilderManager } from "../imanager";
import { ILoginManager } from "../../iloginmanager";
import { Login } from "./login";

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

    private readonly tokens: {tokenName: string, resource: string, scopes: string[], protectUrls: string[]}[] = [];
    public providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IImplicitBuilder<TOptions>
    {
        this.tokens.push({ tokenName: tokenName, resource: resource, scopes: scopes, protectUrls: protectUrls});
        return this;
    }

    private loginName: string;
    public registerAs(loginName: string): ILogin
    {
        this.loginName = loginName;

        var sublog = this.loginManager.registerImplicitProvider(this.loginName, this.flow, this.parameters);
        for (var token of this.tokens)
            this.loginManager.registerAccessToken(token.tokenName, this.loginName, token.resource, token.scopes, token.protectUrls);

        var login = new Login(this.loginManager, sublog, this.loginName);
        this.builderManager.registerLogin(this.loginName, login);
        return login;
    }

}