import { ILogger } from "./logger";
import { UserInfo} from "./userinfo";
//import { ITokenManager, createTokenManager, decodeHash } from "./tokens";
import { IImplicitProvider, IHybridProvider, IProviderManager } from "./providers";
//import { IImplicitBuilder } from "./builders";

export interface ILoginManager
{
    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    registerImplicitProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IImplicitProvider,
        flowOptions: TOptions
    ): ILogger;

    registerHybridProvider<TOptions>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => IHybridProvider,
        flowOptions: TOptions,
        log: ILogger
    ): void;

    registerAccessToken(
        tokenName: string,
        loginName: string,
        resource: string,
        scopes: string[],
        protectUrls: string[]
    ): void;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    login(
        loginName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void,
        log: ILogger
    ): void;

    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
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

