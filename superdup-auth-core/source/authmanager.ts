import { ILogger } from "./logger";
import { UserInfo, IUserManager, createUserManager } from "./users";
//import { IPlugin, IPluginManager, createPluginManager } from "./plugins";
import { ITokenManager, createTokenManager, decodeHash } from "./tokens";
import { IAuthManager } from "./iauthmanager";

import { IThreeLegggedFlow, Implicit, Hybrid, IFlowManager, createFlowManager } from "./flows";
import { decodeNonce } from "./tokens";

var _authManager: IAuthManager = null;
export function getAuthManager(): IAuthManager
{
    if (!_authManager)
        _authManager = new AuthManager();

    return _authManager;
}

class AuthManager implements IAuthManager
{
    //********************************************************************
    //* New API:
    //* ========
    //* 
    //* 
    //********************************************************************
    private readonly _flowManager: IFlowManager = createFlowManager();
    public get flowManager() { return this._flowManager; }

    public registerImplicitFlow<TOptions>(//, TFlow extends Implicit<TOptions>>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => Implicit<TOptions>,
        flowOptions: TOptions
    ): void {
        this.flowManager.registerImplicitFlow(
            loginName,
            (log: ILogger) => { return new flow(flowOptions, log); }
        );
    }

    public registerHybridFlow<TOptions>(//, TFlow extends Implicit<TOptions>>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => Hybrid<TOptions>,
        flowOptions: TOptions
    ): void {
        this.flowManager.registerHybridFlow(
            loginName,
            (log: ILogger) => { return new flow(flowOptions, log); }
        );
    }

    public login(
        loginName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        this.log.info("login(loginName=" + loginName + ", accessTokenName=" + accessTokenName + ")");

        if (!loginName)
        {
            var msg = "login(): loginName must be specified - either explicitly or implicitly through setDefaultProvider()";
            this.log.error(msg);
            return error(msg, userstate);
        }

        var flow = this.flowManager.findFlow(loginName);

        if (!flow)
        {
            var msg = "No login named " + loginName + " has been registered";
            this.log.error(msg);
            return error(msg, userstate);;
        }

        var tokeninfo: { name: string, resource: string, scopes: string[] } = null;

        if (!!accessTokenName)
        {
            var regInfo = this.tokenManager.findByTokenName(accessTokenName);
            if (!!regInfo)
                tokeninfo = { name: regInfo.tokenName, resource: regInfo.resource, scopes: regInfo.scopes };
        }

        var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);

