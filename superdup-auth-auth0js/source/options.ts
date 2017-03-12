export interface Auth0jsOptions
{
    domain: string;
    clientId: string;
    flow: AuthFlow;
    redirectUri: string;
}

export enum AuthFlow
{
    implicit,
    authCode
}
