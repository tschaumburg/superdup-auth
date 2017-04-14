import oidcjs = require("oidc-client");
import sdpAuth = require("superdup-auth-core");
import jwt_decode = require("jwt-decode");
import { OidcOptions, LoginMechanism } from "./options";
import { BrowserInfo } from "./browserinfo";
import { OidcIdToken } from "./idtoken";

export class OidcIdentityProvider implements sdpAuth.IIdentityProvider {
    private log: sdpAuth.ILogger = console;
    public setLog(_log: sdpAuth.ILogger): void {
        this.log = _log;
    }

    private static decideMechanism(): LoginMechanism {
        var browserInfo = BrowserInfo.current();
        var browserName = browserInfo.browserName;
        var browserMajorVersion = browserInfo.majorVersion;

        var mechanism = LoginMechanism.popup;
        if (browserName === 'IE')
            mechanism = LoginMechanism.redirect;

        return mechanism;
    }

    private manager: Oidc.UserManager;
    private loginMechanism: LoginMechanism;
    private readonly currentUrl: string;

    public constructor(private readonly oidcOptions: OidcOptions) {
        this.loginMechanism = OidcIdentityProvider.decideMechanism();

        // point the redirectUri back here (lose the hash fragment, though)
        var currentUrl = window.location.href;
        var index = currentUrl.indexOf('#');
        if (index > 0)
            currentUrl = currentUrl.substring(0, index);
        this.currentUrl = currentUrl;

        this.manager =
            new Oidc.UserManager(
                {
                    authority: oidcOptions.issuer,                        // "https://login.microsoftonline.com/superdup.onmicrosoft.com/v2.0/"
                    metadataUrl: oidcOptions.metadataUrl,                 // "https://localhost/SuperDup.WebAdmin/api/Metadata"
                    client_id: oidcOptions.clientId,                      // "37700246-3a66-4a42-8109-498458d2f7a3"
                    scope: oidcOptions.scope,                             // "openid email profile 37700246-3a66-4a42-8109-498458d2f7a3"
                    response_type: 'token id_token',                       // 'token id_token'
                    popup_redirect_uri: oidcOptions.redirectUri || currentUrl, // currentUrl
                    redirect_uri: oidcOptions.redirectUri || currentUrl,       // currentUrl
                    silent_redirect_uri: currentUrl,                       // currentUrl
                    post_logout_redirect_uri: oidcOptions.post_logout_redirect_uri || currentUrl, // currentUrl 
                    // Setup to renew token access automatically
                    automaticSilentRenew: true,
                    silentRequestTimeout: 5000,
                    // Add expiration nofitication time
                    accessTokenExpiringNotificationTime: 20,
                    filterProtocolClaims: true,
                    userStore: new Oidc.WebStorageStateStore({ store: localStorage })
                });
    }

    private isConnected(): boolean {
        return (!!this.manager);
    }

    private connect(): void {
        if (!this.manager)
            this.manager =
                new Oidc.UserManager(
                    {
                        authority: this.oidcOptions.issuer,                        // "https://login.microsoftonline.com/superdup.onmicrosoft.com/v2.0/"
                        metadataUrl: this.oidcOptions.metadataUrl,                 // "https://localhost/SuperDup.WebAdmin/api/Metadata"
                        client_id: this.oidcOptions.clientId,                      // "37700246-3a66-4a42-8109-498458d2f7a3"
                        scope: this.oidcOptions.scope,                             // "openid email profile 37700246-3a66-4a42-8109-498458d2f7a3"
                        response_type: 'token id_token',                       // 'token id_token'
                        popup_redirect_uri: this.oidcOptions.redirectUri || this.currentUrl, // currentUrl
                        redirect_uri: this.oidcOptions.redirectUri || this.currentUrl,       // currentUrl
                        silent_redirect_uri: this.currentUrl,                       // currentUrl
                        post_logout_redirect_uri: this.oidcOptions.post_logout_redirect_uri || this.currentUrl, // currentUrl 
                        // Setup to renew token access automatically
                        automaticSilentRenew: true,
                        silentRequestTimeout: 5000,
                        // Add expiration nofitication time
                        accessTokenExpiringNotificationTime: 20,
                        filterProtocolClaims: true,
                        userStore: new Oidc.WebStorageStateStore({ store: localStorage })
                    });
    }

