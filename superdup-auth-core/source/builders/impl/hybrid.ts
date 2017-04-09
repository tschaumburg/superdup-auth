import { ILogin } from "../ilogin";
import { ILogger } from "../../logger";
import { IHybridBuilder } from "../ihybrid";
import { IHybridProvider } from "../../providers";

import { IBuilderManager, IInternalBuilderManager } from "../imanager";
import { ILoginManager } from "../../iloginmanager";
import { Login } from "./login";

export class HybridBuilder<TOptions> implements IHybridBuilder<TOptions>
{
    constructor(
        private readonly builderManager: IInternalBuilderManager,
        private readonly loginManager: ILoginManager,
        private readonly flow: new (args: TOptions, log: ILogger) => IHybridProvider
    ) { }

    private parameters: TOptions;
    public withParameters(parameters: TOptions): IHybridBuilder<TOptions>
    {
        this.parameters = parameters;
        return this;
    }

    private readonly tokens: {tokenName: string, resource: string, scopes: string[], protectUrls: string[]}[] = [];
    public providingAccessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IHybridBuilder<TOptions>
    {
        this.tokens.push({ tokenName: tokenName, resource: resource, scopes: scopes, protectUrls: protectUrls});
        return this;
    }

    private loginName: string;
    public registerAs(loginName: string): ILogin
    {
        this.loginName = loginName;

        var sublog = this.loginManager.registerHybridProvider(this.loginName, this.flow, this.parameters);
        for (var token of this.tokens)
            this.loginManager.registerAccessToken(token.tokenName, this.loginName, token.resource, token.scopes, token.protectUrls);

        var login = new Login(this.loginManager, sublog, this.loginName);
        this.builderManager.registerLogin(this.loginName, login);
        return login;
    }

}