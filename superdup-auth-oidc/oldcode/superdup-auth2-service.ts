//declare function sha256(message, options);
//declare namespace Oidc
//{
//    var WebStorageStateStore;
//    var UserManager;
//    var Log;
//}

namespace superdup.auth2
{
    class ModuleHelper<TOptions> implements IModuleHelper<TOptions>
    {
        constructor(private readonly serviceProvider: AuthServiceProvider, private readonly moduleName: string) 
        {
        }

        identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>
        {
            this.serviceProvider.registerIdentityProvider<TOptions>(this.moduleName, identityProviderName, providerOptions);
            return new IdentityProviderHelper<TOptions>(this.serviceProvider, this.moduleName, identityProviderName);
        }
    }

    class IdentityProviderHelper<TOptions> implements IIdentityProviderHelper<TOptions>
    {
        constructor(
            private readonly serviceProvider: AuthServiceProvider,
            private readonly moduleName: string,
            private readonly identityProviderName: string
        ) 
        {
        }

        identityProvider(identityProviderName: string, providerOptions: TOptions): IIdentityProviderHelper<TOptions>
        {
            this.serviceProvider.registerIdentityProvider(this.moduleName, identityProviderName, providerOptions);
            return this;
        }

        accessToken(tokenName: string, resource: string, scopes: string[], protectUrls: string[]): IIdentityProviderHelper<TOptions>
        {
            this.serviceProvider.registerAccessToken(this.moduleName, this.identityProviderName, tokenName, resource, scopes, protectUrls);
            return this;
        }
    }

    export interface AuthModuleInfo
    {
        authModule: Object;
        idpInfos: { [id: string]: IdentityProviderInfo; };
    }

    export interface IdentityProviderInfo
    {
        idpOptions: {};
        idp: IIdentityProvider;
        accessTokens: { [id: string]: AccessTokenInfo; };
    }

    export interface AccessTokenInfo
    {
        resource: string;
        scopes: string[];
        protectUrls: string[];
        token?: string;
        expiresAt?: number;
    }

    class AccessTokenManager implements IAccessTokenManager
    {
        private _tokensByDescendingUrl:
        {
            url: string,
            modulename: string,
            idpname: string,
            tokenname: string,
            tokeninfo: AccessTokenInfo
        }[] = [];

        constructor(authModules: { [id: string]: AuthModuleInfo; })
        {
            for (var modulename in authModules)
            {
                var moduleinfo = authModules[modulename];

                if (!moduleinfo)
                    continue;

                if (!moduleinfo.idpInfos)
                    continue;

                for (var idpname in moduleinfo.idpInfos)
                {
                    var idpinfo = moduleinfo.idpInfos[idpname];

                    if (!idpinfo)
                        continue;

                    if (!idpinfo.accessTokens)
                        continue;

                    for (var tokenname in idpinfo.accessTokens)
                    {
                        var tokeninfo = idpinfo.accessTokens[tokenname];

                        if (!tokeninfo)
                            continue;

                        if (!tokeninfo.protectUrls)
                            continue;

                        for (var n in tokeninfo.protectUrls)
                        {
                            var protectedUrl = tokeninfo.protectUrls[n];

                            if (!protectedUrl)
                                continue;

                            this._tokensByDescendingUrl.push(
                                {
                                    url: protectedUrl,
                                    modulename: modulename,
                                    idpname: idpname,
                                    tokenname: tokenname,
                                    tokeninfo: tokeninfo
                                })
                        }
                    }
                }
            }

            this._tokensByDescendingUrl =
                this._tokensByDescendingUrl.sort((a, b) => { return b.url.length - a.url.length; });
        }

        public getByName(moduleName: string, identityProviderName: string, accessTokenName: string): AccessTokenInfo
        {
            for (var n = 0; n < this._tokensByDescendingUrl.length; n++)
            {
                var entry = this._tokensByDescendingUrl[n];
                if (entry.modulename === moduleName)
                    if (entry.idpname === identityProviderName)
                        if (entry.tokenname === accessTokenName)
                            return entry.tokeninfo;
            }

            return null;
        }

        public getByProvider(moduleName: string, identityProviderName: string): { name: string, info: AccessTokenInfo }[]
        {
            var tmp: { [id: string]: AccessTokenInfo; } = {};
            for (var n = 0; n < this._tokensByDescendingUrl.length; n++)
            {
                var entry = this._tokensByDescendingUrl[n];
                if (entry.modulename === moduleName)
                    if (entry.idpname === identityProviderName)
                        tmp[entry.tokenname] = entry.tokeninfo;
            }

            var result: { name: string, info: AccessTokenInfo }[] = [];
            for (var name in tmp)
            {
                result.push({ name: name, info: tmp[name] });
            }

            return result;
        }

