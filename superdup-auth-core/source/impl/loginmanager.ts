import { ILogger, ConsoleLogger } from "../logger";
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

    public registerAccessToken(
        tokenName: string,
        loginName: string,
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
    public registerImplicitProvider<TOptions>(//, TFlow extends IImplicitProvider<TOptions>>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider,
        flowOptions: TOptions
    ): ILogger 
    {
        var flowlog = this.log.sublog(loginName);

        this.flowManager.registerImplicitProvider(
            loginName,
            () => { return new flow(flowOptions, flowlog); },
            this.log
        );

        return flowlog;
    }

    public registerHybridProvider<TOptions>(//, TFlow extends IImplicitProvider<TOptions>>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IHybridProvider,
        flowOptions: TOptions,
        flowlog: ILogger
    ): void 
    {
        if (!flowlog)
            flowlog = this.log.sublog(loginName);
        if (!flowlog.sublog)
            flowlog = new ConsoleLogger(flowlog, "XXXX");

        this.flowManager.registerHybridProvider(
            loginName,
            () => { return new flow(flowOptions, flowlog); },
            this.log
        );
    }

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    public login(
        loginName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void,
        log: ILogger
    ): void 
    {
        log.info("login(loginName=" + loginName + ", accessTokenName=" + accessTokenName + ")");

        if (!loginName)
        {
            var msg = "login(): loginName must be specified - either explicitly or implicitly through setDefaultProvider()";
            log.error(msg);
            return error(msg, userstate);
        }

        var flow = this.flowManager.findProvider(loginName);

        if (!flow)
        {
            var msg = "No login named " + loginName + " has been registered";
            log.error(msg);
            return error(msg, userstate);;
        }

        var tokeninfo: { name: string, resource: string, scopes: string[] } = null;

        if (!!accessTokenName)
        {
            var regInfo = this.tokenManager.findInfo(accessTokenName, log);
            if (!!regInfo)
                tokeninfo = { name: regInfo.tokenName, resource: regInfo.resource, scopes: regInfo.scopes };
        }

        var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);

        log.info("login(loginName=" + loginName + ", nonce=" + nonce + ", token=" + JSON.stringify(tokeninfo) + ")");
        flow.login(
            nonce,
            { flow: loginName, at: accessTokenName, nonce: nonce, uss: userstate }, //userstate,
            tokeninfo,
            (user, accessTokenValue, userstate) =>
            {
                log.info("Login succeeeded!");
                this.tokenManager.setValue(accessTokenName, accessTokenValue, log);
                this._userManager.set(loginName, user);
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

    //********************************************************************
    //* Handling redirects:
    //* ===================
    //* 
    //* 
    //********************************************************************
    public handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any 
    {
        var sublog = this.log.sublog("handleRedirect");

        var sanitizedUrl = url && url.substr(0, 20);
        sublog.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + "...)");

        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = decodeHash<{ flow: string, at?: string, nonce?: string, uss: any }>(url);
        if (!state)
        {
            var msg = "Not a redirect url";
            sublog.debug("handleRedirect(): ...not a redirect");
            error(null, msg, undefined);
            return null;
        }

        var loginName = state.flow;
        var accessTokenName = state.at;
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

        var requestedAccessTokenName = accessTokenName;
        sublog.debug("handleRedirect() => " + loginName + ".handleRedirect()");

        flow.handleRedirect(
            url,
            nonce,
            accessTokenName,
            (user, accessToken, state) =>
            {
                sublog.info("handleRedirect(): successful redirect processed");
                var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
                var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
                sublog.debug("handleRedirect(): Saving tokens");
                sublog.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
                sublog.debug("handleRedirect():    " + requestedAccessTokenName + " = " + sanitizedAccessToken);
                this.tokenManager.setValue(requestedAccessTokenName, accessToken, sublog);
                this._userManager.set(loginName, user);
                success(loginName, user, userstate);
            },
            (reason, userstate) => { error(loginName, reason, userstate); }
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

        var tlf = flow as IThreeLegggedFlow;
        if (!tlf || !tlf.acquireAccessToken)
            return error("Flow \"" + loginName + "\" does not support token acquisition after login");

        tlf.acquireAccessToken(resource, scopes, success, error);
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
