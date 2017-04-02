export interface AccessTokenInfo
{
    tokenName: string;
    loginName: string;
    resource: string;
    scopes: string[];
    protectUrls: string[];
    tokenValue: string;
    expiresAt: number;
}
