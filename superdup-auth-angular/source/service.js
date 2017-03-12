"use strict";
var AuthService = (function () {
    //private readonly accessTokenManager: atm.AccessTokenManager;
    function AuthService($injector, $q, 
        //private readonly authModules: { [id: string]: interfaces.AuthModuleInfo; },
        configManager, url, log) {
        this.$injector = $injector;
        this.$q = $q;
        this.configManager = configManager;
        this.url = url;
        this.log = log;
        //this.accessTokenManager = this.configManager.createTokenManager(); // new atm.AccessTokenManager(authModules);
    }
    AuthService.prototype.login = function (authModuleName, identityProviderName, userstate) {
        if (userstate === void 0) { userstate = null; }
        return this.configManager.login(this.$injector, this.url, this.log, authModuleName, identityProviderName, userstate);
        //var state = { mod: authModuleName, uss: userstate };
        //var authModule = this.configManager.findModule(authModuleName);
        //var idpOptions = this.configManager.findIdpOptions(authModuleName, identityProviderName);
        //if (!authModule)
        //    return this.$q.reject("No module named " + authModuleName + " has been registered");;
        //return authModule.login(this.$injector, this.accessTokenManager, identityProviderName, state, idpOptions, this.url, this.log);
    };
    //********************************************************************
    //* Redirect handling:
    //* ==================
    //* Redirect URLs are expected to be of the form
    //* 
    //*    https://host/whatever#state={mod:"oidc", idp:"xx", at:"" ,uss:...userstate...}&access_token...
    //* 
    //* where
    //*    https://host/whatever is the registered URL
    //*    "sdp:auth=oidc"       identifies the auth module
    //*    "#..."                is the has fragment carrying 
    //*                          the auth result
    //* 
    //********************************************************************
    AuthService.prototype.handleRedirect = function () {
        return this.configManager.handleRedirect(this.$injector, this.url, this.log);
        //// First sneak-peek at the '...#state=...' fragment of the URL,
        //// to see if this is a recognizable redirect:
        //var state: any = utils.sdpReadHashFragmentState(this.url);
        //if (!state)
        //    return this.$q.when(null);
        //var authModule = this.configManager.findModule(state.mod);
        //var idpOptions = this.configManager.findIdpOptions(state.mod, state.idp);
        //if (!authModule)
        //    return this.$q.when(null);
        //return authModule
        //    .handleRedirect(this.$injector, this.accessTokenManager, state, idpOptions, this.url, this.log)
        //    .then(() => { return state.uss; });
    };
    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    AuthService.prototype.getAccessTokenFor = function (url) {
        return this.configManager.getByUrl(url);
    };
    return AuthService;
}());
exports.AuthService = AuthService;
