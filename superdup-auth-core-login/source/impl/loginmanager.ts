import { ILog, ConsoleLog } from "superdup-auth-log";
import { UserStore } from "./userstore";
import { UserInfo } from "superdup-auth-core-providers";
import { ILoginManager } from "../iloginmanager";
import { IProviderAdapter, IImplicitProvider, IHybridProvider, IAuthcodeProvider, IProviderManager } from "superdup-auth-core-providers";
import { decodeHash } from "./tokenutils";

export function createLoginManager(providerManager: IProviderManager, log: ILog): ILoginManager
{
    return new LoginManager(providerManager, log);
}

export class LoginManager implements ILoginManager
{
    private readonly log: ILog;
    private readonly _userManager: UserStore;
    public get providerManager() { return this._providerManager; }

    constructor(private readonly _providerManager: IProviderManager, _log: ILog)
    {
        if (!_log)
            throw new Error("A non-null log parameter must be supplied");

        this.log = _log;

        this._userManager = new UserStore(_log);
    }

    //private _logins: { [id: string]: ILogin; } = {};
    private _initialTokens: { [id: string]: string; } = {};

    //********************************************************************
    //* Registrations:
    //* ==============
    //* 
    //* 
    //********************************************************************
    public defineImplicitLogin(
        loginName: string,
        flow: (log: ILog) => IImplicitProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] }
    ): void
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerImplicitProvider(
                loginName,
                () => { return flow(flowlog); },
                idScopes,
                initialAccessToken
            );

        this._loginNames.push(loginName);
    }

    defineAuthcodeLogin(
        loginName: string,
        flow: (log: ILog) => IAuthcodeProvider,
        requestRefreshToken: boolean
    ): void
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerAuthcodeProvider(
                loginName,
                () => { return flow(flowlog); },
                requestRefreshToken
            );

        this._loginNames.push(loginName);
    }

    public defineHybridLogin(
        loginName: string,
        flow: (log: ILog) => IHybridProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean
    ): void 
    {
        var flowlog = this.log.sublog(loginName);

        var provider =
            this.providerManager.registerHybridProvider(
                loginName,
                () => { return flow(flowlog); },
                idScopes,
                requestAccessToken,
                requestRefreshToken
            );

        this._loginNames.push(loginName);
    }

    private _loginNames: string[] = [];
    public get loginNames(): string[]
    {
        return this._loginNames;
    }

    //********************************************************************
    //* ILogin: basic login/logout:
    //* ===========================
    //* 
    //* 
    //********************************************************************
    public onLoggedIn: (loginName: string, tokenName: string, tokenValue: string) => void;
    public login(
        loginName: string,
        userstate: any,
        success: (userstate: any, accessTokenValue: string) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void 
    {
        this.log.info("login(loginName=" + loginName + ")");

        var nonce: string = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
        var encodedState = JSON.stringify({ flow: loginName, nonce: nonce, uss: userstate });

        this.log.info("login(loginName=" + loginName + ", nonce=" + nonce + /*", token=" + JSON.stringify(tokeninfo) +*/ ")");
        var provider = this._providerManager.findProvider(loginName);
        provider.login(
            nonce,
            encodedState,
            (user, accessTokenName, accessTokenValue) =>
            {
                this.log.info("Login succeeeded!");
                this._userManager.set(loginName, user);
                if (!!success)
                    success(userstate, accessTokenValue);
                if (!!this.onLoggedIn)
                    this.onLoggedIn(loginName, accessTokenName, accessTokenValue);
            },
            () =>
            {
                if (!!redirecting)
                    redirecting();
            },
            (reason) =>
            {
                if (!!error)
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

    public getUser(loginName: string): UserInfo
    {
        return this._userManager.get(loginName);
    }

    public onLoggingOut: (loginName: string) => void;
    public logout(loginName: string): void
    {
        this.log.info("Logging out " + loginName);
        if (!!this.onLoggingOut)
            this.onLoggingOut(loginName);
        var provider = this._providerManager.findProvider(loginName);
        provider.logout();
        this._userManager.clear(loginName);
    }

    public acquireAccessToken(
        loginName: string,
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        var provider = this._providerManager.findProvider(loginName);
        provider.requestAccessToken(resource, scopes, success, error);
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
        var state = decodeHash<{ flow: string, nonce?: string, uss: any }>(url);
        if (!state)
        {
            var msg = "Not a redirect url";
            sublog.debug("handleRedirect(): ...not a redirect");
            return false;
        }

        var loginName = state.flow;
        var userstate = state.uss;
        var nonce = state.nonce;

        var flow = this.providerManager.findProvider(loginName);
        if (!flow)
        {
            var msg = "Redirect URL references login named " + loginName + " - but no such login has been registered";
            sublog.error("handleRedirect(): " + msg);
            error(loginName, msg, userstate);;
            return true;
        }

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
                this._userManager.set(loginName, user);
                try
                {
                    success(loginName, user, userstate);
                }
                catch (reason)
                {
                    error(loginName, reason, userstate);
                }
            },
            (reason) => { error(loginName, reason, userstate); }
        );

        return true;
    }
 }
