import { ILog, ConsoleLog } from "superdup-auth-log";

import { ILogin } from "../ilogin";
import { UserStore } from "./userstore";
import { IHybridLogin } from "../ihybridlogin";
import { IImplicitLogin } from "../iimplicitlogin";
import { IAuthCodeLogin } from "../iauthcodelogin";
import { UserInfo } from "superdup-auth-core-providers";
import { ILoginManager } from "../iloginmanager";
import { IImplicitProvider, IHybridProvider, IAuthcodeProvider, IProviderManager } from "superdup-auth-core-providers";

import { Login } from "./login";
import { decodeHash } from "./tokenutils";

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
            throw new Error("A non-null log parameter must be supplied");

        this.log = _log;

        this._userManager = new UserStore(_log);
    }

    private _logins: { [id: string]: ILogin; } = {};
    private _initialTokens: { [id: string]: string; } = {};

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
                initialAccessToken
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
                requestRefreshToken
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
                requestRefreshToken
            );

        //this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);
        //for (var token of additionalAccessTokens)
        //    this.registerAccessToken2(loginName, token.name, token.resource, token.scopes, token.protectUrls);

        var login = new Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;

        return login;
    }

    public get loginNames(): string[]
    {
        var res: string[] = [];

        for (var loginName in this._logins)
            res.push(loginName);

        return res;
    }

    public getLogin(loginName: string): ILogin
    {
        return this._logins[loginName];
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
        //noRedirect: () => void,
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
            //noRedirect();
            return false;
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
            return true;
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
