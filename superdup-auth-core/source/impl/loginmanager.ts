import { ILogger, ConsoleLogger } from "../logger";
import { ILogin } from "../ilogin";
import { Login } from "./login";
import { UserInfo } from "../userinfo";
import { DataStore, LocalStorageStore } from "./datastore";
import { ITokenManager, createTokenManager, decodeHash, decodeNonce } from "./tokens";
import { ILoginManager } from "../iloginmanager";
import { IUrlMapper, UrlMapper } from "./urlmapper";
import { IThreeLegggedFlow, IImplicitProvider, IHybridProvider, IProviderManager } from "../providers";
//import { createProviderManager } from "./providers/impl";

//var _authManager: ILoginManager = null;
//export function getLoginManager(log: ILogger): ILoginManager
//{
//    if (!_authManager)
//        _authManager = new LoginManager(log);

//    return _authManager;
//}
export function createLoginManager(providerManager: IProviderManager, log: ILogger): ILoginManager {
    return new LoginManager(providerManager, log);
}

export class LoginManager implements ILoginManager
{
    private readonly log: ILogger;
    private readonly _userManager: DataStore<UserInfo>;
    private readonly _urlMapper: IUrlMapper<string> = new UrlMapper<string>();
    //private readonly _flowManager: IProviderManager = createProviderManager();
    public get flowManager() { return this._flowManager; }

    constructor(private readonly _flowManager: IProviderManager, private readonly _log: ILogger)
    {
        if (!_log)
            _log = console;

        if (!_log.sublog)
            _log = new ConsoleLogger(_log, "auth");

        this.log = _log;

        this._userManager = new DataStore<UserInfo>(new LocalStorageStore(), "sdpIdTokens", _log);
        var self = this;
        this._tokenManager =
            createTokenManager(
            (loginName: string, resource: string, scopes: string[], success: (token: string) => void, err: (reason: any) => void) =>
            {
                    self.acquireAccessToken(loginName, resource, scopes, success, err);
            },
            _log
            );
    }

    //********************************************************************
    //* Access tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    private readonly _tokenManager: ITokenManager;
    public get tokenManager() { return this._tokenManager; }

    private registerAccessToken2(
        loginName: string,
        tokenName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[]
    ): void
    {
        this.tokenManager.registerInfo(tokenName, loginName, resource, scopes, protectUrls, this.log);

        if (!!protectUrls) {
            for (var url of protectUrls) {
                this._urlMapper.add(url, tokenName);
            }
        }
    }

    //listAccessTokens(): string[];
    public getTokenNames(loginName: string, log: ILogger): string[]
    {
        return this.tokenManager.getTokenNames(loginName, log);
    }

    public getTokenValue(tokenName: string): string
    {
        return this.tokenManager.getTokenValue(tokenName);
    }

    public resolveAccessToken( //getAccessTokenFor(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        var sublog = this.log.sublog("resolveAccessToken");
        var tokenName = this._urlMapper.map(url);
        if (!tokenName) {
            success(null);
        }

        //this.tokenManager.resolveAccessToken(url, success, error, log);
        this.tokenManager.getValue(tokenName, success, error, sublog);
    }

