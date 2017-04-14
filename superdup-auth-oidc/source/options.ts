export enum LoginMechanism
{
    popup = 0,
    redirect = 1,
    iframe = 2
}

// See https://github.com/IdentityModel/oidc-client-js/wiki
export interface OidcOptions
{

    /**
    The URL of the OIDC/OAuth2 metadata provider
    */
    authority: string;

    /**
    If the metadata provider specified by 'authority' has CORS enabled (we're loooking
    at you, Microsoft...), you can set up a proxy to bypass:
    */
    metadataProxyUrl?: string;

    /**
    */
    //metadataUrl: string;

    /**
    */
    //protectedDomains: string[];

    /**
    Your client application's identifier as registered with the OIDC/OAuth2 provider.
    */
    clientId: string;

    /**
     The type of response desired from the OIDC/OAuth2 provider (default 'id_token')
    */
    //responseType: string;

    /**
     The OIDC/OAuth2 post-logout redirect URI.
    */
    //post_logout_redirect_uri: string;

    /**
    The scope being requested from the OIDC/OAuth2 provider (default: 'openid')
    */
    //scope: string;

    /**
    */
    loginMechanism: LoginMechanism;

    /**
     The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider
    */
    redirectUri: string;

    /**
    The URL for the page containing the call to signinPopupCallback to handle the callback from the OIDC/OAuth2
    */
    popupRedirectUri?: string;
}
