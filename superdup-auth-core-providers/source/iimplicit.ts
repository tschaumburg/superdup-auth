import { UserInfo } from "./userinfo";
import { ILog } from "superdup-auth-log";
import { IBaseProvider } from "./ibase";

/**
The IImplicitProvider implementation calls this callback function when the
implicit login flow has completed succesfully.
*/
export type ImplicitSuccess =
    (
        /**
        */
        user: UserInfo,
        /**
        The JWT-encoded access token (if any was requested) - otherwise null
        */
        accessToken: string
    ) => void;

export type ImplicitRedirecting = () => void;

export type ImplicitFailure = (reason: any) => void;

export interface IImplicitProvider extends IBaseProvider
{
    /**
    Called to initiate the implicit auth flow.

    The implementation must eventually call exactly of the success, error or
    redirecting callbacks.
    */
    login(
        nonce: string,
        userstate: string,
        idScopes: string[],
        accessToken: { name: string, resource: string, scopes: string[] },
        success: ImplicitSuccess,
        redirecting: ImplicitRedirecting,
        error: ImplicitFailure
    ): void;

    handleRedirect(
        actualRedirectUrl: string,
        nonce: string,
        success: ImplicitSuccess,
        error: ImplicitFailure
    ): void;

    logout(): void;
}
