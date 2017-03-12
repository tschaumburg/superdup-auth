// See https://auth0.com/docs/libraries/auth0js,
// section "Initialization"
export declare interface WebAuthOptions
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

export declare interface AuthorizeOptions
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

export declare class Authentication
{
    public userInfo(accessToken: string, cb: (error: any, result: any) => void): void;
}

export declare class WebAuth
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

