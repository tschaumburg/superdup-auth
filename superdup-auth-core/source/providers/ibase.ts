import { UserInfo } from "../userinfo";
import { ILogger } from "../logger";

export interface IBaseProvider {
    login(
        nonce: string,
        userstate: any,
        accessToken: { name: string, resource: string, scopes: string[] },
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    handleRedirect(
        actualRedirectUrl: string,
        nonce: string,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;
}

export interface IThreeLegggedFlow extends IBaseProvider
{
    acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void;
}
