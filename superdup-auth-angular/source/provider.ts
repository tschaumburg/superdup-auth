import angular = require("angular");
import auth = require("superdup-auth-core");
import helpers = require('./helpers');
import service = require('./service');

export interface IAuthServiceProvider extends angular.IServiceProvider
{
    setLog(log: auth.ILogger): helpers.IConfigHelper;
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
    private static readonly authManager: auth.IAuthManager = auth.getAuthManager();// config.ConfigManager = new config.ConfigManager();
    private log: auth.ILogger = console;
    public setLog(log: auth.ILogger): helpers.IConfigHelper
    {
        if (!log)
            log = console;

        this.log = log;
        AuthServiceProvider.authManager.setLog(log);

        return new helpers.ConfigHelper(AuthServiceProvider.authManager);
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
                AuthServiceProvider.authManager,
                this.log
            );
        }];

    public handleRedirect(
        url: string,
        success: (userdata: any) => void,
        error: (reason: string) => void
    ): any 
    {
        return AuthServiceProvider.authManager.handleRedirect(
            url,
            (loginName, user, state) => {
                if (!!success)
                    success(state);
            },
            (loginName, reason, state) => {
                if (!!error)
                    error(reason);
            }
        );
    }
}

