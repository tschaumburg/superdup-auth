import angular = require("angular");
import provider = require('./provider');
import service = require('./service');

//require("angular-base64");
//require("angular-jwt");

angular.module("superdup.auth", [/*'base64',*/ /*'angular-jwt'*/]);

angular.module('superdup.auth')
    .provider('superdupAuthService', ['$injector', provider.AuthServiceProvider]);



angular.module('superdup.auth')
    .factory('superdupAuthInterceptor', ['superdupAuthService', function (superdupAuthService: service.AuthService)
{
        var log = superdupAuthService.log;

        if (!!log && !!log.sublog)
            log = log.sublog("superdupAuthInterceptor");

        return {
        request: function (config: angular.IRequestConfig)
        {
            if (!config)
                return config;

            if (!config.url)
                return config;

            var promise =
                superdupAuthService
                    .resolveAccessToken(config.url)
                    .then((token: string) => 
                    {
                        if (!!token)
                        {
                            var sanitizedToken = token && (token.substr(0, Math.min(20, token.length / 2)) + "...");
                            log.debug(config.method + " " + config.url + " gets bearer token " + sanitizedToken);
                            config.headers["Authorization"] = 'Bearer ' + token;
                        }
                        else
                        {
                            log.debug(config.method + " " + config.url + " has no token registered");
                        }
                        return config;
                    })
                    .catch((reason) =>
                    {
                        log.debug(config.method + " " + config.url + " => ERROR " + reason);
                        return config;
                    });

            return promise;
        }
    };
}]);

angular.module('superdup.auth')
    .config(['$httpProvider', function ($httpProvider: angular.IHttpProvider)
    {
        $httpProvider.interceptors.push('superdupAuthInterceptor');
    }]);
