import { IEvent } from "strongly-typed-events";
import { ILog } from "superdup-auth-log";

export interface ITokenProvider
{
    readonly providerId: string;

    provideTokenValue(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void,
        log: ILog
    ): void;

    readonly loggedIn: IEvent<void, void>;
    readonly loggingOut: IEvent<void, void>;
}