import { UserInfo } from "../users";
import { ILogger } from "../logger";

export interface IImplicitFlow
{
    registerImplicitFlow(
        flowname: string,
        requestAccessToken: { name: string, resource: string, scopes: string[] }
    ): void;

    loginImplicitFlow(
        flowname: string,
        userstate: any,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;
}

export interface IPlugin<TOptions>
{
    setLog(log: ILogger): void;

    registerIdentityProvider(
        identityProviderName: string,
        providerOptions: TOptions
    ): void;

    login(
        identityProviderName: string,
        userstate: any,
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    handleRedirect(
        identityProviderName: string,
        accessTokenName: string,
        actualRedirectUrl: string,
        userstate: any,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    acquireAccessToken(
        identityProviderName: string,
        resource: string,
        scopes: string[],
        refreshIfPossible: boolean,
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void;
}
