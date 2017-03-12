import { ILogger } from "../logger";
import { UserInfo } from "../users";

export interface IIdentityProvider
{
    setLog(log: ILogger): void;

    login(
        state: { mod: string, idp: string, uss: any },
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    handleRedirect(
        actualRedirectUrl: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    acquireAccessToken(
        resource: string,
        scopes: string[],
        refreshIfPossible: boolean,
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void;
}
