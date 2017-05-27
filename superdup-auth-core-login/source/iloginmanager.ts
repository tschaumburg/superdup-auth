import { ILog } from "superdup-auth-log"; 
//import { ILogin } from "./ilogin";
//import { IImplicitLogin } from "./iimplicitlogin";
//import { IHybridLogin } from "./ihybridlogin";
//import { IAuthCodeLogin } from "./iauthcodelogin";
import { UserInfo } from "superdup-auth-core-providers";
import { IImplicitProvider, IHybridProvider, IAuthcodeProvider, IProviderManager } from "superdup-auth-core-providers"; 

export interface ILoginManager
{
    //********************************************************************
    //* Defining the logins:
    //* ====================
    //* 
    //* 
    //********************************************************************
    defineImplicitLogin(
        loginName: string,
        flow: (log: ILog) => IImplicitProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] }
    ): void;

    defineHybridLogin(
        loginName: string,
        flow: (log: ILog) => IHybridProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean
    ): void;

    defineAuthcodeLogin(
        loginName: string,
        flow: (log: ILog) => IAuthcodeProvider,
        requestRefreshToken: boolean
    ): void;




    //********************************************************************
    //* Using the logins:
    //* =================
    //* 
    //* 
    //********************************************************************
    login(
        loginName: string,
        userstate: any,
        success: (userstate: any, accessTokenValue: string) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void;

    logout(loginName: string): void;

    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): boolean;

    acquireAccessToken(
        loginName: string,
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;

    getUser(loginName: string): UserInfo;
    readonly loginNames: string[];
}

