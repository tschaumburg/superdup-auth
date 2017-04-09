//import auth = require("superdup-auth-core");

//export interface IConfigHelper
//{
//    useImplicitFlow<TOptions>(
//        loginName: string,
//        flow: new (args: TOptions, log: auth.ILogger) => auth.IImplicitProvider,
//        flowOptions: TOptions,
//        log: auth.ILogger
//    ): IFlowHelper<TOptions>;
//    useHybridFlow<TOptions>(
//        loginName: string,
//        flow: new (args: TOptions, log: auth.ILogger) => auth.IHybridProvider,
//        flowOptions: TOptions,
//        log: auth.ILogger
//    ): IFlowHelper<TOptions>;
//}

//export interface IFlowHelper<TOptions>
//{
//    accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IFlowHelper<TOptions>;
//    //setDefault(plugin: string, identityProvider: string, token: string): void; 
//}

//export class ConfigHelper implements IConfigHelper
//{
//    public constructor(private readonly authManager: auth.ILoginManager) 
//    {
//    } 

//    public useImplicitFlow<TOptions>(
//        loginName: string,
//        flow: new (args: TOptions, log: auth.ILogger) => auth.IImplicitProvider,
//        flowOptions: TOptions,
//        log: auth.ILogger
//    ): IFlowHelper<TOptions> 
//    {
//        this.authManager.registerImplicitProvider<TOptions>(loginName, flow, flowOptions, log);
//        return new FlowHelper<TOptions>(this.authManager, loginName);
//    }

//    public useHybridFlow<TOptions>(
//        loginName: string,
//        flow: new (args: TOptions, log: auth.ILogger) => auth.IHybridProvider,
//        flowOptions: TOptions,
//        log: auth.ILogger
//    ): IFlowHelper<TOptions> {
//        this.authManager.registerHybridProvider<TOptions>(loginName, flow, flowOptions, log);
//        return new FlowHelper<TOptions>(this.authManager, loginName);
//    }
//}

//class FlowHelper<TOptions> implements IFlowHelper<TOptions>
//{
//    public constructor(
//        private readonly pluginManager: auth.ILoginManager,
//        private readonly loginName: string
//    ) 
//    {
//    }

//    public accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): FlowHelper<TOptions>
//    {
//        this.pluginManager.registerAccessToken(tokenName, this.loginName, resource, scopes, protectUrls);
//        return this;
//    }

//    //public setDefault(plugin: string, identityProvider: string, token: string): IIdentityProviderHelper<TOptions>
//    //{
//    //    this.pluginManager.setDefaultProvider(plugin, identityProvider, token);
//    //    return this;
//    //}
//}
