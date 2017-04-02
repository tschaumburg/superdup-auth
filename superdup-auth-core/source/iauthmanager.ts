import { ILogger } from "./logger";
import { UserInfo, IUserManager, createUserManager } from "./users";
//import { IPlugin, IPluginManager, createPluginManager } from "./plugins";
import { ITokenManager, createTokenManager, decodeHash } from "./tokens";
import { Implicit, IFlowManager, createFlowManager } from "./flows";

export interface IAuthManager
{
    readonly tokenManager: ITokenManager;
    readonly userManager: IUserManager;
    //readonly pluginManager: IPluginManager;

    setLog(log: ILogger): void;

    //********************************************************************
    //* New API:
    //* ========
    //* 
    //* 
    //********************************************************************
    readonly flowManager: IFlowManager;

    registerImplicitFlow<TOptions>(//, TFlow extends Implicit<TOptions>>(
        loginName: string,
        flow: new (args: TOptions, log: ILogger) => Implicit<TOptions>,
        flowOptions: TOptions
    ): void;

    login2(
        loginName: string,
        accessTokenName: string,
        userstate: any,
        success: (user: UserInfo, userstate: any) => void,
        error: (reason: any, userstate: any) => void
    ): void;

    handleRedirect(
        url: string,
        success: (loginName: string, user: UserInfo, userstate: any) => void,
        error: (loginName: string, reason: any, userstate: any) => void
    ): any;

    logout2(loginName: string): void;

    ////********************************************************************
    ////* Plugins:
    ////* ========
    ////* 
    ////* 
    ////********************************************************************
    //registerPlugin<TOptions>(pluginName: string, plugin: IPlugin<TOptions>): void;

    ////********************************************************************
    ////* Login:
    ////* ======
    ////* 
    ////* 
    ////********************************************************************
    //login(
    //    pluginName: string,
    //    identityProviderName: string,
    //    accessTokenName: string,
    //    userstate: any,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void;
    //login(
    //    userstate: any,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void;

    //setDefaultProvider(defaultPlugin: string, defaultIdentityProvider: string, defaultAccessToken: string): void;


    ////********************************************************************
    ////* Redirect handling:
    ////* ==================
    ////* Redirect URLs are expected to be of the form
    ////* 
    ////*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    ////* 
    ////* where
    ////*    https://host/whatever is the registered URL
    ////*    "sdp:auth=oidc"       identifies the auth module
    ////*    "#..."                is the has fragment carrying 
    ////*                          the auth result
    ////* 
    ////********************************************************************

    //handleRedirect(
    //    url: string,
    //    success: (user: UserInfo, userstate: any) => void,
    //    error: (reason: any, userstate: any) => void
    //): void;

    ////********************************************************************
    ////* Logout:
    ////* =======
    ////* 
    ////********************************************************************
    //logout(
    //    pluginName: string,
    //    identityProviderName: string
    //): void
    //logout(): void
}
