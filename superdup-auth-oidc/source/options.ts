export enum LoginMechanism {
    popup = 0,
    redirect = 1,
    iframe = 2
}

export class OidcOptions {
    public metadataUrl: string;
    public protectedDomains: string[];
    public issuer: string;
    public clientId: string;
    public redirectUri: string;
    public post_logout_redirect_uri: string;
    public scope: string;
}
