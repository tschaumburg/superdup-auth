import angular = require("angular");
import auth = require("superdup-auth-core");
import helpers = require('./helpers');
import service = require('./service');

export interface IAuthServiceProvider extends angular.IServiceProvider
{
    extractUserState(url: string): any;
    setLog(log: auth.ILogger): helpers.IConfigHelper;
    getProtectedDomains(): string[];
}


export class AuthServiceProvider implements IAuthServiceProvider
{
    constructor(
        private $injector: ng.auto.IInjectorService,
    )
    {
    }

    public extractUserState(url: string): any
    {
        var state = auth.decodeHash<{ mod: string, idp: string, at?: string, uss: any }>(url);
        return state && state.uss;
    }

    public getProtectedDomains(): string[]
    {
        var res =
            AuthServiceProvider.pluginManager
                .tokenManager
                .getProtectedDomains();

        return res;
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
    private static readonly pluginManager: auth.IAuthManager = auth.create();// config.ConfigManager = new config.ConfigManager();
    private log: auth.ILogger = console;
    public setLog(log: auth.ILogger): helpers.IConfigHelper
    {
        if (!log)
            log = console;

        this.log = log;
        AuthServiceProvider.pluginManager.setLog(log);

        return new helpers.ConfigHelper(AuthServiceProvider.pluginManager);
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
                AuthServiceProvider.pluginManager,
                this.log
            );
        }];
}