    private MapUser(encodedIdToken: string, user: OidcIdToken): sdpAuth.UserInfo
    {
        var res: sdpAuth.UserInfo =
            {
                uid: user.sub,
                idtoken: encodedIdToken,
                handle: user.sub,
                familyName: "",
                givenName: "",
                picture: ""
            };
        return res;
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
        var encodedState = JSON.stringify(state);
        var self = this;

        if (this.loginMechanism == LoginMechanism.popup) {
            this.signinPopup(encodedState)
                .then((result: Oidc.User) => { self.handleLoginResult(result, success, error); })
                .catch((reason: any) => { error(reason, state);});
        }
        else if (this.loginMechanism == LoginMechanism.redirect) {
            this.signinRedirect(encodedState); // redirect => never returns...
            this.log.error("Should have redirected");
            error("Should have redirected", state);
        }
        else {
            this.log.error("Only popup and redirect login mechanisms are currently supported");
            error("Only popup and redirect login mechanisms are currently supported", state);
            throw new Error("Only popup and redirect login mechanisms are currently supported");
        }

        //if (this.options.flow == AuthFlow.implicit)
        //{
        //    // update the state with the name of any requested access token:
        //    var tokenstate =
        //        {
        //            mod: state.mod,
        //            idp: state.idp,
        //            uss: state.uss,
        //            at: requestAccessToken && requestAccessToken.name,
        //        };
        //    var encodedState = JSON.stringify(tokenstate);

        //    // we're just requesting an idtoken:
        //    var audience: string = undefined;
        //    var scopestring = "openid profile";
        //    var responsetype = "id_token";

        //    // if a piggybacked access token is requested, update
        //    // the params:
        //    if (!!requestAccessToken)
        //    {
        //        audience = requestAccessToken.resource;
        //        scopestring = "openid profile " + requestAccessToken.scopes.join(" ");
        //        responsetype = "id_token token";
        //    }

        //    // make sure we're connected:
        //    if (!this.isConnected())
        //        this.connect();

        //    var domain = this.options && this.options.domain;
        //    var clientId = this.options && this.options.clientId && this.options.clientId.substr(8);
        //    this.log.info(
        //        "webauth.authorize(" + 
        //        "domain=" + domain + ", " +
        //        "clientID=" + clientId + ", " +
        //        "audience=" + audience + ", " +
        //        "scope=" + scopestring + ", " +
        //        "state=" + encodedState + ", " +
        //        "responseType=" + responsetype + ", " +
        //        "redirectUri =" + this.options.redirectUri +
        //        ")");

        //    this.webauth.authorize(
        //        {
        //            domain: this.options && this.options.domain,
        //            clientID: this.options && this.options.clientId,
        //            audience: audience, // 'https://api.superdup.dk'
        //            scope: scopestring, //'read:boards edit:boards'
        //            state: encodedState,
        //            responseType: responsetype, // 'id_token token',
        //            redirectUri: this.options.redirectUri,
        //            nonce: "x",
        //        }
        //    );
        //}
        //else
        //{
        //    error("Unsupported auth flow " + this.options.flow + " requested", state.uss);
        //}
    }


    private signinPopup(data: any): Promise<Oidc.User> {
        this.log.trace('Calling signinPopup()');

        var self = this;
        return this.manager
            .signinPopup()
            .then((user: Oidc.User) => {
                //this.superdupLoggingService.username = self.username;
                self.log.trace('signingPopup() succeeded');
                return user;
            })
            .catch(function (error) {
                self.log.info('signinPopup() failed: ' + JSON.stringify(error));
            });
    }

    private signinRedirect(data: any): Promise<void> {
        this.log.trace('Calling signinRedirect()');

        var self = this;

        return this
            .manager
            .signinRedirect({ data: data })
            .catch(function (error) {
                self.log.info('signinRedirect() failed: ' + JSON.stringify(error));
            });
    }

    //private mapUser(idtoken: string, src: auth0jscode.UserInfo): sdpAuth.UserInfo
    //{
    //    if (!src)
    //        return null;

    //    return {
    //        uid: src.sub,
    //        handle: src.nickname || src.given_name || src.name || src.family_name || src.email || src.sub,
    //        givenName: src.given_name,
    //        familyName: src.family_name,
    //        picture: src.picture,
    //        idtoken: idtoken
    //    }
    //}

    public handleRedirect(
        accessTokenName: string,
        actualRedirectUrl: string,
        userstate: any,
        success: (user: sdpAuth.UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void 
    {
        var self = this;
        this.manager
            .signinRedirectCallback(actualRedirectUrl)
            .then((result) => { self.handleLoginResult(result, success, error); })
            .catch((reason) => { error(reason, userstate); });
    }


    private handleLoginResult(
        loginResult: Oidc.User,
        success: (user: sdpAuth.UserInfo, accessToken: string, userstate: any) => void,
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

        var state = JSON.parse(encodedstate) as { mod: string; idp: string; at:string; uss: any; };
        if (!state)
        {
            var msg = "";
            this.log.error(msg);
            error(msg, null);
        }

        var accessTokenName = state.at;
        // Check to see that we got what we asked for:
        if (!!accessTokenName) // <= ...if we asked for an access token
        {
            if (!loginResult.access_token) // <= ... but did't get one
            {
                var msg = "Login response did not return the requested access token \"" + accessTokenName + "\"";
                this.log.error("handleRedirect(): " + msg);
                return error(msg, loginResult.state);
            }
        }

        // If there's an idtoken and we can decode it...we're done
        if (!!loginResult.id_token) {
            var userinfo = jwt_decode(loginResult.id_token);
            if (!userinfo) {
                var msg = "idtoken " + loginResult.id_token + "could not be decoded";
                this.log.error("handleRedirect(): " + msg);
                return error(msg, loginResult.state);
            }

            this.log.info("handleRedirect(): idtoken " + JSON.stringify(userinfo));
            return success(this.MapUser(loginResult.id_token, userinfo as OidcIdToken), loginResult.access_token, loginResult.state);
        }
    }

    public acquireAccessToken(
        resource: string,
        scopes: string[],
        refreshIfPossible: boolean,
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void
    {
        throw new Error("Not implemented");
        //success(null);
    }

    // Should be part of I/F - but isn't:
    public logout(): Promise<void> {
        this.log.trace('Calling signoutRedirect()');

        var self = this;
        return this.manager
            .signoutRedirect()
            .then(() => {
                //self._oidcUser = null;
            })
            .catch(function (error) {
                self.log.info('signoutRedirect() failed: ' + JSON.stringify(error));
            });
    }
}