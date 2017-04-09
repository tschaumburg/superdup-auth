import { UserInfo } from "../userinfo";
import { ILogger } from "../logger";

export interface ILogin {
    login(
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

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
