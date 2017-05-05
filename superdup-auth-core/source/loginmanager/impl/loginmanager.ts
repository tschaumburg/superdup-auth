import { ILog, ConsoleLog } from "superdup-auth-log";

import { ILogin } from "../ilogin";
import { UserStore } from "./userstore";
import { IHybridLogin } from "../ihybridlogin";
import { IImplicitLogin } from "../iimplicitlogin";
import { IAuthCodeLogin } from "../iauthcodelogin";
import { UserInfo } from "../../userinfo";
import { ILoginManager } from "../iloginmanager";
import { IThreeLegggedFlow, IImplicitProvider, IHybridProvider, IAuthcodeProvider, IProviderManager } from "../../providermanager";

import { Login } from "./login";
import { decodeHash } from "../../utils";

export function createLoginManager(providerManager: IProviderManager, log: ILog): ILoginManager
{
    return new LoginManager(providerManager, log);
}

export class LoginManager implements ILoginManager
{
    private readonly log: ILog;
    private readonly _userManager: UserStore;
    //private readonly _urlMapper: IUrlMapper<string> = new UrlMapper<string>();
    public get providerManager() { return this._providerManager; }

    constructor(private readonly _providerManager: IProviderManager, _log: ILog)
    {
        if (!_log)
            _log = console;

        if (!_log.sublog)
            _log = new ConsoleLog(_log, "auth");

        this.log = _log;

        this._userManager = new UserStore(_log);
        var self = this;
    }

    private _logins: { [id: string]: ILogin; } = {};
    private _initialTokens: { [id: string]: string; } = {};
    //public resolveAccessToken(
    //    loginName: string,
    //    //tokenName: string,
    //    resource: string,
    //    scopes: string[],
    //    success: (token: string) => void,
    //    error: (reason: any) => void,
    //    log: ILog
    //): void
    //{
    //    var provider = this.providerManager.findProvider(loginName);
    //    if (!provider)
    //    {
    //        var msg = "No login named " + loginName + " has been registered";
    //        log.error(msg);
    //        return error(msg);;
    //    }

    //    provider.requestAccessToken(/*tokenName,*/ resource, scopes, success, error);
    //}

    //********************************************************************
    //* Registrations:
    //* ==============
    //* 
    //* 
    //********************************************************************
    public createImplicitLogin(
        loginName: string,
        flow: (log: ILog) => IImplicitProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] }
    ): IImplicitLogin
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerImplicitProvider(
                loginName,
                () => { return flow(flowlog); },
                idScopes,
                initialAccessToken,
                this.log
            );

        //this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);

        var login = new Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;

        return login;
    }

    createAuthcodeLogin(
        loginName: string,
        flow: (log: ILog) => IAuthcodeProvider,
        requestRefreshToken: boolean
    ): IAuthCodeLogin
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerAuthcodeProvider(
                loginName,
                () => { return flow(flowlog); },
                requestRefreshToken,
                this.log
            );

        var login = new Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;

        return login;
    }

    public createHybridLogin(
        loginName: string,
        flow: (log: ILog) => IHybridProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean
    ): IHybridLogin 
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerHybridProvider(
                loginName,
                () => { return flow(flowlog); },
                idScopes,
                requestAccessToken,
                requestRefreshToken,
                this.log
            );

        //this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);
        //for (var token of additionalAccessTokens)
        //    this.registerAccessToken2(loginName, token.name, token.resource, token.scopes, token.protectUrls);

        var login = new Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;

        return login;
    }

    public getLogin(loginName: string): ILogin
    {
        return this._logins[loginName];
    }

    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    //public login(
    //    loginName: string,
    //    userstate: any,
    //    success: () => void,
    //    redirecting: () => void,
    //    error: (reason: any) => void,
    //    log: ILog
    //): void 
    //{
    //    log.info("login(loginName=" + loginName + ")");

    //    if (!loginName)
    //    {
    //        var msg = "login(): loginName must be specified";
    //        log.error(msg);
    //        return error(msg);
    //    }

    //    var provider = this.providerManager.findProvider(loginName);
    //    if (!provider)
    //    {
    //        var msg = "No login named " + loginName + " has been registered";
    //        log.error(msg);
    //        return error(msg);;
    //    }

    //    var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
    //    var encodedState = JSON.stringify({ flow: loginName, nonce: nonce, uss: userstate });

    //    log.info("login(loginName=" + loginName + ", nonce=" + nonce + /*", token=" + JSON.stringify(tokeninfo) +*/ ")");
    //    provider.login(
    //        nonce,
    //        encodedState,
    //        (user, accessTokenName, accessTokenValue) =>
    //        {
    //            log.info("Login succeeeded!");
    //            //this.tokenManager.setValue(accessTokenName, accessTokenValue, log);
    //            this._userManager.set(loginName, user);
    //            success();
    //        },
    //        redirecting,
    //        (reason) =>
    //        {
    //            error(reason);
    //        }
    //    );
    //}

    //private makeNonce(): string
    //{
    //    var length = 10;
    //    var text = "n"; // prefix "n" => nonce is valid property name
    //    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //    for (var i = 0; i < length; i++)
    //    {
    //        text += possible.charAt(Math.floor(Math.random() * possible.length));
    //    }
    //    return text;
    //}

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

        var flow = this.providerManager.findProvider(loginName);
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
                //this.tokenManager.setValue(accessTokenName, accessToken, sublog);
                this._userManager.set(loginName, user);
                success(loginName, user, userstate);
            },
            (reason) => { error(loginName, reason, userstate); }
        );

        return userstate;
    }

    //public logout2(
    //    loginName: string,
    //    log: ILog): void
    //{
    //    log.info("logout(loginName=" + loginName + ")");

    //    if (!loginName)
    //    {
    //        var msg = "logout(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
    //        log.error(msg);
    //        throw new Error(msg);
    //    }

    //    var flow = this.providerManager.findProvider(loginName);

    //    if (!flow)
    //    {
    //        var msg = "No login named " + loginName + " has been registered";
    //        log.error(msg);
    //        throw new Error(msg);
    //    }

    //    flow.logout();

    //    //this.tokenManager.clearValues(loginName, log);
    //    this._userManager.clear(loginName);
    //}

    //
    // =============
    //private acquireAccessToken(
    //    loginName: string,
    //    tokenName: string,
    //    resource: string,
    //    scopes: string[],
    //    success: (token: string) => void,
    //    error: (reason: any) => void
    //): void
    //{
    //    if (!loginName)
    //        return error("Unnamed login");

    //    var flow = this.providerManager.findProvider(loginName);

    //    if (!flow)
    //        return error("Could not find login \"" + loginName + "\"");

    //    //var tlf = flow as IThreeLegggedFlow;
    //    //if (!tlf || !tlf.acquireAccessToken)
    //    //    return error("Flow \"" + loginName + "\" does not support token acquisition after login");

    //    flow.acquireAccessToken(tokenName, resource, scopes, success, error);
    //}

    //
    // =============
    //public get userManager() { return this._userManager; }
    //public getUser(
    //    loginName: string,
    //    log: ILog
    //): UserInfo
    //{
    //    return this._userManager.get(loginName);
    //}
    //public get user(): UserInfo {
    //    return this._userManager.user;
    //}

 }
