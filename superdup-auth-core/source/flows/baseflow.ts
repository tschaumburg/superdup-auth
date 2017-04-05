import { UserInfo } from "../users";
import { ILogger } from "../logger";

export interface IBaseFlow {
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
        accessTokenName: string,
        success: (user: UserInfo, accessToken: string, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;
}

export interface IThreeLegggedFlow extends IBaseFlow
{
    acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void;
}
