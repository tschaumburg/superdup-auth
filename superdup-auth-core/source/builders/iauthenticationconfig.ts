import { IImplicitProvider, IHybridProvider } from "../providermanager";
import { ITImplicitLoginBuilder } from "./iimplicitloginbuilder";
import { ITHybridLoginBuilder } from "./ihybridloginbuilder";
import { IApiBuilder } from "./iapibuilder";
import { ITokenBuilder } from "./itokenbuilder";


export interface IAuthenticationConfig
{
    api(...urls: string[]): IApiBuilder;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    token(resource: string, scopes: string[]): ITokenBuilder;

    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    implicitLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IImplicitProvider
    ): ITImplicitLoginBuilder<TOptions>;

    hybridLogin<TOptions>(
        flow: new (args: TOptions, log: ILog) => IHybridProvider
    ): ITHybridLoginBuilder<TOptions>;

    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    verify(): void;
}

import { ILog } from "superdup-auth-log";

import { IApiManager } from "../apimanager";
import { ILoginManager } from "../loginmanager";
import { ITokenManager } from "../tokenmanager";

import { AuthenticationConfig } from "./impl/authenticationconfig";
export function createConfigBuilder(
    log: ILog,
    loginManager: ILoginManager,
    tokenManager: ITokenManager,
    apiManager: IApiManager
): IAuthenticationConfig
{
    return new AuthenticationConfig(log, loginManager, tokenManager, apiManager);
}