        this.log.info("login(loginName=" + loginName + ", nonce=" + nonce + ", token=" + JSON.stringify(tokeninfo) + ")");
        flow.login(
            nonce,
            { flow: loginName, at: accessTokenName, nonce: nonce, uss: userstate }, //userstate,
            tokeninfo,
            (user, accessTokenValue, userstate) =>
            {
                this.log.info("Login succeeeded!");
                this.tokenManager.setTokenValue2(accessTokenName, accessTokenValue);
                this.userManager.saveUser(loginName, "", user);
                success(user, userstate);
            },
            error
        );
    }

    private makeNonce(): string
    {
        var length = 10;
        var text = "n"; // prefix "n" => nonce is valid property name
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
        {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any 
    {
        var sanitizedUrl = url && url.substr(0, 20);
        this.log.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + "...)");

        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = decodeHash<{ flow: string, at?: string, nonce?: string, uss: any }>(url);
        if (!state)
        {
            var msg = "Not a redirect url";
            this.log.debug("handleRedirect(): ...not a redirect");
            error(null, msg, undefined);
            return null;
        }

        var loginName = state.flow;
        var accessTokenName = state.at;
        var userstate = state.uss;
        var nonce = state.nonce;

        var flow = this.flowManager.findFlow(loginName);
        if (!flow)
        {
            var msg = "Redirect URL references login named " + loginName + " - but no such login has been registered";
            this.log.error("handleRedirect(): " + msg);
            error(loginName, msg, userstate);;
            return null;
        }

        var requestedAccessTokenName = accessTokenName;
        this.log.debug("handleRedirect() => " + loginName + ".handleRedirect()");

        flow.handleRedirect(
            url,
            nonce,
            accessTokenName,
            (user, accessToken, state) =>
            {
                this.log.info("handleRedirect(): successful redirect processed");
                var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
                var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
                this.log.debug("handleRedirect(): Saving tokens");
                this.log.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
                this.log.debug("handleRedirect():    " + requestedAccessTokenName + " = " + sanitizedAccessToken);
                this.tokenManager.setTokenValue2(requestedAccessTokenName, accessToken);
                this.userManager.saveUser(loginName, "", user);
                success(loginName, user, userstate);
            },
            (reason, userstate) => { error(loginName, reason, userstate); }
        );

        return userstate;
    }

    public logout2(loginName: string): void
    {
        this.log.info("logout(loginName=" + loginName + ")");

        if (!loginName)
        {
            var msg = "logout(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
            this.log.error(msg);
            throw new Error(msg);
        }

        var flow = this.flowManager.findFlow(loginName);

        if (!flow)
        {
            var msg = "No login named " + loginName + " has been registered";
            this.log.error(msg);
            throw new Error(msg);
        }

        this.tokenManager.clearTokenValues2(loginName);
        this.userManager.clearUser(loginName, "");
    }

    //
    // =============
    private _tokenManager: ITokenManager = null;
    public get tokenManager()
    {
        var self = this;
        if (!this._tokenManager)
        {
            this._tokenManager =
                createTokenManager(
                    (loginName: string, resource: string, scopes: string[], success: (token: string) => void, err: (reason:any)=> void) => 
                    {
                        self.acquireAccessToken(loginName, resource, scopes, success, err);
                    },
                    this.log
                );
        }

        return this._tokenManager;
    }

    private acquireAccessToken(
        loginName: string,
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        if (!loginName)
            return error("Unnamed login");

        var flow = this.flowManager.findFlow(loginName);

        if (!flow)
            return error("Could not find login \"" + loginName + "\"");

        var tlf = flow as IThreeLegggedFlow;
        if (!tlf || !tlf.acquireAccessToken)
            return error("Flow \"" + loginName + "\" does not support token acquisition after login");

        tlf.acquireAccessToken(resource, scopes, success, error);
    }

    //
    // =============
    private readonly _userManager = createUserManager()
    public get userManager() { return this._userManager; }

    // 
    // =============
    //private readonly _pluginManager: IPluginManager = createPluginManager();
    //public get pluginManager() { return this._pluginManager; }

    //
    // =============
    private log: ILogger = console;
    public setLog(_log: ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;

        this.flowManager.setLog(_log);
        //this.pluginManager.setLog(_log);
        this.tokenManager.setLog(_log);
        this.userManager.setLog(_log);
    }

    ////********************************************************************
    ////* Plugins:
    ////* ========
    ////* 
    ////* 
    //    //********************************************************************
    //public registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void
    //{
    //    this.pluginManager.registerPlugin(pluginName, plugin);
    //}

    ////********************************************************************
    ////* Login:
    ////* ======
    ////* 
    ////* 
    ////********************************************************************
    //private _defaultPlugin: string = null;
    //private _defaultIdentityProvider: string = null;
    //private _defaultAccessToken: string = null;

    //public setDefaultProvider(defaultPlugin: string, defaultIdentityProvider: string, defaultAccessToken: string): void
    //{
    //    this._defaultPlugin = defaultPlugin;
    //    this._defaultIdentityProvider = defaultIdentityProvider;
    //    this._defaultAccessToken = defaultAccessToken;
    //}

    //public login(
    //    userstate: any,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void;

    //public login(
    //    pluginName: string,
    //    identityProviderName: string,
    //    tokenName: string,
    //    userstate: any,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void;

    //login(
    //    p1: any,
    //    p2: any,
    //    p3: any,
    //    p4?: any,
    //    p5?: any,
    //    p6?: any
    //): void
    //{
    //    if (typeof p2 === "string")
    //    {
    //        this.loginImpl(
    //            p1 as string,
    //            p2 as string,
    //            p3 as string,
    //            p4 as any,
    //            p5 as (user: UserInfo, userstate: any) => void,
    //            p6 as (reason: any, userstate: any) => void
    //        );
    //    }
    //    else
    //    {
    //        this.loginImpl(
    //            this._defaultPlugin,
    //            this._defaultIdentityProvider,
    //            this._defaultAccessToken,
    //            p1 as any,
    //            p2 as (user: UserInfo, userstate: any) => void,
    //            p3 as (reason: any, userstate: any) => void
    //        );
    //    }
    //    var pluginName: string;
    //    var identityProviderName: string;
    //    var userstate: any;
    //    var success: (user: UserInfo, userstate: any) => void;
    //    var error: (reason: any, userstate: any) => void;
    //}

    //private loginImpl(
    //    pluginName: string,
    //    identityProviderName: string,
    //    accessTokenName: string,
    //    userstate: any,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void
    //{
    //    this.log.info("login(plugin=" + pluginName + ", idp=" + identityProviderName + ")");

    //    if (!pluginName)
    //    {
    //        var msg = "login(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
    //        this.log.error(msg);
    //        return error(msg, userstate);
    //    }

    //    var plugin = this.pluginManager.findPlugin(pluginName);

    //    if (!plugin)
    //    {
    //        var msg = "No plugin named " + pluginName + " has been registered";
    //        this.log.error(msg);
    //        return error(msg, userstate);;
    //    }

    //    if (!identityProviderName)
    //    {
    //        var msg = "login(): identity provider must be specified - either explicitly or implicitly through setDefaultProvider()";
    //        this.log.error(msg);
    //        return error(msg, userstate);
    //    }

    //    var tokeninfo: { name: string, resource: string, scopes: string[] } = null;

    //    if (!!accessTokenName)
    //    {
    //        var regInfo = this.tokenManager.lookupTokenInfoOld(pluginName, identityProviderName, accessTokenName);
    //        tokeninfo = { name: regInfo.tokenName, resource: regInfo.resource, scopes: regInfo.scopes };
    //    }

    //    this.log.info("login(plugin=" + pluginName + ", idp=" + identityProviderName + ", token=" + JSON.stringify(tokeninfo) + ")");
    //    plugin.login(
    //        identityProviderName,
    //        { mod: pluginName, uss: userstate },
    //        tokeninfo,
    //        (user, accessTokenValue, userstate) =>
    //        {
    //            this.log.info("Login succeeeded!");
    //            this.tokenManager.setTokenValueOld(pluginName, identityProviderName, accessTokenName, accessTokenValue);
    //            this.userManager.saveUser(pluginName, identityProviderName, user);
    //            success(user, userstate);
    //        },
    //        error
    //    );
    //}

    ////********************************************************************
    ////* Redirect handling:
    ////* ==================
    ////* Redirect URLs are expected to be of the form
    ////* 
    ////*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    ////* 
    ////* where
    ////*    https://host/whatever is the registered URL
    ////*    "sdp:auth=oidc"       identifies the auth module
    ////*    "#..."                is the has fragment carrying 
    ////*                          the auth result
    ////* 
    ////********************************************************************
    //public handleRedirect(
    //    url: string,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void
    //{
    //    var sanitizedUrl = url && url.substr(0, 20);
    //    this.log.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + ")");

    //    // First sneak-peek at the '...#state=...' fragment of the URL,
    //    // to see if this is a recognizable redirect:
    //    var state = decodeHash<{ mod: string, idp: string, at?: string, uss: any }>(url);
    //    if (!state)
    //    {
    //        var msg = "Not a redirect url";
    //        this.log.debug("handleRedirect(): ...not a redirect");
    //        return error(msg, undefined);
    //    }

    //    if (!state.mod)
    //    {
    //        var msg = "Malformed state in redirect url - expected state of type { mod: string, idp: string, uss: any }, got " + JSON.stringify(state);
    //        this.log.error("handleRedirect(): " + msg);
    //        return error(msg, state.uss);
    //    }

    //    var plugin = this.pluginManager.findPlugin(state.mod);
    //    if (!plugin)
    //    {
    //        var msg = "Redirect URL references plugin named " + state.mod + " - but no such plugin has been registered";
    //        this.log.error("handleRedirect(): " + msg);
    //        return error(msg, state.uss);;
    //    }

    //    var pluginName = state.mod;
    //    var identityProviderName = state.idp;
    //    var requestedAccessTokenName = state.at;
    //    this.log.debug("handleRedirect() => " + pluginName + ".handleRedirect()");
    //    plugin.handleRedirect(
    //        identityProviderName,
    //        requestedAccessTokenName,
    //        url,
    //        state.uss,
    //        (user, accessToken, userstate) =>
    //        {
    //            this.log.info("handleRedirect(): successful redirect processed");
    //            var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
    //            var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
    //            this.log.debug("handleRedirect(): Saving tokens");
    //            this.log.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
    //            this.log.debug("handleRedirect():    " + requestedAccessTokenName + " = " + sanitizedAccessToken);
    //            this.tokenManager.setTokenValueOld(pluginName, identityProviderName, requestedAccessTokenName, accessToken);
    //            this.userManager.saveUser(pluginName, identityProviderName, user);
    //            success(user, userstate);
    //        },
    //        error
    //    );
    //}

    ////********************************************************************
    ////* Logout:
    ////* =======
    ////* 
    ////********************************************************************
    //public logout(): void;
    //public logout(
    //    pluginName: string,
    //    identityProviderName: string
    //): void;
    //logout(
    //    pluginName?: string,
    //    identityProviderName?: string
    //): void
    //{
    //    if (!pluginName)
    //        pluginName = this._defaultPlugin;

    //    if (!identityProviderName)
    //        identityProviderName = this._defaultIdentityProvider;

    //    this.log.info("login(plugin=" + pluginName + ", idp=" + identityProviderName + ")");

    //    if (!pluginName)
    //    {
    //        var msg = "login(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
    //        this.log.error(msg);
    //        throw new Error(msg);
    //    }

    //    var plugin = this.pluginManager.findPlugin(pluginName);

    //    if (!plugin)
    //    {
    //        var msg = "No plugin named " + pluginName + " has been registered";
    //        this.log.error(msg);
    //        throw new Error(msg);
    //    }

    //    if (!identityProviderName)
    //    {
    //        var msg = "login(): identity provider must be specified - either explicitly or implicitly through setDefaultProvider()";
    //        this.log.error(msg);
    //        throw new Error(msg);
    //    }

    //    this.tokenManager.clearTokenValuesOld(pluginName, identityProviderName);
    //    this.userManager.clearUser(pluginName, identityProviderName);
    //}
}