        public getByUrl(url: string): AccessTokenInfo
        {
            for (var n = 0; n < this._tokensByDescendingUrl.length; n++)
            {
                var entry = this._tokensByDescendingUrl[n];
                var protectedUrl = entry.url;
                if (!protectedUrl)
                    continue;

                if (url.indexOf(protectedUrl) != 0)
                    continue;

                return entry.tokeninfo;
            }
        }
    }

    class AuthServiceProvider implements IAuthServiceProvider
    {
        constructor(
            private $injector: ng.auto.IInjectorService,
        )
        {
        }

        private url: string = null;
        public config(url: string): void
        {
            this.url = url;
        }

        //********************************************************************
        //* Modules:
        //* ========
        //* 
        //* 
        //********************************************************************
        private readonly _authModules: { [id: string]: AuthModuleInfo; } = {};
        private findModule<TOptions>(name: string): IAuthModule<TOptions>
        {
            var info = this._authModules[name];
            if (!info)
                return null;

            return info.authModule as IAuthModule<TOptions>;
        }

        public registerAuthModule<TOptions>(moduleName: string, authModule: IAuthModule<TOptions>): void
        {
            this._authModules[moduleName] = { authModule: authModule, idpInfos: {} };
        }

        public module<TOptions>(moduleName: string, authModule: IAuthModule<TOptions>): IModuleHelper<TOptions>
        {
            this.registerAuthModule(moduleName, authModule);
            return new ModuleHelper<TOptions>(this, moduleName);
        }
        
        //********************************************************************
        //* IdentityProviders:
        //* ==================
        //* 
        //* 
        //********************************************************************
        //private readonly identityProviders: { [id: string]: IdentityProviderInfo; } = {};

        public registerIdentityProvider<TOptions>(
            authModuleName: string,
            identityProviderName: string,
            providerOptions: TOptions): void
        {
            //var key = authModuleName + ":" + identityProviderName;
            var moduleInfo = this._authModules[authModuleName];
            if (!moduleInfo)
                throw new Error("Module " + authModuleName + " has not been registered");

            if (!!moduleInfo.idpInfos[identityProviderName])
                throw new Error("Identity provider " + identityProviderName + " has already been registered for module " + authModuleName);

            moduleInfo.idpInfos[identityProviderName] = { idpOptions: providerOptions, idp: null, accessTokens: {} };
        }

        //********************************************************************
        //* Access Tokens:
        //* ==============
        //* 
        //* 
        //********************************************************************
        public registerAccessToken(
            authModuleName: string,
            identityProviderName: string,
            tokenName: string,
            resource: string,
            scopes: string[],
            protectUrls: string[]
        ): void
        {
            var moduleInfo = this._authModules[authModuleName];
            if (!moduleInfo)
                throw new Error("Module " + authModuleName + " has not been registered");

            var idpInfo = moduleInfo.idpInfos[identityProviderName];
            if (!idpInfo)
                throw new Error("Identity provider " + identityProviderName + " has not been registered for module " + authModuleName);

            if (!!idpInfo.accessTokens[tokenName])
                throw new Error("Access token " + tokenName + " has already been registered for identity provider " + authModuleName + ":" + identityProviderName);

            idpInfo.accessTokens[tokenName] =
                {
                    resource: resource,
                    scopes: scopes,
                    protectUrls: protectUrls
                };
        }

        //********************************************************************
        //* 
        //* 
        //* 
        //* 
        //********************************************************************
        $get = [
            '$injector',
            ($injector: ng.auto.IInjectorService) =>
            {
                return new AuthService(
                    $injector,
                    $injector.get("$q"),
                    this._authModules,
                    this.url,
                    console
                );
            }];
    }

    interface IWrappedData
    {
        n: String;
        d: any;
    }
    export class AuthService implements IAuthService
    {
        private readonly accessTokenManager: AccessTokenManager;

        constructor(
            private $injector: ng.auto.IInjectorService,
            private $q: ng.IQService,
            private readonly authModules: { [id: string]: AuthModuleInfo; },
            private readonly url: string,
            private log: ILogger)
        {
            this.accessTokenManager = new AccessTokenManager(authModules);
        }

