import sdpAuthCore = require("superdup-auth-core");
import { Logger } from "oidc-client";
import { OidcOptions, LoginMechanism } from "./options";
import jwt_decode = require("jwt-decode");

export class OidcImplicit implements sdpAuthCore.IImplicitProvider
{
    private log: sdpAuthCore.ILogger = console;
    private manager: Oidc.UserManager;

    public constructor(private readonly options: OidcOptions, log: sdpAuthCore.ILogger)
    {
        if (!log)
            log = console;

        this.log = log;
    }

    isConnected(): boolean
    {
        return (!!this.manager);
    }

    connect(): void
    {
        if (!this.manager)
            this.manager =
                new Oidc.UserManager(
                    {
                        authority: this.options.authority,                     // "https://login.microsoftonline.com/superdup.onmicrosoft.com/v2.0/"
                        metadataUrl: this.options.metadataProxyUrl,            // "https://localhost/SuperDup.WebAdmin/api/Metadata"
                        client_id: this.options.clientId,                      // "37700246-3a66-4a42-8109-498458d2f7a3"
                        scope: null,                                           // "openid email profile 37700246-3a66-4a42-8109-498458d2f7a3"
                        response_type: null,                                   // 'token id_token'
                        popup_redirect_uri: this.options.popupRedirectUri,     // currentUrl
                        redirect_uri: this.options.redirectUri,                // currentUrl
                        post_logout_redirect_uri: null,
                        // Setup to renew access tokens automatically
                        automaticSilentRenew: false,
                        accessTokenExpiringNotificationTime: 20,
                        silentRequestTimeout: 5000,
                        silent_redirect_uri: null,
                        // 
                        filterProtocolClaims: true,
                        userStore: new Oidc.WebStorageStateStore({ store: localStorage })
                    });
    }

    public login(
        nonce: string,
        userstate: any,
        accessToken: { name: string, resource: string, scopes: string[] },
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void
    {
        var encodedState = JSON.stringify(userstate);//(tokenstate);

        // we're just requesting an idtoken:
        var audience: string = undefined;
        var scopestring = "openid profile";
        var responsetype = "id_token";

        // if a piggybacked access token is requested, update
        // the params:
        if (!!accessToken)
        {
            audience = accessToken.resource;
            scopestring = "openid profile " + accessToken.scopes.join(" ");
            responsetype = "id_token token";
        }

        // make sure we're connected:
        if (!this.isConnected())
            this.connect();

        switch (this.options.loginMechanism) {
            case LoginMechanism.popup:
                return this.signinPopup(nonce, scopestring, responsetype, userstate, success, error);
            case LoginMechanism.redirect:
                return this.signinRedirect(nonce, scopestring, responsetype, userstate, success, error);
            default:
                throw new Error("Only popup and redirect login mechanisms are currently supported");
        }
    }

    private signinPopup(
        nonce: string,
        scope: string,
        responseType: string,
        userstate: any,
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        this.log.trace('Calling signinPopup()');

        var requestdata =
            {
                response_type: responseType,
                scope: scope,
                state: userstate,
                //redirect_uri,
                //prompt,
                //display,
                //max_age,
                //ui_locales,
                //id_token_hint,
                //login_hint,
                //acr_values,
                //resource,
                //request,
                //request_uri
            };

        this.log.info("oidc.UserManager.signinPopup(" + JSON.stringify(requestdata) + ")");

        var self = this;
        this.manager
            .signinPopup(requestdata)
            .then((user: Oidc.User) =>
            {
                //this.superdupLoggingService.username = self.username;
                self.log.trace('signingPopup() succeeded');
                success(this.mapUser(user), null, userstate);
            })
            .catch(function (reason: any)
            {
                self.log.info('signinPopup() failed: ' + JSON.stringify(reason));
                error(reason, userstate);
            });
    }

    private signinRedirect(
        nonce: string,
        scope: string,
        responseType: string,
        userstate: any,
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
            this.log.trace('Calling signinRedirect()');

            var requestdata =
                {
                    response_type: responseType,
                    scope: scope,
                    state: userstate,
                    //redirect_uri,
                    //prompt,
                    //display,
                    //max_age,
                    //ui_locales,
                    //id_token_hint,
                    //login_hint,
                    //acr_values,
                    //resource,
                    //request,
                    //request_uri
                };

            this.log.info("oidc.UserManager.signinRedirect(" + JSON.stringify(requestdata) + ")");

            var self = this;
            this.manager
                .signinRedirect(requestdata)
                .then((tmp: any) =>
                {
                    //this.superdupLoggingService.username = self.username;
                    self.log.trace('signinRedirect() request sent - result will be returned in an HTTPS 302 (redirect)');
                    success(null, null, userstate);
                })
                .catch(function (reason: any)
                {
                    self.log.info('signinRedirect() failed: ' + JSON.stringify(reason));
                    error(reason, userstate);
                });
        }

    public handleRedirect(
        nonce: string,
        actualRedirectUrl: string,
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        var self = this;
        this.manager
            .signinRedirectCallback(actualRedirectUrl)
            .then((result: Oidc.User) => { self.handleLoginResult(result, success, error); })
            .catch((reason: any) => { error(reason, null); });
    };

    private handleLoginResult(
        loginResult: Oidc.User,
        success: (user: sdpAuthCore.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        if (!loginResult)
        {
            var msg = "";
            this.log.error(msg);
            error(msg, null);
        }

        var encodedstate = loginResult.state as string;
        if (!encodedstate)
        {
            var msg = "";
            this.log.error(msg);
            error(msg, null);
        }

        var state = JSON.parse(encodedstate) as { mod: string; idp: string; at: string; uss: any; };
        if (!state)
        {
            var msg = "";
            this.log.error(msg);
            error(msg, null);
        }

        // If there's an idtoken and we can decode it...we're done
        if (!!loginResult.id_token)
        {
            var idtoken = loginResult.id_token;
            var idtoken_claims = loginResult.profile;
            //var userinfo = jwt_decode(loginResult.id_token);
            //if (!userinfo)
            //{
            //    var msg = "idtoken " + loginResult.id_token + "could not be decoded";
            //    this.log.error("handleRedirect(): " + msg);
            //    return error(msg, loginResult.state);
            //}

            this.log.info("handleRedirect(): idtoken " + JSON.stringify(idtoken_claims));
            return success(this.mapUser(loginResult), loginResult.access_token, loginResult.state);
        }
    }

    private mapUser(src: Oidc.User): sdpAuthCore.UserInfo
    {
        if (!src)
            return null;

        if (!src.profile)
            return null;

        return {
            uid: src.profile.sub,
            handle: null, //src.nickname || src.given_name || src.name || src.family_name || src.email || src.sub,
            givenName: null, //src.given_name,
            familyName: null, //src.family_name,
            picture: null, //src.picture,
            idtoken: src.id_token,
            idtokenClaims: src.profile,
        }
    }
}

