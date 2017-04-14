var sdpAuthCore =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var loginmanager_1 = __webpack_require__(13);
exports.createLoginManager = loginmanager_1.createLoginManager;
var urlutils_1 = __webpack_require__(2);
exports.parse = urlutils_1.parse;
//# sourceMappingURL=index.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlutils = __webpack_require__(2);
var jwtdecode = __webpack_require__(23);
function parseRedirectUrl(redirectUrl) {
    if (!redirectUrl)
        return null;
    var result = {};
    var urlParts = urlutils.parse(redirectUrl);
    if (!!urlParts.fragment) {
        result.hash = {};
        var hashParams = urlParts.fragment.split('&');
        for (var n = 0; n < hashParams.length; n++) {
            var hashParam = hashParams[n];
            if (!hashParam)
                continue;
            var kvp = hashParam.split('=');
            if (kvp.length != 2)
                continue;
            if ("state" === kvp[0].trim())
                result.hash.state = kvp[1]; // JwtUtils.decodeHashValue(kvp[1]);
        }
    }
    return result;
}
exports.parseRedirectUrl = parseRedirectUrl;
function getExpiration(jwtToken) {
    if (!jwtToken)
        return 0;
    var decoded = jwtdecode(jwtToken);
    return decoded.exp;
    //return jwt.decode(jwtToken).exp;
    //return 0;
}
exports.getExpiration = getExpiration;
function isExpired(expiration) {
    return (expiration < Date.now() / 1000);
}
exports.isExpired = isExpired;
function decodeHash(redirectUrl) {
    var parsedRedirect = parseRedirectUrl(redirectUrl);
    if (!parsedRedirect)
        return null; // error("Not a redirect url", undefined);
    if (!parsedRedirect.hash)
        return null; // error("Not a redirect url (#-fragment missing)", undefined);
    if (!parsedRedirect.hash.state)
        return null; // error("Not a redirect url ('state' missing from #-fragment)", undefined);
    var decodedState = JSON.parse(decodeURIComponent(parsedRedirect.hash.state));
    if (!decodedState)
        return null; // error("Malformed state in redirect url - expected JSON-encoded string, got " + JSON.stringify(state), state.uss);
    return decodedState;
}
exports.decodeHash = decodeHash;
function decodeNonce(redirectUrl) {
    var parsedRedirect = parseRedirectUrl(redirectUrl);
    if (!parsedRedirect)
        return null; // error("Not a redirect url", undefined);
    if (!parsedRedirect.hash)
        return null; // error("Not a redirect url (#-fragment missing)", undefined);
    if (!parsedRedirect.hash.nonce)
        return null; // error("Not a redirect url ('nonce' missing from #-fragment)", undefined);
    return parsedRedirect.hash.nonce;
}
exports.decodeNonce = decodeNonce;
//# sourceMappingURL=tokenutils.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function parse(url) {
    var match = url.match(/^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i);
    var ret = {};
    ret.protocol = '';
    ret.host = match[2];
    ret.port = '';
    ret.path = '';
    ret.query = '';
    ret.fragment = '';
    if (match[1]) {
        ret.protocol = match[1];
    }
    if (match[3]) {
        ret.port = match[3];
    }
    if (match[4]) {
        ret.path = match[4];
    }
    if (match[5]) {
        ret.query = match[5];
    }
    if (match[6]) {
        ret.fragment = match[6];
    }
    return ret;
}
exports.parse = parse;
function getParameter(url, parameterName) {
    if (!!url)
        return null;
    var _url;
    try {
        _url = new URL(url);
    }
    catch (e) {
        return null;
    }
    var query = _url.search;
    if (!!query)
        return null;
    var params = query.substring(1).split('&');
    for (var n = 0; n < params.length; n++) {
        var kvp = params[n].split('=');
        if (kvp.length != 2)
            continue;
        if (parameterName === kvp[0].trim())
            return decodeURIComponent(kvp[1]).trim();
    }
    return null;
}
exports.getParameter = getParameter;
//# sourceMappingURL=urlutils.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ConsoleLogger = (function () {
    function ConsoleLogger(_console, _prefix) {
        if (_prefix === void 0) { _prefix = ""; }
        this._console = _console;
        this._prefix = _prefix;
    }
    ConsoleLogger.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.error(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.warn(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.log(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.info(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.debug(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.trace = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._console.trace(this._prefix + ": " + message, optionalParams);
    };
    ConsoleLogger.prototype.sublog = function (name) {
        return new ConsoleLogger(this._console, this._prefix + "." + name);
    };
    return ConsoleLogger;
}());
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=logger.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Login = (function () {
    function Login(manager, log, name) {
        this.manager = manager;
        this.log = log;
        this.name = name;
    }
    Login.prototype.login = function (accessTokenName, userstate, success, error) {
        this.manager.login(this.name, accessTokenName, userstate, success, error, this.log);
    };
    Object.defineProperty(Login.prototype, "user", {
        get: function () {
            return this.manager.getUser(this.name, this.log);
        },
        enumerable: true,
        configurable: true
    });
    Login.prototype.getTokenNames = function () {
        return this.manager.getTokenNames(this.name, this.log);
    };
    Login.prototype.getTokenValue = function (tokenName) {
        return this.manager.getTokenValue(tokenName);
    };
    Login.prototype.logout = function () {
        this.manager.logout2(this.name, this.log);
    };
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var manager_1 = __webpack_require__(9);
exports.createBuilderManager = manager_1.createBuilderManager;
//# sourceMappingURL=index.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var manager_1 = __webpack_require__(20);
exports.createProviderManager = manager_1.createProviderManager;
//# sourceMappingURL=index.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var login_1 = __webpack_require__(4);
var HybridBuilder = (function () {
    function HybridBuilder(builderManager, loginManager, flow) {
        this.builderManager = builderManager;
        this.loginManager = loginManager;
        this.flow = flow;
        this.tokens = [];
    }
    HybridBuilder.prototype.withParameters = function (parameters) {
        this.parameters = parameters;
        return this;
    };
    HybridBuilder.prototype.providingAccessToken = function (tokenName, resource, scopes, protectUrls) {
        this.tokens.push({ tokenName: tokenName, resource: resource, scopes: scopes, protectUrls: protectUrls });
        return this;
    };
    HybridBuilder.prototype.registerAs = function (loginName) {
        this.loginName = loginName;
        var sublog = this.loginManager.registerHybridProvider(this.loginName, this.flow, this.parameters);
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            this.loginManager.registerAccessToken(token.tokenName, this.loginName, token.resource, token.scopes, token.protectUrls);
        }
        var login = new login_1.Login(this.loginManager, sublog, this.loginName);
        this.builderManager.registerLogin(this.loginName, login);
        return login;
    };
    return HybridBuilder;
}());
exports.HybridBuilder = HybridBuilder;
//# sourceMappingURL=hybrid.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var login_1 = __webpack_require__(4);
var ImplicitBuilder = (function () {
    function ImplicitBuilder(builderManager, loginManager, flow) {
        this.builderManager = builderManager;
        this.loginManager = loginManager;
        this.flow = flow;
        this.tokens = [];
    }
    ImplicitBuilder.prototype.withParameters = function (parameters) {
        this.parameters = parameters;
        return this;
    };
    ImplicitBuilder.prototype.providingAccessToken = function (tokenName, resource, scopes, protectUrls) {
        this.tokens.push({ tokenName: tokenName, resource: resource, scopes: scopes, protectUrls: protectUrls });
        return this;
    };
    ImplicitBuilder.prototype.registerAs = function (loginName) {
        this.loginName = loginName;
        var sublog = this.loginManager.registerImplicitProvider(this.loginName, this.flow, this.parameters);
        for (var _i = 0, _a = this.tokens; _i < _a.length; _i++) {
            var token = _a[_i];
            this.loginManager.registerAccessToken(token.tokenName, this.loginName, token.resource, token.scopes, token.protectUrls);
        }
        var login = new login_1.Login(this.loginManager, sublog, this.loginName);
        this.builderManager.registerLogin(this.loginName, login);
        return login;
    };
    return ImplicitBuilder;
}());
exports.ImplicitBuilder = ImplicitBuilder;
//# sourceMappingURL=implicit.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var implicit_1 = __webpack_require__(8);
var hybrid_1 = __webpack_require__(7);
var BuilderManager = (function () {
    function BuilderManager(loginManager) {
        this.loginManager = loginManager;
        this._logins = {};
    }
    BuilderManager.prototype.useImplicitFlow = function (flow) {
        return new implicit_1.ImplicitBuilder(this, this.loginManager, flow);
    };
    BuilderManager.prototype.useHybridFlow = function (flow) {
        return new hybrid_1.HybridBuilder(this, this.loginManager, flow);
    };
    BuilderManager.prototype.registerLogin = function (loginName, login) {
        this._logins[loginName] = login;
    };
    BuilderManager.prototype.getLogin = function (loginName) {
        return this._logins[loginName];
    };
    BuilderManager.prototype.getLoginNames = function () {
        var res = [];
        for (var name in this._logins) {
            res.push(name);
        }
        return res;
    };
    return BuilderManager;
}());
//var _builderManager: IBuilderManager = null; 
//export function getBuilderManager(loginManager: ILoginManager): IBuilderManager
//{
//    if (!_builderManager)
//        _builderManager = new BuilderManager(loginManager);
//    return _builderManager;
//}
function createBuilderManager(loginManager) {
    return new BuilderManager(loginManager);
}
exports.createBuilderManager = createBuilderManager;
//# sourceMappingURL=manager.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DataStore = (function () {
    function DataStore(_storage, _storagekey, log) {
        this._storage = _storage;
        this._storagekey = _storagekey;
        this.log = log;
        this._cache = {};
        this.loadState();
    }
    DataStore.prototype.set = function (key, value) {
        this._cache[key] = value;
        this.saveState();
    };
    DataStore.prototype.get = function (key) {
        return this._cache[key];
    };
    DataStore.prototype.clear = function (key) {
        this._cache[key] = null;
        this.saveState();
    };
    DataStore.prototype.loadState = function () {
        this.log.info("Reloading persisted state...");
        var serializedState = this._storage.retrieve(this._storagekey);
        this._cache = JSON.parse(serializedState);
        if (!this._cache) {
            this.log.info("...no data found");
            this._cache = {};
        }
    };
    DataStore.prototype.saveState = function () {
        this.log.info("Persisting state...");
        var serializedState = JSON.stringify(this._cache);
        this._storage.store(this._storagekey, serializedState);
    };
    return DataStore;
}());
exports.DataStore = DataStore;
//# sourceMappingURL=datastore.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var datastore_1 = __webpack_require__(10);
exports.DataStore = datastore_1.DataStore;
var istorage_1 = __webpack_require__(12);
exports.LocalStorageStore = istorage_1.LocalStorageStore;
//# sourceMappingURL=index.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LocalStorageStore = (function () {
    function LocalStorageStore() {
    }
    LocalStorageStore.prototype.retrieve = function (key) {
        var value = window.localStorage[key];
        if (!value)
            return null;
        return value;
        //return JSON.parse(value) as TData;
    };
    LocalStorageStore.prototype.store = function (key, value) {
        //var value = JSON.stringify(data);
        window.localStorage[key] = value;
    };
    return LocalStorageStore;
}());
exports.LocalStorageStore = LocalStorageStore;
//# sourceMappingURL=istorage.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var logger_1 = __webpack_require__(3);
var datastore_1 = __webpack_require__(11);
var tokens_1 = __webpack_require__(14);
var urlmapper_1 = __webpack_require__(17);
//import { createProviderManager } from "./providers/impl";
//var _authManager: ILoginManager = null;
//export function getLoginManager(log: ILogger): ILoginManager
//{
//    if (!_authManager)
//        _authManager = new LoginManager(log);
//    return _authManager;
//}
function createLoginManager(providerManager, log) {
    return new LoginManager(providerManager, log);
}
exports.createLoginManager = createLoginManager;
var LoginManager = (function () {
    function LoginManager(_flowManager, _log) {
        this._flowManager = _flowManager;
        this._log = _log;
        this._urlMapper = new urlmapper_1.UrlMapper();
        if (!_log)
            _log = console;
        if (!_log.sublog)
            _log = new logger_1.ConsoleLogger(_log, "auth");
        this.log = _log;
        this._userManager = new datastore_1.DataStore(new datastore_1.LocalStorageStore(), "sdpIdTokens", _log);
        var self = this;
        this._tokenManager =
            tokens_1.createTokenManager(function (loginName, resource, scopes, success, err) {
                self.acquireAccessToken(loginName, resource, scopes, success, err);
            }, _log);
    }
    Object.defineProperty(LoginManager.prototype, "flowManager", {
        //private readonly _flowManager: IProviderManager = createProviderManager();
        get: function () { return this._flowManager; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginManager.prototype, "tokenManager", {
        get: function () { return this._tokenManager; },
        enumerable: true,
        configurable: true
    });
    LoginManager.prototype.registerAccessToken = function (tokenName, loginName, resource, scopes, protectUrls) {
        this.tokenManager.registerInfo(tokenName, loginName, resource, scopes, protectUrls, this.log);
        if (!!protectUrls) {
            for (var _i = 0, protectUrls_1 = protectUrls; _i < protectUrls_1.length; _i++) {
                var url = protectUrls_1[_i];
                this._urlMapper.add(url, tokenName);
            }
        }
    };
    //listAccessTokens(): string[];
    LoginManager.prototype.getTokenNames = function (loginName, log) {
        return this.tokenManager.getTokenNames(loginName, log);
    };
    LoginManager.prototype.getTokenValue = function (tokenName) {
        return this.tokenManager.getTokenValue(tokenName);
    };
    LoginManager.prototype.resolveAccessToken = function (//getAccessTokenFor(
        url, success, error) {
        var sublog = this.log.sublog("resolveAccessToken");
        var tokenName = this._urlMapper.map(url);
        if (!tokenName) {
            success(null);
        }
        //this.tokenManager.resolveAccessToken(url, success, error, log);
        this.tokenManager.getValue(tokenName, success, error, sublog);
    };
    //********************************************************************
    //* Registrations:
    //* ==============
    //* 
    //* 
    //********************************************************************
    LoginManager.prototype.registerImplicitProvider = function (loginName, flow, flowOptions) {
        var flowlog = this.log.sublog(loginName);
        this.flowManager.registerImplicitProvider(loginName, function () { return new flow(flowOptions, flowlog); }, this.log);
        return flowlog;
    };
    LoginManager.prototype.registerHybridProvider = function (loginName, flow, flowOptions) {
        var flowlog = this.log.sublog(loginName);
        this.flowManager.registerHybridProvider(loginName, function () { return new flow(flowOptions, flowlog); }, this.log);
        return flowlog;
    };
    //********************************************************************
    //* Login:
    //* ======
    //* 
    //* 
    //********************************************************************
    LoginManager.prototype.login = function (loginName, accessTokenName, userstate, success, error, log) {
        var _this = this;
        log.info("login(loginName=" + loginName + ", accessTokenName=" + accessTokenName + ")");
        if (!loginName) {
            var msg = "login(): loginName must be specified - either explicitly or implicitly through setDefaultProvider()";
            log.error(msg);
            return error(msg, userstate);
        }
        var flow = this.flowManager.findProvider(loginName);
        if (!flow) {
            var msg = "No login named " + loginName + " has been registered";
            log.error(msg);
            return error(msg, userstate);
            ;
        }
        var tokeninfo = null;
        if (!!accessTokenName) {
            var regInfo = this.tokenManager.findInfo(accessTokenName, log);
            if (!!regInfo)
                tokeninfo = { name: regInfo.tokenName, resource: regInfo.resource, scopes: regInfo.scopes };
        }
        var nonce = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
        log.info("login(loginName=" + loginName + ", nonce=" + nonce + ", token=" + JSON.stringify(tokeninfo) + ")");
        flow.login(nonce, { flow: loginName, at: accessTokenName, nonce: nonce, uss: userstate }, //userstate,
        tokeninfo, function (user, accessTokenValue, userstate) {
            log.info("Login succeeeded!");
            _this.tokenManager.setValue(accessTokenName, accessTokenValue, log);
            _this._userManager.set(loginName, user);
            success(user, userstate);
        }, error);
    };
    LoginManager.prototype.makeNonce = function () {
        var length = 10;
        var text = "n"; // prefix "n" => nonce is valid property name
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    //********************************************************************
    //* Handling redirects:
    //* ===================
    //* 
    //* 
    //********************************************************************
    LoginManager.prototype.handleRedirect = function (url, success, error) {
        var _this = this;
        var sublog = this.log.sublog("handleRedirect");
        var sanitizedUrl = url && url.substr(0, 20);
        sublog.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + "...)");
        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = tokens_1.decodeHash(url);
        if (!state) {
            var msg = "Not a redirect url";
            sublog.debug("handleRedirect(): ...not a redirect");
            error(null, msg, undefined);
            return null;
        }
        var loginName = state.flow;
        var accessTokenName = state.at;
        var userstate = state.uss;
        var nonce = state.nonce;
        var flow = this.flowManager.findProvider(loginName);
        if (!flow) {
            var msg = "Redirect URL references login named " + loginName + " - but no such login has been registered";
            sublog.error("handleRedirect(): " + msg);
            error(loginName, msg, userstate);
            ;
            return null;
        }
        var requestedAccessTokenName = accessTokenName;
        sublog.debug("handleRedirect() => " + loginName + ".handleRedirect()");
        flow.handleRedirect(url, nonce, accessTokenName, function (user, accessToken, state) {
            sublog.info("handleRedirect(): successful redirect processed");
            var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
            var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
            sublog.debug("handleRedirect(): Saving tokens");
            sublog.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
            sublog.debug("handleRedirect():    " + requestedAccessTokenName + " = " + sanitizedAccessToken);
            _this.tokenManager.setValue(requestedAccessTokenName, accessToken, sublog);
            _this._userManager.set(loginName, user);
            success(loginName, user, userstate);
        }, function (reason, userstate) { error(loginName, reason, userstate); });
        return userstate;
    };
    LoginManager.prototype.logout2 = function (loginName, log) {
        log.info("logout(loginName=" + loginName + ")");
        if (!loginName) {
            var msg = "logout(): plugin must be specified - either explicitly or implicitly through setDefaultProvider()";
            log.error(msg);
            throw new Error(msg);
        }
        var flow = this.flowManager.findProvider(loginName);
        if (!flow) {
            var msg = "No login named " + loginName + " has been registered";
            log.error(msg);
            throw new Error(msg);
        }
        this.tokenManager.clearValues(loginName, log);
        this._userManager.clear(loginName);
    };
    //
    // =============
    LoginManager.prototype.acquireAccessToken = function (loginName, resource, scopes, success, error) {
        if (!loginName)
            return error("Unnamed login");
        var flow = this.flowManager.findProvider(loginName);
        if (!flow)
            return error("Could not find login \"" + loginName + "\"");
        var tlf = flow;
        if (!tlf || !tlf.acquireAccessToken)
            return error("Flow \"" + loginName + "\" does not support token acquisition after login");
        tlf.acquireAccessToken(resource, scopes, success, error);
    };
    //
    // =============
    //public get userManager() { return this._userManager; }
    LoginManager.prototype.getUser = function (loginName, log) {
        return this._userManager.get(loginName);
    };
    return LoginManager;
}());
exports.LoginManager = LoginManager;
//# sourceMappingURL=loginmanager.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tokenmanager_1 = __webpack_require__(15);
exports.createTokenManager = tokenmanager_1.createTokenManager;
var tokenutils_1 = __webpack_require__(1);
exports.decodeHash = tokenutils_1.decodeHash;
var tokenutils_2 = __webpack_require__(1);
exports.decodeNonce = tokenutils_2.decodeNonce;
//# sourceMappingURL=index.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tokenutils_1 = __webpack_require__(1);
//import { IMultiMap, MultiMap } from "./datatypes/multimap";
var tokenstore_1 = __webpack_require__(16);
function createTokenManager(acquireAccessToken, log, tokenStore) {
    if (tokenStore === void 0) { tokenStore = null; }
    if (!tokenStore)
        tokenStore = new tokenstore_1.LocalStorageTokenStore();
    return new AccessTokenManager(tokenStore, acquireAccessToken, log);
}
exports.createTokenManager = createTokenManager;
var AccessTokenManager = (function () {
    function AccessTokenManager(tokenStore, acquireAccessToken, log) {
        this.tokenStore = tokenStore;
        this.acquireAccessToken = acquireAccessToken;
        // 
        // =============
        //private _tokens: IMultiMap = new MultiMap();
        this._tokens = {};
        this.loadState(log);
    }
    AccessTokenManager.prototype.findInfo = function (tokenName) {
        return this._tokens[tokenName];
    };
    AccessTokenManager.prototype.loadState = function (log) {
        log.info("Reloading persisted authentication state...");
        var tokens = this.tokenStore.loadAll();
        if (!tokens) {
            log.info("...no tokens found");
            return;
        }
        log.info("...reloaded " + tokens.length + " access tokens from token storage");
        for (var n = 0; n < tokens.length; n++) {
            var tokenInfo = tokens[n];
            // no value =>  don't save:
            if (!tokenInfo.tokenValue) {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }
            // expired value =>  don't save:
            if (tokenutils_1.isExpired(tokenInfo.expiresAt)) {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }
            log.debug("   ...reloaded access token " + tokenInfo.tokenName + " from token storage");
            this._tokens[tokenInfo.tokenName] = tokenInfo;
        }
    };
    AccessTokenManager.prototype.saveState = function (log) {
        log.info("Persisting authentication state...");
        var tokens = [];
        for (var tokenName in this._tokens) {
            var tokenInfo = this._tokens[tokenName];
            // no value =>  don't save:
            if (!tokenInfo.tokenValue) {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
                continue;
            }
            // expired value =>  don't save:
            if (tokenutils_1.isExpired(tokenInfo.expiresAt)) {
                log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
                continue;
            }
            log.debug("   ...saving access token " + tokenInfo.tokenName + " to token storage");
            tokens.push(tokenInfo);
        }
        this.tokenStore.saveAll(tokens);
        log.info("...saved " + tokens.length + " access tokens");
    };
    AccessTokenManager.prototype.registerInfo = function (tokenName, loginName, resource, scopes, protectUrls, log) {
        if (!protectUrls || protectUrls.length == 0) {
            log.info("Trying to register access token without any URLs");
            return;
        }
        log.debug("Registering access token \"" +
            tokenName +
            "\" (" +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) + ", " +
            "urls=" + JSON.stringify(protectUrls) +
            ")");
        var existingValue = this._tokens[tokenName];
        var newValue = {
            loginName: loginName,
            tokenName: tokenName,
            protectUrls: protectUrls,
            resource: resource,
            scopes: scopes,
            tokenValue: null,
            expiresAt: null,
        };
        if (!!existingValue) {
            if (this.sameDefinition(existingValue, newValue))
                return;
            log.error("Trying to redefine access token \"" + tokenName + "\"");
        }
        this._tokens[tokenName] = newValue;
    };
    AccessTokenManager.prototype.sameDefinition = function (first, second) {
        if (first == second)
            return true;
        if (!first)
            return false;
        if (!second)
            return false;
        if (first.tokenName !== second.tokenName)
            return false;
        if (first.resource !== second.resource)
            return false;
        if (!this.sameList(first.scopes, second.scopes))
            return false;
        if (!this.sameList(first.protectUrls, second.protectUrls))
            return false;
        return true;
    };
    AccessTokenManager.prototype.sameList = function (first, second) {
        if (first == second)
            return true;
        if (!first)
            return false;
        if (!second)
            return false;
        if (first.length !== second.length)
            return false;
        first = first.sort();
        second = second.sort();
        for (var n in first) {
            if (first[n] !== second[n])
                return false;
        }
        return true;
    };
    AccessTokenManager.prototype.getTokenNames = function (loginName, log) {
        var res = [];
        for (var tokenName in this._tokens) {
            var info = this._tokens[tokenName];
            if (info.loginName === loginName)
                res.push(tokenName);
        }
        return res;
    };
    AccessTokenManager.prototype.getTokenValue = function (tokenName) {
        var info = this._tokens[tokenName];
        if (!info)
            return null;
        return info.tokenValue;
    };
    AccessTokenManager.prototype.getValue = function (tokenName, success, error, log) {
        if (!error)
            throw new Error("error callback must be specified");
        if (!success)
            return error("success callback must be specified");
        if (!tokenName)
            return success(null);
        //var info = this._tokensByUrl.find(url);
        var info = this._tokens[tokenName];
        if (!info)
            return success(null);
        // Check for expiration:
        if (tokenutils_1.isExpired(info.expiresAt)) {
            info.tokenValue = null;
            info.expiresAt = null;
        }
        if (!!info.tokenValue)
            return success(info.tokenValue);
        this.acquireToken(info, function (token) {
            success(token);
        }, function (reason) {
            error(reason);
        }, log);
        success(null);
    };
    AccessTokenManager.prototype.acquireToken = function (tokenInfo, success, error, log) {
        var _this = this;
        this.acquireAccessToken(tokenInfo.loginName, tokenInfo.resource, tokenInfo.scopes, function (token) {
            tokenInfo.tokenValue = token;
            tokenInfo.expiresAt = tokenutils_1.getExpiration(token);
            _this.saveState(log);
            success(token);
        }, error);
    };
    AccessTokenManager.prototype.setValue = function (accessTokenName, accessTokenValue, log) {
        var tokenInfo = this._tokens[accessTokenName];
        if (!tokenInfo) {
            log.debug("Unexpected: resolving value for unregistered access token " + accessTokenName);
            return;
        }
        if (!accessTokenValue) {
            log.debug("Unexpected: resolving null value for access token " + accessTokenName);
            return;
        }
        tokenInfo.tokenValue = accessTokenValue;
        tokenInfo.expiresAt = tokenutils_1.getExpiration(accessTokenValue);
        this.saveState(log);
    };
    AccessTokenManager.prototype.clearValues = function (loginName, log) {
        for (var tokenname in this._tokens) {
            var tokenInfo = this._tokens[tokenname];
            if (tokenInfo.loginName === loginName) {
                tokenInfo.tokenValue = null;
                tokenInfo.expiresAt = 0;
            }
        }
        this.saveState(log);
    };
    return AccessTokenManager;
}());
//# sourceMappingURL=tokenmanager.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LocalStorageTokenStore = (function () {
    function LocalStorageTokenStore() {
        this.key = "sdpTokens";
    }
    LocalStorageTokenStore.prototype.loadAll = function () {
        var value = window.localStorage[this.key];
        if (!value)
            return [];
        return JSON.parse(value);
    };
    LocalStorageTokenStore.prototype.saveAll = function (accessTokens) {
        if (!accessTokens)
            accessTokens = [];
        var value = JSON.stringify(accessTokens);
        window.localStorage[this.key] = value;
    };
    return LocalStorageTokenStore;
}());
exports.LocalStorageTokenStore = LocalStorageTokenStore;
//# sourceMappingURL=tokenstore.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlmapper_1 = __webpack_require__(18);
exports.UrlMapper = urlmapper_1.UrlMapper;
//# sourceMappingURL=index.js.map

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlutils = __webpack_require__(2);
var UrlMapper = (function () {
    function UrlMapper() {
        this._valuesByDescendingUrl = [];
    }
    UrlMapper.prototype.findEntry = function (url) {
        if (!url)
            return null;
        for (var n = 0; n < this._valuesByDescendingUrl.length; n++) {
            var entry = this._valuesByDescendingUrl[n];
            var key = entry.urlPrefix;
            if (key.length < url.length)
                return null;
            if (key === url)
                return entry;
        }
        return null;
    };
    UrlMapper.prototype.sort = function () {
        this._valuesByDescendingUrl =
            this._valuesByDescendingUrl.sort(function (a, b) { return a.urlPrefix.length - b.urlPrefix.length; });
    };
    UrlMapper.prototype.add = function (urlPrefix, value) {
        if (!urlPrefix)
            return;
        var entry = this.findEntry(urlPrefix);
        if (!entry) {
            entry = { urlPrefix: urlPrefix, value: value };
            this._valuesByDescendingUrl.push(entry);
            this.sort();
        }
        entry.value = value;
    };
    UrlMapper.prototype.map = function (url) {
        if (!url)
            return null;
        for (var n = 0; n < this._valuesByDescendingUrl.length; n++) {
            var entry = this._valuesByDescendingUrl[n];
            var prefix = entry.urlPrefix;
            if (url.indexOf(prefix) == 0) {
                return entry.value;
            }
        }
        return null;
    };
    return UrlMapper;
}());
exports.UrlMapper = UrlMapper;
//# sourceMappingURL=urlmapper.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var logger_1 = __webpack_require__(3);
exports.ConsoleLogger = logger_1.ConsoleLogger;
var impl_1 = __webpack_require__(5);
exports.createBuilderManager = impl_1.createBuilderManager;
var impl_2 = __webpack_require__(0);
var impl_3 = __webpack_require__(6);
function createLoginManager2(log) {
    return impl_2.createLoginManager(impl_3.createProviderManager(), log);
}
exports.createLoginManager2 = createLoginManager2;
//export { UrlParts, parse} from "./impl";
var impl_4 = __webpack_require__(0);
function urlparse(url) { return impl_4.parse(url); }
exports.urlparse = urlparse;
//export { decodeHash } from "./tokens/index"; 
//# sourceMappingURL=index.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createProviderManager() {
    return new ProviderManager();
}
exports.createProviderManager = createProviderManager;
var ProviderManager = (function () {
    function ProviderManager() {
        //********************************************************************
        //* Plugins:
        //* ========
        //* 
        //* 
        //********************************************************************
        this._flows = {};
    }
    ProviderManager.prototype.registerImplicitProvider = function (loginName, creator, log) {
        log.debug("Registering authentication flow \"" + loginName + "\"");
        this._flows[loginName] = { creator: creator, flow: null };
    };
    ProviderManager.prototype.registerHybridProvider = function (loginName, creator, log) {
        log.debug("Registering hybrid flow \"" + loginName + "\"");
        this._flows[loginName] = { creator: creator, flow: null };
    };
    ProviderManager.prototype.findProvider = function (name) {
        var info = this._flows[name];
        if (!info)
            return null;
        if (!info.flow)
            info.flow = info.creator();
        return info.flow; //as IImplicitProvider;
    };
    return ProviderManager;
}());
//# sourceMappingURL=manager.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(21);

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(22);

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new Error('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  return JSON.parse(base64_url_decode(token.split('.')[pos]));
};


/***/ })
/******/ ]);