import { ILogger } from "./logger";
import { UserInfo, IUserManager, createUserManager } from "./users";
import { IPlugin, IPluginManager, createPluginManager } from "./plugins";
import { ITokenManager, createTokenManager, decodeHash } from "./tokens";

export interface IAuthManager
{
    readonly tokenManager: ITokenManager;
    readonly userManager: IUserManager;
    readonly pluginManager: IPluginManager;

    setLog(log: ILogger): void;

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    login(
        pluginName: string,
        identityProviderName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;
    login(
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    setDefaultProvider(defaultPlugin: string, defaultIdentityProvider: string, defaultAccessToken: string): void;


    //********************************************************************
    //* Redirect handling:
    //* ==================
    //* Redirect URLs are expected to be of the form
    //* 
    //*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    //* 
    //* where
    //*    https://host/whatever is the registered URL
    //*    "sdp:auth=oidc"       identifies the auth module
    //*    "#..."                is the has fragment carrying 
    //*                          the auth result
    //* 
    //********************************************************************

    handleRedirect(
        url: string,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;
}

export function create(): IAuthManager
{
    return new AuthManager();
}

class AuthManager implements IAuthManager
{
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
                    (p: string, idp: string, res: string, scp: string[], success: (token: string) => void, err: (reason:any)=> void) => 
                    {
                        self.acquireAccessToken(p, idp, res, scp, success, err);
                    },
                    this.log
                );
        }

        return this._tokenManager;
    }

    private acquireAccessToken(
        pluginName: string,
        identityProviderName: string,
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        if (!pluginName)
            return error("Unnamed plugin");

        if (!identityProviderName)
            return error("Unnamed identity provider");

        var plugin = this.pluginManager.findPlugin(pluginName);

        if (!plugin)
            return error("Could not find plugin \"" + pluginName + "\"");

        plugin.acquireAccessToken(identityProviderName, resource, scopes, true, success, error);
    }

    //
    // =============
    private readonly _userManager = createUserManager()
    public get userManager() { return this._userManager; }

    // 
    // =============
    private readonly _pluginManager: IPluginManager = createPluginManager();
    public get pluginManager() { return this._pluginManager; }

    //
    // =============
    private log: ILogger = console;
    public setLog(_log: ILogger): void
    {
        if (!_log)
            _log = console;

        this.log = _log;

        this.pluginManager.setLog(_log);
        this.tokenManager.setLog(_log);
        this.userManager.setLog(_log);
    }

    //********************************************************************
    //* Plugins:
    //* ========
    //* 
    //* 
    //********************************************************************
    public registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void
    {
        this.pluginManager.registerPlugin(pluginName, plugin);
    }

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    private _defaultPlugin: string = null;
    private _defaultIdentityProvider: string = null;
    private _defaultAccessToken: string = null;

    public setDefaultProvider(defaultPlugin: string, defaultIdentityProvider: string, defaultAccessToken: string): void
    {
        this._defaultPlugin = defaultPlugin;
        this._defaultIdentityProvider = defaultIdentityProvider;
        this._defaultAccessToken = defaultAccessToken;
    }

