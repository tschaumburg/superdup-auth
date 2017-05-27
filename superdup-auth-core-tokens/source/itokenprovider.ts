import { IEvent } from "./ievent";

export interface ITokenProvider
{
    readonly providerId: string;

    provideTokenValue(
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;

    //readonly loggedIn: IEvent;
    //readonly loggingOut: IEvent;
}