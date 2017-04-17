import { UserInfo } from "./userinfo";
import { ILogger } from "./logger";

export interface ILogin 
{
    /**
    Initiates an OAuth2/OpenID login, as configured for this login.

    The result is returned using either the callback- or redirect-style
    (the style used is determined by the provider).

    A callback-style provider will eventually call either the success
    or error callback.

    A redirect-style provider will call either the redirecting callback
    (indicating that the authorize request has been sent to the server,
    and that a redirect carrying the response is imminent) or the error 
    callback (indicating that the authorize request could not be sent)
    */
    login(
        userstate: any,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void;

    /**
    Clears all client side state for this login (tokens and UserInfo data),
    and calls the server to clear any server-side state, including any
    session cookies.
    */
    logout(): void;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    readonly user: UserInfo;
    getTokenNames(): string[];
    getTokenValue(tokenName: string): string;

    //listAccessTokens(): string[];
}