    //********************************************************************
    //* Registrations:
    //* ==============
    //* 
    //* 
    //********************************************************************
    public registerImplicitProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider,
        flowOptions: TOptions,
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] }
    ): ILogin
    {
        var flowlog = this.log.sublog(loginName);

        this.flowManager.registerImplicitProvider(
            loginName,
            () => { return new flow(flowOptions, flowlog); },
            requestAccessToken,
            this.log
        );

        this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);

        var login = new Login(this, flowlog, loginName);
        return login;
    }

    public registerHybridProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IHybridProvider,
        flowOptions: TOptions,
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        additionalAccessTokens: { name: string, resource: string, scopes: string[], protectUrls: string[] }[],
        requestRefreshToken: boolean
    ): ILogin 
    {
        var flowlog = this.log.sublog(loginName);

        this.flowManager.registerHybridProvider(
            loginName,
            () => { return new flow(flowOptions, flowlog); },
            requestAccessToken,
            requestRefreshToken,
            this.log
        );

        this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);
        for (var token of additionalAccessTokens)
            this.registerAccessToken2(loginName, token.name, token.resource, token.scopes, token.protectUrls);

        var login = new Login(this, flowlog, loginName);
        return login;
    }

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    public login(
        loginName: string,
        userstate: any,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void,
        log: ILogger
    ): void 
    {
        log.info("login(loginName=" + loginName + ")");

        if (!loginName)
        {
            var msg = "login(): loginName must be specified";
            log.error(msg);
            return error(msg);
        }

        var provider = this.flowManager.findProvider(loginName);
        if (!provider)
        {
            var msg = "No login named " + loginName + " has been registered";
            log.error(msg);
            return error(msg);;
        }

        var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
        var encodedState = JSON.stringify({ flow: loginName, nonce: nonce, uss: userstate });

        log.info("login(loginName=" + loginName + ", nonce=" + nonce + /*", token=" + JSON.stringify(tokeninfo) +*/ ")");
        provider.login(
            nonce,
            encodedState,
            (user, accessTokenName, accessTokenValue) =>
            {
                log.info("Login succeeeded!");
                this.tokenManager.setValue(accessTokenName, accessTokenValue, log);
                this._userManager.set(loginName, user);
                success();
            },
            redirecting,
            (reason) =>
            {
                error(reason);
            }
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

    //********************************************************************
    //* Handling redirects:
    //* ===================
    //* 
    //* 
    //********************************************************************
    public handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any 
    {
        var sublog = this.log.sublog("handleRedirect");

        var sanitizedUrl = url && url.substr(0, 20);
        sublog.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + "...)");

        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = decodeHash<{ flow: string, nonce?: string, uss: any }>(url);
        if (!state)
        {
            var msg = "Not a redirect url";
            sublog.debug("handleRedirect(): ...not a redirect");
            noRedirect();
            return null;
        }

        var loginName = state.flow;
        //var accessTokenName = state.at;
        var userstate = state.uss;
        var nonce = state.nonce;

        var flow = this.flowManager.findProvider(loginName);
        if (!flow)
        {
            var msg = "Redirect URL references login named " + loginName + " - but no such login has been registered";
            sublog.error("handleRedirect(): " + msg);
            error(loginName, msg, userstate);;
            return null;
        }

        //var requestedAccessTokenName = accessTokenName;
        sublog.debug("handleRedirect() => " + loginName + ".handleRedirect()");

        flow.handleRedirect(
            url,
            nonce,
            (user, accessTokenName, accessToken) =>
            {
                // Check to see that we got what we asked for:
                if (!!accessTokenName) // <= ...if we asked for an access token
                {
                    if (!accessToken) // <= ... but did't get one
                    {
                        var msg = "login \"" + loginName + "\"did not return the requested access token \"" + accessTokenName + "\"";
                        this.log.error("handleRedirect(): " + msg);
                        return error(loginName, msg, userstate);
                    }
                }

                sublog.info("handleRedirect(): successful redirect processed");
                var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
                var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
                sublog.debug("handleRedirect(): Saving tokens");
                sublog.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
                sublog.debug("handleRedirect():    " + accessTokenName + " = " + sanitizedAccessToken);
                this.tokenManager.setValue(accessTokenName, accessToken, sublog);
                this._userManager.set(loginName, user);
                success(loginName, user, userstate);
            },
            (reason) => { error(loginName, reason, userstate); }
        );

        return userstate;
    }

    public logout2(
        loginName: string,
        log: ILogger): void
    {
        log.info("logout(loginName=" + loginName + ")");

        if (!loginName)
        {
            var msg = "logout(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
            log.error(msg);
            throw new Error(msg);
        }

        var flow = this.flowManager.findProvider(loginName);

        if (!flow)
        {
            var msg = "No login named " + loginName + " has been registered";
            log.error(msg);
            throw new Error(msg);
        }

        flow.logout();

        this.tokenManager.clearValues(loginName, log);
        this._userManager.clear(loginName);
    }

    //
    // =============
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

        var flow = this.flowManager.findProvider(loginName);

        if (!flow)
            return error("Could not find login \"" + loginName + "\"");

        //var tlf = flow as IThreeLegggedFlow;
        //if (!tlf || !tlf.acquireAccessToken)
        //    return error("Flow \"" + loginName + "\" does not support token acquisition after login");

        flow.acquireAccessToken(resource, scopes, success, error);
    }

    //
    // =============
    //public get userManager() { return this._userManager; }
    public getUser(
        loginName: string,
        log: ILogger
    ): UserInfo
    {
        return this._userManager.get(loginName);
    }
    //public get user(): UserInfo {
    //    return this._userManager.user;
    //}

 }
