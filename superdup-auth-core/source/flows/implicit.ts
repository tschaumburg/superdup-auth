import { UserInfo } from "../users";
import { ILogger } from "../logger";

export interface Implicit<TOptions>
{
    initImplicit(options: TOptions, log: ILogger): void;

    loginImplicit(
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

    acquireAccessToken(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}
