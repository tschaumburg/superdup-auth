import logging = require("superdup-auth-log");
//import { ILogin } from "../ilogin";
import { UserInfo } from "../userinfo";
import { IImplicitProvider } from "./iimplicit";
import { IAuthcodeProvider } from "./iauthcode";
import { IHybridProvider } from "./ihybrid";
import { IBaseProvider } from "./ibase";

export interface IProviderManager
{
    registerImplicitProvider(
        loginName: string,
        creator: () => IImplicitProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        log: logging.ILog
    ): IProviderAdapter;

    registerAuthcodeProvider(
        loginName: string,
        creator: () => IAuthcodeProvider,
        requestRefreshToken: boolean,
        log: logging.ILog
    ): IProviderAdapter;

    registerHybridProvider(
        loginName: string,
        creator: () => IHybridProvider,
        idScopes: string[],
        requestAccessToken: { name: string, resource: string, scopes: string[] },
        requestRefreshToken: boolean,
        log: logging.ILog
    ): IProviderAdapter;

    findProvider(name: string): IProviderAdapter;
}

export interface IProviderAdapter
{
    //creator: () => IBaseProvider;
    //flow: IBaseProvider;
    login(
        nonce: string,
        state: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        redirecting: () => void,
        error: (reason: any) => void
    ): void;
    requestAccessToken(
        //tokenName: string,
        resource: string,
        scopes: string[],
        success: (token: string) => void,
        error: (reason: any) => void
    ): void;
    handleRedirect(
        url: string,
        nonce: string,
        success: (user: UserInfo, accessTokenName: string, accessToken: string) => void,
        error: (reason: any) => void
    ): void; 
    logout(): void;
}
