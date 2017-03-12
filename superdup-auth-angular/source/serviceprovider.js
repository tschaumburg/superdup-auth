"use strict";
var helpers = require("./servicehelpers");
var service = require("./service");
var config = require("./configmanager");
var AuthServiceProvider = (function () {
    function AuthServiceProvider($injector) {
        var _this = this;
        this.$injector = $injector;
        this.url = null;
        //********************************************************************
        //* Modules:
        //* ========
        //* 
        //* 
        //********************************************************************
        this.configManager = new config.ConfigManager();
        //********************************************************************
        //* 
        //* 
        //* 
        //* 
        //********************************************************************
        this.$get = [
            '$injector',
            function ($injector) {
                return new service.AuthService($injector, $injector.get("$q"), 
                //this._authModules,
                _this.configManager, _this.url, console);
            }
        ];
    }
    AuthServiceProvider.prototype.config = function (url) {
        this.url = url;
    };
    AuthServiceProvider.prototype.registerAuthModule = function (moduleName, authModule) {
        this.configManager.registerAuthModule(moduleName, authModule);
    };
    AuthServiceProvider.prototype.module = function (moduleName, authModule) {
        this.registerAuthModule(moduleName, authModule);
        return new helpers.ModuleHelper(this, moduleName);
    };
    //********************************************************************
    //* IdentityProviders:
    //* ==================
    //* 
    //* 
    //********************************************************************
    //private readonly identityProviders: { [id: string]: IdentityProviderInfo; } = {};
    AuthServiceProvider.prototype.registerIdentityProvider = function (authModuleName, identityProviderName, providerOptions) {
        this.configManager.registerIdentityProvider(authModuleName, identityProviderName, providerOptions);
    };
    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    AuthServiceProvider.prototype.registerAccessToken = function (authModuleName, identityProviderName, tokenName, resource, scopes, protectUrls) {
        this.configManager.registerAccessToken(authModuleName, identityProviderName, tokenName, resource, scopes, protectUrls);
    };
    return AuthServiceProvider;
}());
exports.AuthServiceProvider = AuthServiceProvider;
