import { ILog } from "superdup-auth-log";
import { ILogin2 } from "./login2";
//import { ILogin, IHybridLogin } from "./loginmanager";
//import { IImplicitProvider, IHybridProvider } from "superdup-auth-core-providers";
import { UserInfo } from "superdup-auth-core-providers";
import { IAuthenticationConfig } from "./builders/iauthenticationconfig";
//import { TImplicitLoginBuilder, THybridLoginBuilder, ApiBuilder, TokenBuilder } from "./builders";


export interface IAuthenticationManager
{
    readonly config: IAuthenticationConfig;

    registerLogin(name: string, login: ILogin2): void;
    getLogin(loginName: string): ILogin2;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        //noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): boolean; // true means redirect

    resolveAccessToken(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}

