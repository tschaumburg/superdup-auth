import angular = require("angular");
import auth = require("superdup-auth-core");
//import helpers = require('./helpers');
import service = require('./service');

import { IBuilderManager } from "superdup-auth-core";

export interface IAuthServiceProvider extends angular.IServiceProvider
{
    initLog(log: auth.ILogger): IAuthServiceProvider;
    readonly builder: IBuilderManager;
    handleRedirect(
        url: string,
        success: (userdata: any) => void,
        error: (reason: string) => void
    ): any;
}


export class AuthServiceProvider implements IAuthServiceProvider
{
    constructor(
        private $injector: ng.auto.IInjectorService,
    )
    {
    }

    //********************************************************************
    //* Configuration:
    //* ==============
    //*
    //* provider
    //*    .setLog(console)
    //*    .registerPlugin("adal", new adal.AdalPlugin($q)
    //*    .registerServer("azureb2c", { tenant: "foobar.onmicrosoft.com", clientSecret: "..." })
    //*    .registerAccessToken("https://admin-api.foobar.com/", "general", ["read"])
    //*    .registerAccessToken("https://admin-api.foobar.com/users", "users", ["read:users", "edit:users"])
    //*    .registerAccessToken("https://admin-api.foobar.com/log", "logs", ["view"]);
    //********************************************************************
    //private log: auth.ILogger = console;
    //private static readonly authManager: auth.ILoginManager = auth.createLoginManager(null);// config.ConfigManager = new config.ConfigManager();
    //public setLog(log: auth.ILogger): helpers.IConfigHelper
    //{
    //    if (!log)
    //        log = console;

    //    this.log = log;
    //    //AuthServiceProvider.authManager.setLog(log);

    //    return new helpers.ConfigHelper(AuthServiceProvider.authManager);
    //}
    private _manager: auth.ILoginManager = null;
    public get manager(): auth.ILoginManager
    {
        if (!this._manager)
            this._manager = auth.createLoginManager2(this.log);
        return this._manager;
    }

    private _builder: auth.IBuilderManager = null;
    public get builder(): auth.IBuilderManager
    {
        if (!this._builder)
            this._builder = auth.createBuilderManager(this.manager);
        return this._builder;
    }
        //

    private log: auth.ILogger = null;
    public initLog(log: auth.ILogger): AuthServiceProvider
    {
        if (!!this.log)
            throw new Error("initLog() can only be called once");

        if (!log)
            throw new Error("initLog(log) be called with a non-null arg");

        if (!!this._builder)
            throw new Error("initLog() cannot be called after configuration has begun");

        if (!log.sublog)
            log = new auth.ConsoleLogger(log, "auth");

        this.log = log;
        return this;
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
            this.log.debug("Starting authentication service");
            return new service.AuthService(
                $injector,
                $injector.get("$q"),
                this.manager,
                this.builder,
                this.log
            );
        }];

    public handleRedirect(
        url: string,
        success: (userdata: any) => void,
        error: (reason: string) => void
    ): any 
    {
        return this.manager.handleRedirect(
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

