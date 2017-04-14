var sdpAuthAngular =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var auth = __webpack_require__(6);
//import helpers = require('./helpers');
var service = __webpack_require__(4);
var AuthServiceProvider = (function () {
    function AuthServiceProvider($injector) {
        var _this = this;
        this.$injector = $injector;
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
        this._manager = null;
        this._builder = null;
        //
        this.log = null;
        //********************************************************************
        //* Creating the service:
        //* =====================
        //* 
        //* 
        //********************************************************************
        this.$get = [
            '$injector',
            function ($injector) {
                _this.log.debug("Starting authentication service");
                return new service.AuthService($injector, $injector.get("$q"), _this.manager, _this.builder, _this.log);
            }
        ];
    }
    Object.defineProperty(AuthServiceProvider.prototype, "manager", {
        get: function () {
            if (!this._manager)
                this._manager = auth.createLoginManager2(this.log);
            return this._manager;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthServiceProvider.prototype, "builder", {
        get: function () {
            if (!this._builder)
                this._builder = auth.createBuilderManager(this.manager);
            return this._builder;
        },
        enumerable: true,
        configurable: true
    });
    AuthServiceProvider.prototype.initLog = function (log) {
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
    };
    AuthServiceProvider.prototype.handleRedirect = function (url, success, error) {
        return this.manager.handleRedirect(url, function (loginName, user, state) {
            if (!!success)
                success(state);
        }, function (loginName, reason, state) {
            if (!!error)
                error(reason);
        });
    };
    return AuthServiceProvider;
}());
exports.AuthServiceProvider = AuthServiceProvider;
//# sourceMappingURL=provider.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var angular = __webpack_require__(5);
var provider = __webpack_require__(0);
//require("angular-base64");
//require("angular-jwt");
angular.module("superdup.auth", []);
angular.module('superdup.auth')
    .provider('superdupAuthService', ['$injector', provider.AuthServiceProvider]);
angular.module('superdup.auth')
    .factory('superdupAuthInterceptor', ['superdupAuthService', function (superdupAuthService) {
        var log = superdupAuthService.log;
        if (!!log && !!log.sublog)
            log = log.sublog("superdupAuthInterceptor");
        return {
            request: function (config) {
                if (!config)
                    return config;
                if (!config.url)
                    return config;
                var promise = superdupAuthService
                    .resolveAccessToken(config.url)
                    .then(function (token) {
                    if (!!token) {
                        var sanitizedToken = token && (token.substr(0, Math.min(20, token.length / 2)) + "...");
                        log.debug(config.method + " " + config.url + " gets bearer token " + sanitizedToken);
                        config.headers["Authorization"] = 'Bearer ' + token;
                    }
                    else {
                        log.debug(config.method + " " + config.url + " has no token registered");
                    }
                    return config;
                })
                    .catch(function (reason) {
                    log.debug(config.method + " " + config.url + " => ERROR " + reason);
                    return config;
                });
                return promise;
            }
        };
    }]);
angular.module('superdup.auth')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('superdupAuthInterceptor');
    }]);
//# sourceMappingURL=module.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var AuthUtils = (function () {
    function AuthUtils() {
    }
    AuthUtils.protectStates = function ($q, $transitions, statepattern, refusedState, isUser, isRole) {
        $transitions.onBefore({
            to: '*',
            from: '*'
        }, 
        //['$state', '$transition$',
        function ($transition$, $state) {
            if (!$transition$)
                return;
            if (!$transition$.$to())
                return;
            if ($transition$.$to().name === refusedState)
                return;
            if (!$transition$.$to().data)
                return;
            if ($transition$.$to().data.allowAnonymous)
                return;
            var deferred = $q.defer();
            var promises = [];
            if ($transition$.$to().data.allowUsers) {
                var allowedUsers = $transition$.$to().data.allowUsers;
                promises.push(isUser(allowedUsers));
            }
            if ($transition$.$to().data.allowRoles) {
                var allowedRoles = $transition$.$to().data.allowRoles;
                promises.push(isRole(allowedRoles));
            }
            $q.all(promises).then(function (permissions) {
                if (permissions.some(function (value, index, array) { return value; })) {
                    deferred.resolve();
                }
                else {
                    var params = {
                        protectedState: $transition$.$to().name,
                        protectedStateParams: "x" //toStateParams
                    };
                    deferred.resolve($transition$.router.stateService.target(refusedState, params));
                }
            }).catch(function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        });
    };
    return AuthUtils;
}());
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(__webpack_require__(0));
__export(__webpack_require__(2));
__webpack_require__(1);
//# sourceMappingURL=index.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var AuthService = (function () {
    function AuthService($injector, $q, authManager, builder, log) {
        this.$injector = $injector;
        this.$q = $q;
        this.authManager = authManager;
        this.builder = builder;
        this.log = log;
    }
    //********************************************************************
    //* New API:
    //* ========
    //* 
    //* 
    //********************************************************************
    AuthService.prototype.login = function (loginName, accessTokenName, userstate) {
        if (userstate === void 0) { userstate = null; }
        var deferred = this.$q.defer();
        this.authManager.login(loginName, accessTokenName, userstate, function (user, state) {
            deferred.resolve();
        }, function (reason, state) {
            deferred.reject(reason);
        }, this.log);
        return deferred.promise;
    };
    AuthService.prototype.logout = function (loginName) {
        var deferred = this.$q.defer();
        this.authManager.logout2(loginName, this.log);
        return deferred.promise;
    };
    AuthService.prototype.getLoginNames = function () {
        return this.builder.getLoginNames();
    };
    AuthService.prototype.getLogin = function (loginName) {
        return this.builder.getLogin(loginName);
    };
    //********************************************************************
    //* Access Tokens:
    //* ==============
    //* 
    //* 
    //********************************************************************
    AuthService.prototype.resolveAccessToken = function (url) {
        var deferred = this.$q.defer();
        this.authManager
            .resolveAccessToken(url, function (token) {
            deferred.resolve(token);
        }, function (reason) {
            deferred.reject(reason);
        });
        return deferred.promise;
    };
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=service.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = sdpAuthCore;

/***/ })
/******/ ]);