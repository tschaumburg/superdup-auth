import logging = require("../logger");
import { ILogin } from "../ilogin";
import { UserInfo } from "../userinfo";
import { IImplicitProvider } from "./iimplicit";
import { IHybridProvider } from "./ihybrid";
import { IBaseProvider } from "./ibase";

export interface IProviderManager
{
    registerImplicitProvider(
        loginName: string,
        creator: () => IImplicitProvider,
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        log: logging.ILogger
    ): void;

    registerHybridProvider(
        loginName: string,
        creator: () => IHybridProvider,
        requestAccessToken: { name: string, resource: string, scopes: string[], protectUrls: string[] },
        requestRefreshToken: boolean,
        log: logging.ILogger
    ): void;

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
    acquireAccessToken(
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