    public login(
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    public login(
        pluginName: string,
        identityProviderName: string,
        tokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    login(
        p1: any,
        p2: any,
        p3: any,
        p4?: any,
        p5?: any,
        p6?: any
    ): void
    {
        if (typeof p2 === "string")
        {
            this.loginImpl(
                p1 as string,
                p2 as string,
                p3 as string,
                p4 as any,
                p5 as (user: UserInfo, userstate: any) => void,
                p6 as (reason: any, userstate: any) => void
            );
        }
        else
        {
            this.loginImpl(
                this._defaultPlugin,
                this._defaultIdentityProvider,
                this._defaultAccessToken,
                p1 as any,
                p2 as (user: UserInfo, userstate: any) => void,
                p3 as (reason: any, userstate: any) => void
            );
        }
        var pluginName: string;
        var identityProviderName: string;
        var userstate: any;
        var success: (user: UserInfo, userstate: any) => void;
        var error: (reason: any, userstate: any) => void;
    }

    private loginImpl(
        pluginName: string,
        identityProviderName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        this.log.info("login(plugin=" + pluginName + ", idp=" + identityProviderName + ")");

        if (!pluginName)
        {
            var msg = "login(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
            this.log.error(msg);
            return error(msg, userstate);
        }

        var plugin = this.pluginManager.findPlugin(pluginName);

        if (!plugin)
        {
            var msg = "No plugin named " + pluginName + " has been registered";
            this.log.error(msg);
            return error(msg, userstate);;
        }

        if (!identityProviderName)
        {
            var msg = "login(): identity provider must be specified - either explicitly or implicitly through setDefaultProvider()";
            this.log.error(msg);
            return error(msg, userstate);
        }

        var tokeninfo: { name: string, resource: string, scopes: string[] } = null;

        if (!!accessTokenName)
        {
            var regInfo = this.tokenManager.lookupTokenInfo(pluginName, identityProviderName, accessTokenName);
            tokeninfo = { name: regInfo.tokenName, resource: regInfo.resource, scopes: regInfo.scopes };
        }

        this.log.info("login(plugin=" + pluginName + ", idp=" + identityProviderName + ", token=" + JSON.stringify(tokeninfo) + ")");
        plugin.login(
            identityProviderName,
            { mod: pluginName, uss: userstate },
            tokeninfo,
            (user, accessTokenValue, userstate) =>
            {
                this.log.info("Login succeeeded!");
                this.tokenManager.setTokenValue(pluginName, identityProviderName, accessTokenName, accessTokenValue);
                this.userManager.saveUser(pluginName, identityProviderName, user);
                success(user, userstate);
            },
            error
        );
    }

    //********************************************************************
    //* Redirect handling:
    //* ==================
    //* Redirect URLs are expected to be of the form
    //* 
    //*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    //* 
    //* where
    //*    https://host/whatever is the registered URL
    //*    "sdp:auth=oidc"       identifies the auth module
    //*    "#..."                is the has fragment carrying 
    //*                          the auth result
    //* 
    //********************************************************************
    public handleRedirect(
        url: string,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        var sanitizedUrl = url && url.substr(0, 20);
        this.log.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + ")");

        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = decodeHash<{ mod: string, idp: string, at?: string, uss: any }>(url);
        if (!state)
        {
            var msg = "Not a redirect url";
            this.log.debug("handleRedirect(): ...not a redirect");
            return error(msg, undefined);
        }

        if (!state.mod)
        {
            var msg = "Malformed state in redirect url - expected state of type { mod: string, idp: string, uss: any }, got " + JSON.stringify(state);
            this.log.error("handleRedirect(): " + msg);
            return error(msg, state.uss);
        }

        var plugin = this.pluginManager.findPlugin(state.mod);
        if (!plugin)
        {
            var msg = "Redirect URL references plugin named " + state.mod + " - but no such plugin has been registered";
            this.log.error("handleRedirect(): " + msg);
            return error(msg, state.uss);;
        }

        var pluginName = state.mod;
        var identityProviderName = state.idp;
        var requestedAccessTokenName = state.at;
        this.log.debug("handleRedirect() => " + pluginName + ".handleRedirect()");
        plugin.handleRedirect(
            identityProviderName,
            requestedAccessTokenName,
            url,
            state.uss,
            (user, accessToken, userstate) =>
            {
                this.log.info("handleRedirect(): successful redirect processed");
                var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
                var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
                this.log.debug("handleRedirect(): Saving tokens");
                this.log.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
                this.log.debug("handleRedirect():    " + requestedAccessTokenName + " = " + sanitizedAccessToken);
                this.tokenManager.setTokenValue(pluginName, identityProviderName, requestedAccessTokenName, accessToken);
                this.userManager.saveUser(pluginName, identityProviderName, user);
                success(user, userstate);
            },
            error
        );
    }
}
