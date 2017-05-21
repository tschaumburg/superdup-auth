import { ILog } from "superdup-auth-log"; 
import { ILogin } from "./ilogin";
import { IImplicitLogin } from "./iimplicitlogin";
import { IHybridLogin } from "./ihybridlogin";
import { IAuthCodeLogin } from "./iauthcodelogin";
import { UserInfo } from "superdup-auth-core-providers";
import { IImplicitProvider, IHybridProvider, IAuthcodeProvider, IProviderManager } from "superdup-auth-core-providers"; 

export interface ILoginManager
{
    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    createImplicitLogin(
        loginName: string,
        flow: (log: ILog) => IImplicitProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] }
    ): IImplicitLogin;

    createHybridLogin(
        loginName: string,
        flow: (log: ILog) => IHybridProvider,
        idScopes: string[],
        initialAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean
    ): IHybridLogin;

    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        //noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): boolean;

    createAuthcodeLogin(
        loginName: string,
        flow: (log: ILog) => IAuthcodeProvider,
        requestRefreshToken: boolean
    ): IAuthCodeLogin;

    getLogin(loginName: string): ILogin;

    readonly loginNames: string[];
}

