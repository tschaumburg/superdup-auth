declare module "auth0-js"
{
    // See https://auth0.com/docs/libraries/auth0js,
    // section "Initialization"
    export interface WebAuthOptions
    {
        domain: string;
        clientID: string;
        redirectUri?: string;
        scope?: string;
        audience?: string;
        responseType?: string;
        responseMode?: string;
        _disableDeprecationWarnings?: boolean;
    }

    export interface AuthorizeOptions
    {
        domain: string;
        clientID: string;
        redirectUri?: string;
        scope?: string;
        audience?: string;
        responseType?: string;
        responseMode?: string;
        connection?: string; // eg. 'facebook'
        _disableDeprecationWarnings?: boolean;
        // only visible in tests?:
        state?: string,
        nonce?: string,
    }

    //export class Authentication
    //{
    //    public userInfo(accessToken: string, cb: (error: any, result: any) => void): void;
    //}

    export interface Identity
    {
        provider?: string, //"google-oauth2",
        user_id?: string, //"114836281699862869560",
        connection?: string, //"google-oauth2",
        isSocial?: boolean
    }

    export interface UserInfo
    {
        email?: string,
        name?: string,
        given_name?: string,
        family_name?: string,
        picture?: string, // url
        gender?: string, //"male",
        locale?: string, //"en-GB",
        nickname?: string, //"thomas",
        app_metadata?: {}, //{ "roles": ["admin"] },
        roles?: string[], //["admin"],
        groups?: string[],
        email_verified?: boolean,
        clientID?: string, //"O6dRGzlPhkc...",
        updated_at?: string, //"2017-02-12T08:42:31.228Z",
        user_id?: string, //"google-oauth2|1148...869560",
        identities?: Identity[],
        created_at?: string, //"2017-01-10T15:16:18.641Z",
        sub?: string, //"google-oauth2|1148...869560"
    }

    export type t_callback<ResultType> = (
        err: {
            statusCode?: any,// = err.response.statusCode;
            statusText?: any,// = err.response.statusText;
            code?: any,// = err.error || err.code || err.error_code || err.status || null;
            description?: any,// = err.error_description || err.description || err.error || err.details || err.err || null;
            name?: any,// = err.name;
            policy?: any,// = err.policy;
        },
        result: ResultType
    ) => void;
    export type callback = t_callback<any>; /* data.text || data.body || data */

    export class Authentication
    {
        /**
         * Auth0 Authentication API client
         * @constructor
         * @param {Object} options
         * @param {Object} options.domain
         * @param {Object} options.clienID
         * @param {Object} options.responseType
         * @param {Object} options.responseMode
         * @param {Object} options.scope
         * @param {Object} options.audience
         * @param {Object} options._disableDeprecationWarnings
         */
        public constructor(
            options: {
                domain: string,
                clientID: string,
                responseType?: string,
                responseMode?: string,
                redirectUri?: string,
                scope?: string,
                audience?: string,
                _disableDeprecationWarnings?: boolean,
                _sendTelemetry?: boolean,
                _telemetryInfo?: Object
            }
        );

        /**
         * Builds and returns the `/authorize` url in order to initialize a new authN/authZ transaction
         *
         * @method buildAuthorizeUrl
         * @param {Object} options: https://auth0.com/docs/api/authentication#!#get--authorize_db
         * @param {Function} cb
         */
        public buildAuthorizeUrl(
            options: {
                clientID: string,
                redirectUri?: string,
                responseType: string,
                nonce: string
            }
        ): string;

        /**
         * Builds and returns the Logout url in order to initialize a new authN/authZ transaction
         *
         * @method buildLogoutUrl
         * @param {Object} options: https://auth0.com/docs/api/authentication#!#get--v2-logout
         */
        public buildLogoutUrl(options: Object): string;

        /**
         * Makes a call to the `oauth/token` endpoint with `password` grant type
         *
         * @method loginWithDefaultDirectory
         * @param {Object} options: https://auth0.com/docs/api-auth/grant/password
         * @param {Function} cb
         */
        public loginWithDefaultDirectory(
            options: {
                username: string,
                password: string,
                scope?: string,
                audience?: string
            },
            cb: callback): void;

        /**
         * Makes a call to the `oauth/token` endpoint with `password-realm` grant type
         *
         * @method login
         * @param {Object} options:
         * @param {Object} options.username
         * @param {Object} options.password
         * @param {Object} options.scope
         * @param {Object} options.audience
         * @param {Object} options.realm: the HRD domain or the connection name
         * @param {Function} cb
         */
        public login(
            options: {
                username: string,
                password: string,
                scope?: string,
                audience?: string,
                realm: string
            },
            cb: callback
        ): void;

        /**
         * Makes a call to the `oauth/token` endpoint
         *
         * @method oauthToken
         * @param {Object} options:
         * @param {Object} options.username
         * @param {Object} options.password
         * @param {Object} options.scope
         * @param {Object} options.audience
         * @param {Object} options.grantType
         * @param {Function} cb
         */
        public oauthToken(
            options: {
                username: string,
                password: string,
                scope?: string,
                audience?: string,
                grantType: string
            },
            cb: callback
        ): void;

        /**
         * Makes a call to the `/ro` endpoint
         *
         * @method loginWithResourceOwner
         * @param {Object} options:
         * @param {string} options.username
         * @param {Object} options.password
         * @param {Object} options.connection
         * @param {Object} options.scope
         * @param {Object} options.audience
         * @param {Function} cb
         * @deprecated `loginWithResourceOwner` will be soon deprecated, user `login` instead.
         */
        public loginWithResourceOwner(
            options: {
                username: string,
                password: string,
                connection: string,
                scope?: string,
                audience?: string
            },
            cb: callback
        ): void;

        /**
         * Makes a call to the `/ssodata` endpoint
         *
         * @method getSSOData
         * @param {Boolean} withActiveDirectories
         * @param {Function} cb
         * @deprecated `getSSOData` will be soon deprecated.
         */
        public getSSOData(cb: callback): void;
        public getSSOData(withActiveDirectories: boolean, cb: callback): void;

        /**
         * Makes a call to the `/userinfo` endpoint and returns the user profile
         *
         * @method userInfo
         * @param {String} accessToken
         * @param {Function} cb
         */
        public userInfo(accessToken: string, cb: t_callback<UserInfo>): void;

        /**
         * Makes a call to the `/delegation` endpoint
         *
         * @method delegation
         * @param {Object} options: https://auth0.com/docs/api/authentication#!#post--delegation
         * @param {Function} cb
         * @deprecated `delegation` will be soon deprecated.
         */
        public delegation(options: Object, cb: callback): void;

        /**
         * Fetches the user country based on the ip.
         *
         * @method getUserCountry
         * @param {Function} cb
         */
        public getUserCountry(cb: callback): void;
    }


    export class WebAuth
    {
        public client: Authentication;
        constructor(options: WebAuthOptions);

        /**
            * To login via the hosted login page, use the authorize method.
            *
            * This redirects to the hosted login page to initialize an
            * authN/authZ transaction.
            *
            * Note that the same authorize method can be used with a
            * 'connection' parameter to facilitate social connection logins,
            * as well.
    
    
            * @param options
            */
        authorize(options: AuthorizeOptions): void;

        /**
            * Parse the url hash and extract the returned tokens depending on the transaction.
            *
            * Only validates id_tokens signed by Auth0 using the RS256 algorithm using the public key exposed
            * by the `/.well-known/jwks.json` endpoint. Id tokens signed with other algorithms will not be
            * accepted.
            *
            * @method parseHash
            * @param {Object} options:
            * @param {String} options.state [OPTIONAL] to verify the response
            * @param {String} options.nonce [OPTIONAL] to verify the id_token
            * @param {String} options.hash [OPTIONAL] the url hash. If not provided it will extract from window.location.hash
            * @param {Function} cb: function(err, token_payload)
            */
        parseHash(options: ParseHashOptions, cb: (error: ParseHashError, token_payload: TokenPayload) => any): void;

        /**
            * Redirects to the auth0 logout page
            *
            * @method logout
            * @param {Object} options: https://auth0.com/docs/api/authentication#!#get--v2-logout
            */
        logout(options: LogoutOptions): void;
    }

    export interface LogoutOptions
    {
        clientID?: string;
        returnTo: string;
    }

    export interface ParseHashError
    {
        error: string;
        errorDescription: string;
        state?: string;
    }

    export interface ParseHashOptions
    {
        state?: string;
        nonce?: string;
        hash?: string;
    }

    export interface TokenPayload
    {
        accessToken: string;
        idToken: string;
        idTokenPayload: string;
        appStatus: string;
        refreshToken: string;
        state: string;
        expiresIn: string;
        tokenType: string;
    }
}
