import { ILogger } from "./logger";
import { ILogin } from "./ilogin";
import { UserInfo } from "./userinfo";
//import { ITokenManager, createTokenManager, decodeHash } from "./tokens";
import { IImplicitProvider, IHybridProvider, IProviderManager } from "./providers";
//import { IImplicitBuilder } from "./builders";

export interface ILoginManager
{
    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    registerImplicitProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider,
        flowOptions: TOptions,
        initialAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] }
    ): ILogin;

    registerHybridProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IHybridProvider,
        flowOptions: TOptions,
        initialAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        additionalAccessTokens: { name: string, resource: string, scopes: string[], protectUrls: string[] }[],
        requestRefreshToken: boolean
    ): ILogin;

    //registerAccessToken(
    //    tokenName: string,
    //    resource: string,
    //    scopes: string[],
    //    protectUrls: string[]
    //): void;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    login(
        loginName: string,
        userstate: any,
        success: () => void,
        redirecting: () => void,
        error: (reason: any) => void,
        log: ILogger
    ): void;

    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any;

    logout2(
        loginName: string,
        log: ILogger
    ): void;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    getUser(
        loginName: string,
        log: ILogger
    ): UserInfo;

    getTokenNames(loginName: string, log: ILogger): string[];
    getTokenValue(tokenName: string): string;
    //listAccessTokens(): string[];

    resolveAccessToken(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}

