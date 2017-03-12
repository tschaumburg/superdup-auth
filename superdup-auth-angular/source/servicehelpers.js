"use strict";
var ModuleHelper = (function () {
    function ModuleHelper(serviceProvider, moduleName) {
        this.serviceProvider = serviceProvider;
        this.moduleName = moduleName;
    }
    ModuleHelper.prototype.identityProvider = function (identityProviderName, providerOptions) {
        this.serviceProvider.registerIdentityProvider(this.moduleName, identityProviderName, providerOptions);
        return new IdentityProviderHelper(this.serviceProvider, this.moduleName, identityProviderName);
    };
    return ModuleHelper;
}());
exports.ModuleHelper = ModuleHelper;
var IdentityProviderHelper = (function () {
    function IdentityProviderHelper(serviceProvider, moduleName, identityProviderName) {
        this.serviceProvider = serviceProvider;
        this.moduleName = moduleName;
        this.identityProviderName = identityProviderName;
    }
    IdentityProviderHelper.prototype.identityProvider = function (identityProviderName, providerOptions) {
        this.serviceProvider.registerIdentityProvider(this.moduleName, identityProviderName, providerOptions);
        return this;
    };
    IdentityProviderHelper.prototype.accessToken = function (tokenName, resource, scopes, protectUrls) {
        this.serviceProvider.registerAccessToken(this.moduleName, this.identityProviderName, tokenName, resource, scopes, protectUrls);
        return this;
    };
    return IdentityProviderHelper;
}());
exports.IdentityProviderHelper = IdentityProviderHelper;
