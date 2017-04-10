import sdpAuthCore = require("superdup-auth-core");
import { WebAuth, ParseHashError, TokenPayload } from "auth0-js";
import auth0jscode = require("auth0-js");
import { Auth0jsOptions, AuthFlow } from "./options";
import jwt_decode = require("jwt-decode");

export class Auth0Hybrid implements sdpAuthCore.IHybridProvider
{
    private log: sdpAuthCore.ILogger = console;
    private webauth: WebAuth;

    public constructor(private readonly options: Auth0jsOptions, log: sdpAuthCore.ILogger)
    {
        if (!log)
            log = console;

        this.log = log;
    }

    isConnected(): boolean
    {
        return (!!this.webauth);
    }

    connect(): void
    {
        if (!this.webauth)
            this.webauth =
                new WebAuth(
                    {
                        clientID: this.options && this.options.clientId,
                        domain: this.options && this.options.domain,
                        audience: 'https://api.superdup.dk',
                        responseType: 'token',
                        redirectUri: this.options.redirectUri,
                    }
                );
    }

    public login(
        nonce: string,
        userstate: any,
        accessToken: { name: string, resource: string, scopes: string[] },
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        var encodedState = JSON.stringify(userstate);

        // we're just requesting an idtoken:
        var audience: string = undefined;
        var scopestring = "openid profile offline_access";
        var responsetype = "code id_token";

        // if a piggybacked access token is requested, update
        // the params:
        if (!!accessToken)
        {
            audience = accessToken.resource;
            scopestring = "openid profile " + accessToken.scopes.join(" ");
            responsetype = "code id_token token";
        }

        // make sure we're connected:
        if (!this.isConnected())
            this.connect();

        var domain = this.options && this.options.domain;
        var clientId = this.options && this.options.clientId && this.options.clientId.substr(8);
        this.log.info(
            "webauth.authorize(" +
            "domain=" + domain + ", " +
            "clientID=" + clientId + ", " +
            "audience=" + audience + ", " +
            "scope=" + scopestring + ", " +
            "state=" + encodedState + ", " +
            "responseType=" + responsetype + ", " +
            "redirectUri =" + this.options.redirectUri +
            ")");

        this.webauth.authorize(
            {
                domain: this.options && this.options.domain,
                clientID: this.options && this.options.clientId,
                audience: audience, // 'https://api.superdup.dk'
                scope: scopestring, //'read:boards edit:boards'
                state: encodedState,
                responseType: responsetype, // 'id_token token',
                redirectUri: this.options.redirectUri,
                nonce: nonce, //"x",
            }
        );
    };

    public handleRedirect(
        actualRedirectUrl: string,
        nonce: string,
        accessTokenName: string,
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        var redirectHash: string = sdpAuthCore.urlparse(actualRedirectUrl).fragment;
        if (!!redirectHash && redirectHash.indexOf("!#") == 0)
            redirectHash = redirectHash.substr(2);

        if (!this.isConnected())
            this.connect();

        this.webauth.parseHash(
            {
                hash: redirectHash,
                nonce: nonce,
                state: undefined
            },
            (err: ParseHashError, data: TokenPayload) =>
            {
                this.log.trace("callback(data=" + JSON.stringify(data) + ")");
                var userstate: any = undefined;

                // Handle errors:
                if (!!err)
                {
                    this.log.error("handleRedirect() returns error: " + JSON.stringify(err));

                    if (!!err.state)
                        userstate = JSON.parse(err.state);

                    return error(err, userstate);
                }

                // Handle missing results:
                if (!data)
                {
                    var msg = "Auth0.WebAuth.parseHash() returned neither error nor data";
                    this.log.error("handleRedirect(): " + msg);
                    return error(msg, userstate);
                }

                userstate = JSON.parse(data.state);

                // Check to see that we got what we asked for:
                if (!!accessTokenName) // <= ...if we asked for an access token
                {
                    if (!data.accessToken) // <= ... but did't get one
                    {
                        var msg = "Auth0.WebAuth.parseHash() did not return the requested access token \"" + accessTokenName + "\"";
                        this.log.error("handleRedirect(): " + msg);
                        return error(msg, userstate);
                    }
                }

                // If there's an idtoken and we can decode it...we're done
                if (!!data.idToken)
                {
                    var userinfo = jwt_decode(data.idToken);
                    if (!userinfo)
                    {
                        var msg = "idtoken " + data.idToken + "could not be decoded";
                        this.log.error("handleRedirect(): " + msg);
                        return error(msg, userstate);
                    }

                    this.log.info("handleRedirect(): idtoken " + JSON.stringify(userinfo));
                    return success(this.mapUser(data.idToken, userinfo as auth0jscode.UserInfo), data.accessToken, userstate);
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
                                return error(err, userstate);
                            }

                            if (!user)
                            {
                                var msg = "userInfo() returned neither result nor error";
                                this.log.error("handleRedirect(): " + msg);
                                return error("No user returned", userstate);
                            }

                            this.log.debug("userInfo() returns " + JSON.stringify(user));
                            return success(this.mapUser(data.idToken, user), data.accessToken, userstate);
                        }
                    );
                }

                var msg = "Auth0.WebAuth.parseHash() returned neither idtoken nor accesstoken";
                this.log.error("handleRedirect(): " + msg);
                return error(msg, userstate);
            }
        );
    };

    private mapUser(idtoken: string, src: auth0jscode.UserInfo): sdpAuthCore.UserInfo
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

    public acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void
    {
        error("IImplicitProvider flow does not support acquisition of additional access tokens");
    }
}

