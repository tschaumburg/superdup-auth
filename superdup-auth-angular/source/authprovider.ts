import angular = require("angular");
import auth = require("superdup-auth-core");
//import helpers = require('./helpers');
import service = require('./authservice');

import { IAuthenticationConfig, IAuthenticationManager, createAuthenticationManager } from "superdup-auth-core";
import { ILog, ConsoleLog, createLog } from "superdup-auth-log"; 
import { ILogServiceProvider } from "./logprovider"; 

export interface IAuthServiceProvider extends angular.IServiceProvider
{
    //initLog(log: ILog): IAuthServiceProvider;
    readonly config: IAuthenticationConfig;
    handleRedirect(
        url: string,
        success: (userdata: any) => void,
        error: (reason: string) => void
    ): any;
}


export class AuthServiceProvider implements IAuthServiceProvider
{
    private readonly _log: ILog;
    private readonly _authManager: IAuthenticationManager;

    constructor(_logProvider: ILogServiceProvider)
    {
        this._log = _logProvider.log.sublog("auth");
        this._authManager = createAuthenticationManager(this._log);
    }

    public get config(): IAuthenticationConfig
    {
        return this._authManager.config;
    }

    //********************************************************************
    //* Creating the service:
    //* =====================
    //* 
    //* 
    //********************************************************************
    $get = [
        '$injector',
        ($injector: ng.auto.IInjectorService) =>
        {
            this._log.debug("Starting authentication service");
            return new service.AuthService(
                $injector,
                $injector.get("$q"),
                this._authManager,
                //this.builder,
                this._log
            );
        }];

    public handleRedirect(
        url: string,
        success: (userdata: any) => void,
        error: (reason: string) => void
    ): any 
    {
        return this._authManager.handleRedirect(
            url,
            (loginName, user, state) =>
            {
                if (!!success)
                    success(state);
            },
            () => { },
            (loginName, reason, state) =>
            {
                if (!!error)
                    error(reason);
            }
        );
    }
}

