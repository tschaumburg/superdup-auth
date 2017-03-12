import sdpAuth = require("superdup-auth-core");
import { WebAuth, ParseHashError, TokenPayload } from "auth0-js";
import auth0jscode = require("auth0-js");
/////<reference types="./auth0-js.d.ts" />
import { Auth0jsOptions, AuthFlow } from "./options";
//import { jwt_decode } from "jwt-decode";
import jwt_decode = require("jwt-decode");

export class Auth0jsIdentityProvider implements sdpAuth.IIdentityProvider
{
    private webauth: WebAuth;

    public constructor(private readonly options: Auth0jsOptions)
    { }

    private log: sdpAuth.ILogger = console;
    public setLog(_log: sdpAuth.ILogger): void
    {
        this.log = _log;
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
        state: {
            mod: string;
            idp: string;
            uss: any;
        },
        requestAccessToken: {
            name: string,
            resource: string,
            scopes: string[],
        },
        success: (user: sdpAuth.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        if (this.options.flow == AuthFlow.implicit)
        {
            // update the state with the name of any requested access token:
            var tokenstate =
                {
                    mod: state.mod,
                    idp: state.idp,
                    uss: state.uss,
                    at: requestAccessToken && requestAccessToken.name,
                };
            var encodedState = JSON.stringify(tokenstate);

            // we're just requesting an idtoken:
            var audience: string = undefined;
            var scopestring = "openid profile";
            var responsetype = "id_token";

            // if a piggybacked access token is requested, update
            // the params:
            if (!!requestAccessToken)
            {
                audience = requestAccessToken.resource;
                scopestring = "openid profile " + requestAccessToken.scopes.join(" ");
                responsetype = "id_token token";
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
                    nonce: "x",
                }
            );
        }
        else
        {
            error("Unsupported auth flow " + this.options.flow + " requested", state.uss);
        }
    }

    private mapUser(idtoken: string, src: auth0jscode.UserInfo): sdpAuth.UserInfo
    {
        if (!src)
            return null;

        return {
            uid: src.sub,
            handle: src.nickname || src.given_name || src.name || src.family_name || src.email || src.sub,
            givenName: src.given_name,
            familyName: src.family_name,
            picture: src.picture,
            idtoken: idtoken
        }
    }

    public handleRedirect(
        accessTokenName: string,
        actualRedirectUrl: string,
        userstate: any,
        success: (user: sdpAuth.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        var redirectHash: string = sdpAuth.urlparse(actualRedirectUrl).fragment;
        if (!!redirectHash && redirectHash.indexOf("!#") == 0)
            redirectHash = redirectHash.substr(2);

        if (!this.isConnected())
            this.connect();

        this.webauth.parseHash(
            {
                hash: redirectHash,
                nonce: "x",
                state: undefined
            }, 
            (err: ParseHashError, data: TokenPayload) =>
            {
                // Handle errors:
                if (!!err)
                {
                    this.log.error("handleRedirect() returns error: " + JSON.stringify(error));
                    return error(err, userstate);
                }

                // Handle missing results:
                if (!data)
                {
                    var msg = "Auth0.WebAuth.parseHash() returned neither error nor data";
                    this.log.error("handleRedirect(): " + msg);
                    return error(msg, userstate);
                }

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
    }

    //private extractUser(payload: auth0.TokenPayload): sdpAuth.UserInfo
    //{
    //    return {
    //        uid: payload.idToken,
    //        handle: "",
    //        givenName: "",
    //        familyName:"",
    //    };
    //}

    public acquireAccessToken(
        resource: string,
        scopes: string[],
        refreshIfPossible: boolean,
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        success(null);
    }
}