import auth = require("superdup-auth-core");

export interface IConfigHelper
{
    useImplicitFlow<TOptions>(loginName: string, flow: new (args: TOptions, log: auth.ILogger) => auth.Implicit<TOptions>, flowOptions: TOptions): IFlowHelper<TOptions>;
    useHybridFlow<TOptions>(loginName: string, flow: new (args: TOptions, log: auth.ILogger) => auth.Hybrid<TOptions>, flowOptions: TOptions): IFlowHelper<TOptions>;
}

export interface IFlowHelper<TOptions>
{
    accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IFlowHelper<TOptions>;
    //setDefault(plugin: string, identityProvider: string, token: string): void; 
}

export class ConfigHelper implements IConfigHelper
{
    public constructor(private readonly authManager: auth.IAuthManager) 
    {
    } 

    public useImplicitFlow<TOptions>(loginName: string, flow: new (args: TOptions, log: auth.ILogger) => auth.Implicit<TOptions>, flowOptions: TOptions): IFlowHelper<TOptions> {
        this.authManager.registerImplicitFlow<TOptions>(loginName, flow, flowOptions);
        return new FlowHelper<TOptions>(this.authManager, loginName);
    }

    public useHybridFlow<TOptions>(loginName: string, flow: new (args: TOptions, log: auth.ILogger) => auth.Hybrid<TOptions>, flowOptions: TOptions): IFlowHelper<TOptions> {
        this.authManager.registerHybridFlow<TOptions>(loginName, flow, flowOptions);
        return new FlowHelper<TOptions>(this.authManager, loginName);
    }
}

class FlowHelper<TOptions> implements IFlowHelper<TOptions>
{
    public constructor(
        private readonly pluginManager: auth.IAuthManager,
        private readonly loginName: string
    ) 
    {
    }

    public accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): FlowHelper<TOptions>
    {
        this.pluginManager.tokenManager.registerTokenInfo2(tokenName, this.loginName, resource, scopes, protectUrls);
        return this;
    }

    //public setDefault(plugin: string, identityProvider: string, token: string): IIdentityProviderHelper<TOptions>
    //{
    //    this.pluginManager.setDefaultProvider(plugin, identityProvider, token);
    //    return this;
    //}
}



//// Old:
//export interface IPluginHelper<TOptions>
//{
//    identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>;
//}

//export interface IIdentityProviderHelper<TOptions>
//{
//    identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>;
//    accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IIdentityProviderHelper<TOptions>;
//    setDefault(plugin: string, identityProvider: string, token: string): IIdentityProviderHelper<TOptions>;
//}

//export class ConfigHelper implements IConfigHelper
//{
//    public constructor(private readonly authManager: auth.IAuthManager) 
//    {
//    }

//    //public setDefault(plugin: string, identityProvider: string): IConfigHelper
//    //{
//    //    this.pluginManager.setDefaultProvider(plugin, identityProvider);
//    //    return this;
//    //}

//    public registerPlugin<TOptions>(pluginName: string, plugin: auth.IPlugin<TOptions>): IPluginHelper<TOptions>
//    {
//        this.authManager.pluginManager.registerPlugin<TOptions>(pluginName, plugin);
//        return new PluginHelper<TOptions>(this.authManager, pluginName, plugin);
//    }

//    public useImplicitFlow<TOptions>(loginName: string, flow: new (args: TOptions, log: auth.ILogger) => auth.Implicit<TOptions>, flowOptions: TOptions): IFlowHelper<TOptions>
//    {
//        this.authManager.registerImplicitFlow<TOptions>(loginName, flow, flowOptions);
//        return new FlowHelper<TOptions>(this.authManager, loginName);
//    }
//}

//class PluginHelper<TOptions> implements IPluginHelper<TOptions>
//{
//    public constructor(
//        private readonly authManager: auth.IAuthManager,
//        private readonly pluginName: string,
//        private readonly plugin: auth.IPlugin<TOptions>
//    ) 
//    {
//    }

//    //public setDefault(plugin: string, identityProvider: string): IPluginHelper<TOptions>
//    //{
//    //    this.pluginManager.setDefaultProvider(plugin, identityProvider);
//    //    return this;
//    //}

//    public identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>
//    {
//        //this.pluginManager.registerIdentityProvider<TOptions>(this.pluginName, identityProviderName, providerOptions);
//        this.plugin.registerIdentityProvider(identityProviderName, providerOptions);
//        return new IdentityProviderHelper<TOptions>(this.authManager, this.pluginName, this.plugin, identityProviderName);
//    }
//}

//class IdentityProviderHelper<TOptions> implements IIdentityProviderHelper<TOptions>
//{
//    public constructor(
//        private readonly pluginManager: auth.IAuthManager,
//        private readonly pluginName: string,
//        private readonly plugin: auth.IPlugin<TOptions>,
//        private readonly identityProviderName: string
//    ) 
//    {
//    }

//    public setDefault(plugin: string, identityProvider: string, token: string): IIdentityProviderHelper<TOptions>
//    {
//        this.pluginManager.setDefaultProvider(plugin, identityProvider, token);
//        return this;
//    }

//    public identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>
//    {
//        //this.pluginManager.registerIdentityProvider(this.pluginName, identityProviderName, providerOptions);
//        this.plugin.registerIdentityProvider(identityProviderName, providerOptions);
//        return this;
//    }

//    public accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IIdentityProviderHelper<TOptions>
//    {
//        this.pluginManager.tokenManager.registerTokenInfoOld(this.pluginName, this.identityProviderName, tokenName, resource, scopes, protectUrls);
//        return this;
//    }
//}
