import angular = require("angular");
import auth = require("superdup-auth-core");
//import helpers = require('./helpers');
import service = require('./authservice');

import { IAuthenticationConfig, IAuthenticationManager, createAuthenticationManager } from "superdup-auth-core";
import { ILog, ConsoleLog, ConsoleTarget, createLog } from "superdup-auth-log"; 
import { ILogServiceProvider } from "./logprovider"; 

export interface IAuthServiceProvider extends angular.IServiceProvider
{
    readonly config: IAuthenticationConfig;
}

export class AuthServiceProvider implements IAuthServiceProvider
{
    private readonly _log: ILog;
    private readonly _authManager: IAuthenticationManager;

    constructor(_logProvider: ILogServiceProvider)
    {
        this._log = _logProvider.log.sublog("auth");
        this._authManager = createAuthenticationManager(new ConsoleTarget());// this._log);
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
}

