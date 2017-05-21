import { IImplicitProvider, IHybridProvider } from "superdup-auth-core-providers";
import { ITImplicitLoginBuilder } from "./iimplicitloginbuilder";
import { ITHybridLoginBuilder } from "./ihybridloginbuilder";
import { IApiBuilder } from "./iapibuilder";
import { ITokenBuilder } from "./itokenbuilder";
import { IAuthenticationManager } from "../iauthenticationmanager";


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

import { IApiManager } from "superdup-auth-core-apis";
import { ILoginManager } from "superdup-auth-core-login";
import { ITokenManager } from "superdup-auth-core-tokens";

import { AuthenticationConfig } from "./impl/authenticationconfig";
export function createConfigBuilder(
    log: ILog,
    loginManager: ILoginManager,
    tokenManager: ITokenManager,
    apiManager: IApiManager,
    authenticationManager: IAuthenticationManager
): IAuthenticationConfig
{
    return new AuthenticationConfig(log, loginManager, tokenManager, apiManager, authenticationManager);
}