        public login(authModuleName: string, identityProviderName: string, userstate: any = null): ng.IPromise<void>
        {
            var state = { mod: authModuleName, uss: userstate };
            // OK, get the auth module:
            var moduleInfo = this.authModules[authModuleName];
            if (!moduleInfo)
                return this.$q.reject("No module named " + authModuleName + " has been registered");;

            var authModule = moduleInfo.authModule as IAuthModule<{}>;
            if (!authModule)
                return this.$q.reject("No module named " + authModuleName + " has been registered");;

            // then get the info registered on the initiating idp
            var idpInfo = moduleInfo.idpInfos[identityProviderName]
            if (!idpInfo)
                return this.$q.when(null);

            return authModule.login(this.$injector, this.accessTokenManager, identityProviderName, state, idpInfo.idpOptions, this.url, this.log);
        }

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
        public handleRedirect(): ng.IPromise<any>
        {
            // First sneak-peek at the '...#state=...' fragment of the URL,
            // to see if this is a recognizable redirect:
            var state: any = utils.sdpReadHashFragmentState(this.url);
            if (!state)
                return this.$q.when(null);

            // OK, get the auth module that initiated this:
            var authModuleName: string = state.mod;
            if (!authModuleName)
                return this.$q.when(null);

            var moduleInfo = this.authModules[authModuleName];
            if (!moduleInfo)
                return this.$q.when(null);

            var authModule = moduleInfo.authModule as IAuthModule<{}>;
            if (!authModule)
                return this.$q.when(null);

            // then get the info registered on the initiating idp
            var idpName = state.idp;
            var idpInfo = moduleInfo.idpInfos[idpName]
            if (!idpInfo)
                return this.$q.when(null);

            return authModule
                .handleRedirect(this.$injector, this.accessTokenManager, state, idpInfo.idpOptions, this.url, this.log)
                .then(() => { return state.uss; });
        }

        //********************************************************************
        //* Modules:
        //* ========
        //* 
        //* 
        //********************************************************************
        private findAuthModule<TOptions>(moduleName: string): IAuthModule<TOptions>
        {
            if (!moduleName)
                return null;

            var info = this.authModules[moduleName];
            if (!info)
                return null;

            return info.authModule as IAuthModule<TOptions>;
        }

        //********************************************************************
        //* IdentityProviders:
        //* ==================
        //* 
        //* 
        //********************************************************************
        //public identityProvider(authModuleName: string, identityProviderName: string): IIdentityProvider
        //{
        //    if (!authModuleName)
        //        return null;

        //    var moduleInfo = this.authModules[authModuleName];
        //    if (!moduleInfo)
        //        return null;

        //    var idpInfo = moduleInfo.idpInfos[identityProviderName]
        //    if (!idpInfo)
        //        throw new Error("Identity provider " + identityProviderName + " has not been registered for module " + authModuleName);

        //    if (!!idpInfo.idp)
        //        return idpInfo.idp;

        //    var authModule = moduleInfo.authModule as IAuthModule<{}>;
        //    if (!authModule)
        //        throw new Error("Unknown authentication module " + authModuleName);

        //    var idp = authModule.create(this.$injector, identityProviderName, idpInfo.flow, idpInfo.idpOptions, this.log);
        //    idpInfo.idp = idp;

        //    return idp;
        //}

        //********************************************************************
        //* Access Tokens:
        //* ==============
        //* 
        //* 
        //********************************************************************
        public getAccessTokenFor(url: string): ng.IPromise<string>
        {
            if (!url)
                return this.$q.when(null);

            // Find the matching entry:
            var tokeninfo = this.accessTokenManager.getByUrl(url);
            if (!tokeninfo)
                return this.$q.when(null);

            // Check for expiration:
            if (utils.isExpired(tokeninfo.expiresAt))
            {
                tokeninfo.token = null;
                tokeninfo.expiresAt = null;
            }

            // Return the token if it's already available:
            if (!!tokeninfo.token)
                return this.$q.when(tokeninfo.token);

            // ..otherwise acquire:
            return this.acquireAccessTokenFor(tokeninfo);
        }

        private acquireAccessTokenFor(tokeninfo: AccessTokenInfo): ng.IPromise<string>
        {
            return this.$q.when(null);
        }
    }

    angular.module('superdup.auth2')
        .provider('superdupAuth2Service', ['$injector', AuthServiceProvider]);
}
