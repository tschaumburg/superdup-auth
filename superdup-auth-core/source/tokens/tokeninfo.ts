export interface AccessTokenInfo
{
    pluginName: string;
    identityProviderName: string;
    tokenName: string;
    resource: string;
    scopes: string[];
    protectUrls: string[];
    tokenValue: string;
    expiresAt: number;
}
