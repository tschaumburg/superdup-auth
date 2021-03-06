﻿import sdpAuthCore = require("superdup-auth-core");
import { ILog, ConsoleLog } from "superdup-auth-log";
import { WebAuth, ParseHashError, TokenPayload } from "auth0-js";
import auth0jscode = require("auth0-js");
import { Auth0jsOptions, AuthFlow } from "./options";
import { IImplicitProvider, ImplicitSuccess, ImplicitRedirecting, ImplicitFailure, FlowHelper, AccessTokenInfo, UserInfo } from "superdup-auth-core-providers";
import jwt_decode = require("jwt-decode");

export class Auth0Implicit implements IImplicitProvider
{
    private log: ILog = ConsoleLog.Current;

    public constructor(private readonly options: Auth0jsOptions, log: ILog)
    {
        if (!log)
            log = ConsoleLog.Current;

        this.log = log;
    }

    private _webauth: WebAuth;
    private get webauth(): WebAuth
    {
        if (!this._webauth)
            this._webauth =
                new WebAuth(
                    {
                        clientID: this.options && this.options.clientId,
                        domain: this.options && this.options.domain,
                        audience: 'https://api.superdup.dk',
                        responseType: 'token',
                        redirectUri: this.options.redirectUri,
                    }
                );

        return this._webauth;
    }

    public login(
        nonce: string,
        encodedState: string,
        idScopes: string[],
        accessToken: { name: string, resource: string, scopes: string[] },
        success: ImplicitSuccess,
        redirecting: ImplicitRedirecting,
        error: ImplicitFailure
    ): void
    {
        var domain = this.options && this.options.domain;
        var clientId = this.options && this.options.clientId && this.options.clientId.substr(8);

        var at: AccessTokenInfo = null;
        if (!!accessToken)
            at = {
                api_resource: accessToken.resource,
                api_scopes: accessToken.scopes
            };;

        var requestInfo = FlowHelper.ImplicitInfo( ['profile'], at);

        this.log.info(
            "webauth.authorize(" +
            "domain=" + domain + ", " +
            "clientID=" + clientId + ", " +
            "audience=" + requestInfo.audience + ", " +
            "scope=" + requestInfo.scopes.join(" ") + ", " +
            "state=" + encodedState + ", " +
            "responseType=" + requestInfo.response_types.join(" ") + ", " +
            "redirectUri =" + this.options.redirectUri +
            ")");

        try
        {
            this.webauth.authorize(
                {
                    domain: this.options && this.options.domain,
                    clientID: this.options && this.options.clientId,
                    audience: requestInfo.audience, // 'https://api.superdup.dk'
                    scope: requestInfo.scopes.join(" "), //'read:boards edit:boards'
                    state: encodedState,
                    responseType: requestInfo.response_types.join(" "), // 'id_token token',
                    redirectUri: this.options.redirectUri,
                    nonce: nonce, //"x",
                }
            );
            redirecting();
        }
        catch (reason)
        {
            error(reason);
        }
    };

    public logout(): void
    {
    }

    public handleRedirect(
        actualRedirectUrl: string,
        nonce: string,
        success: (user: UserInfo, accessToken: string, refreshToken: string) => void,
        error: (reason: any) => void
    ): void 
    {
        var redirectHash: string = sdpAuthCore.urlparse(actualRedirectUrl).fragment;
        if (!!redirectHash && redirectHash.indexOf("!#") == 0)
            redirectHash = redirectHash.substr(2);

        //if (!this.isConnected())
        //    this.connect();

        this.webauth.parseHash(
            {
                hash: redirectHash,
                nonce: nonce,
                state: undefined
            },
            (err: ParseHashError, data: TokenPayload) =>
            {
                // Handle errors:
                if (!!err)
                {
                    this.log.error("Auth0.WebAuth.parseHash() returns error: " + JSON.stringify(err));

                    return error(err);
                }

                // Handle missing results:
                if (!data)
                {
                    var msg = "Auth0.WebAuth.parseHash() returned neither error nor data";
                    this.log.error("handleRedirect(): " + msg);
                    return error(msg);
                }

                // If there's an idtoken and we can decode it...we're done
                if (!!data.idToken)
                {
                    var userinfo = jwt_decode(data.idToken);
                    if (!userinfo)
                    {
                        var msg = "idtoken " + data.idToken + "could not be decoded";
                        this.log.error("handleRedirect(): " + msg);
                        return error(msg);
                    }

                    this.log.info("handleRedirect(): idtoken " + JSON.stringify(userinfo));
                    return success(this.mapUser(data.idToken, userinfo as auth0jscode.UserInfo), data.accessToken, data.refreshToken);
                }

                // as a last resort, try getting userinfo from the auth0 server
                // (if we have an access token);
                if (!!data.accessToken)
                {
                    this.log.debug("handleRedirect(): calls webauth.client.userInfo()");
                    this.webauth.client.userInfo(
                        data.accessToken,
                        (err, user: auth0jscode.UserInfo) =>
                        {
                            if (!!err)
                            {
                                var msg = "userInfo() returned error " + JSON.stringify(err);
                                this.log.error("handleRedirect(): " + msg);
                                return error(err);
                            }

                            if (!user)
                            {
                                var msg = "userInfo() returned neither result nor error";
                                this.log.error("handleRedirect(): " + msg);
                                return error("No user returned");
                            }

                            this.log.debug("userInfo() returns " + JSON.stringify(user));
                            return success(this.mapUser(data.idToken, user), data.accessToken, data.refreshToken);
                        }
                    );
                }

                var msg = "Auth0.WebAuth.parseHash() returned neither idtoken nor accesstoken";
                this.log.error("handleRedirect(): " + msg);
                return error(msg);
            }
        );
    };

    private mapUser(idtoken: string, src: auth0jscode.UserInfo): UserInfo
    {
        if (!src)
            return null;

        return {
            uid: src.sub,
            handle: src.nickname || src.given_name || src.name || src.family_name || src.email || src.sub,
            givenName: src.given_name,
            familyName: src.family_name,
            picture: src.picture,
            idtoken: idtoken,
            idtokenClaims: src,
        }
    }
}

