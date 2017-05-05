import { UserInfo } from "../userinfo";
import { ILog } from "superdup-auth-log";

export interface IAuthcodeProvider
{
    login(
        requestRefreshToken: boolean,
        nonce: string,
        userstate: string,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void;

    handleRedirect(
        actualRedirectUrl: string,
        nonce: string,
        success: () => void,
        error: (reason: any) => void
    ): void;

    requestAccessToken(
        resource: string,
        scopes: string[],
        success: (accessToken: string) => void,
        error: (reason: any) => void
    ): void;

    logout(): void;
}
