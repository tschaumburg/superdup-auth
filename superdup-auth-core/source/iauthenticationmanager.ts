import { ILog } from "superdup-auth-log";
import { ILogin, IHybridLogin } from "./loginmanager";
import { IImplicitProvider, IHybridProvider } from "./providermanager";
import { UserInfo } from "./userinfo";
import { TImplicitLoginBuilder, THybridLoginBuilder, ApiBuilder, TokenBuilder } from "./builders";


export interface IAuthenticationManager
{
    //api(urlPrefix: string): ApiBuilder;

    token(resource: string, scopes: string[]): TokenBuilder;

    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    implicitLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ): TImplicitLoginBuilder<TOptions>;

    hybridLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IHybridProvider
    ): THybridLoginBuilder<TOptions>;

    getLogin(loginName: string): ILogin;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        noRedirect: () => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any;

    resolveAccessToken(
        url: string,
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
}

