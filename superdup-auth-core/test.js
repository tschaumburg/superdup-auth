/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Login2 = (function () {
    function Login2(_login, 
        //private readonly defaultAccessToken: IToken,
        _tokenMgr) {
        this._login = _login;
        this._tokenMgr = _tokenMgr;
    }
    Login2.prototype.login = function (userstate, success, redirecting, error) {
        this._login.login(userstate, success, redirecting, error);
    };
    Login2.prototype.logout = function () {
        this._login.logout();
    };
    Object.defineProperty(Login2.prototype, "user", {
        get: function () {
            return this._login.user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login2.prototype, "tokens", {
        get: function () {
            return this._tokenMgr.tokensByProvider(this._login.name);
        },
        enumerable: true,
        configurable: true
    });
    return Login2;
}());
exports.Login2 = Login2;
//# sourceMappingURL=login2.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//export { createLoginManager } from "../loginmanager"; 
var urlutils_1 = __webpack_require__(3);
exports.urlparse = urlutils_1.urlparse;
var asciitable_1 = __webpack_require__(16);
exports.AsciiTable = asciitable_1.AsciiTable;
var tokenutils_1 = __webpack_require__(17);
exports.decodeHash = tokenutils_1.decodeHash;
exports.isExpired = tokenutils_1.isExpired;
exports.getExpiration = tokenutils_1.getExpiration;
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createLog(target, logname) {
    return new Log(target, logname);
}
exports.createLog = createLog;
var Log = (function () {
    function Log(_target, _logname) {
        this._target = _target;
        if (!_logname)
            _logname = "";
        this._logname = _logname;
    }
    ;
    Log.prototype.format = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        return message;
    };
    Log.prototype.fatal = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._target.fatal(this._logname, this.format(message, optionalParams));
    };
    Log.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._target.error(this._logname, this.format(message, optionalParams));
    };
    ;
    Log.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._target.warn(this._logname, this.format(message, optionalParams));
    };
    Log.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._target.info(this._logname, this.format(message, optionalParams));
    };
    Log.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this._target.debug(this._logname, this.format(message, optionalParams));
    };
    Log.prototype.sublog = function (name) {
        var sub = this._logname;
        if (sub === "" || sub == null)
            sub = name;
        else
            sub = sub + "." + name;
        return new Log(this._target, sub);
    };
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var log_1 = __webpack_require__(0);
var ConsoleLog = (function () {
    function ConsoleLog() {
    }
    Object.defineProperty(ConsoleLog, "Current", {
        get: function () {
            if (ConsoleLog._target == null)
                ConsoleLog._target = new ConsoleTarget();
            if (ConsoleLog._log == null)
                ConsoleLog._log = new log_1.Log(ConsoleLog._target, "");
            return ConsoleLog._log;
        },
        enumerable: true,
        configurable: true
    });
    return ConsoleLog;
}());
ConsoleLog._target = null;
ConsoleLog._log = null;
exports.ConsoleLog = ConsoleLog;
var ConsoleTarget = (function () {
    function ConsoleTarget() {
    }
    //constructor(private readonly _console: ILog, private readonly _prefix: string = "") { }
    ConsoleTarget.prototype.fatal = function (logname, message) {
        console.error(logname + ": " + message);
    };
    ConsoleTarget.prototype.error = function (logname, message) {
        console.error(logname + ": " + message);
    };
    ConsoleTarget.prototype.warn = function (logname, message) {
        console.warn(logname + ": " + message);
    };
    ConsoleTarget.prototype.info = function (logname, message) {
        console.info(logname + ": " + message);
    };
    ConsoleTarget.prototype.debug = function (logname, message) {
        console.debug(logname + ": " + message);
    };
    return ConsoleTarget;
}());
exports.ConsoleTarget = ConsoleTarget;
//# sourceMappingURL=consolelog.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var consolelog_1 = __webpack_require__(1);
exports.ConsoleLog = consolelog_1.ConsoleLog;
exports.ConsoleTarget = consolelog_1.ConsoleTarget;
var log_1 = __webpack_require__(0);
exports.createLog = log_1.createLog;
//# sourceMappingURL=index.js.map

/***/ })
/******/ ])));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function urlparse(url) {
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
exports.urlparse = urlparse;
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var superdup_auth_log_1 = __webpack_require__(2);
var login2_1 = __webpack_require__(0);
var superdup_auth_core_apis_1 = __webpack_require__(5);
var superdup_auth_core_providers_1 = __webpack_require__(7);
var superdup_auth_core_login_1 = __webpack_require__(6);
var iauthenticationconfig_1 = __webpack_require__(9);
var superdup_auth_core_tokens_1 = __webpack_require__(8);
function createAuthenticationManager(log) {
    return new AuthenticationManager(superdup_auth_log_1.createLog(log, "auth"));
}
exports.createAuthenticationManager = createAuthenticationManager;
var AuthenticationManager = (function () {
    function AuthenticationManager(_log) {
        this._log = _log;
        this._apiManager = new superdup_auth_core_apis_1.ApiManager();
        var provider = superdup_auth_core_providers_1.createProviderManager(_log.sublog("providerManager"));
        this._loginManager = superdup_auth_core_login_1.createLoginManager(provider, this._log);
        this._tokenManager = superdup_auth_core_tokens_1.createTokenManager(this._log);
        this.config = iauthenticationconfig_1.createConfigBuilder(this._log, this._loginManager, this._tokenManager, this._apiManager);
    }
    AuthenticationManager.prototype.getLogin = function (loginName) {
        var impl = this._loginManager.getLogin(loginName);
        return new login2_1.Login2(impl, this._tokenManager);
    };
    //********************************************************************
    //* :
    //* ===================
    //* 
    //* 
    //********************************************************************
    AuthenticationManager.prototype.handleRedirect = function (url, success, noRedirect, error) {
        this._loginManager.handleRedirect(url, success, noRedirect, error);
    };
    AuthenticationManager.prototype.resolveAccessToken = function (url, success, error) {
        var tokenName = this._apiManager.resolveApi(url);
        if (!tokenName) {
            var msg = "URL " + url + " unprotected";
            this._log.debug(msg);
            success(null);
            return;
        }
        var token = this._tokenManager.tokenByName(tokenName);
        if (!token) {
            var msg = "Cannot get token " + tokenName + " for url " + url;
            this._log.debug(msg);
            error(msg);
            return;
        }
        token.getValue(success, error);
    };
    return AuthenticationManager;
}());
exports.AuthenticationManager = AuthenticationManager;
//# sourceMappingURL=authenticationmanager.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports) {

(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//var urlutils = require("../urlutils");

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
    UrlMapper.prototype.entries = function () {
        var res = [];
        for (var n = 0; n < this._valuesByDescendingUrl.length; n++) {
            var entry = this._valuesByDescendingUrl[n];
            res.push({ urlPrefix: entry.urlPrefix, value: entry.value });
        }
        return res;
    };
    return UrlMapper;
}());
exports.UrlMapper = UrlMapper;
//# sourceMappingURL=urlmapper.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlmapper_1 = __webpack_require__(0);
var ApiManager = (function () {
    function ApiManager() {
        this._mapper = new urlmapper_1.UrlMapper();
    }
    ApiManager.prototype.registerApi = function (urlPrefix, tokenName) {
        this._mapper.add(urlPrefix, tokenName);
    };
    ApiManager.prototype.resolveApi = function (url) {
        return this._mapper.map(url);
    };
    Object.defineProperty(ApiManager.prototype, "registrations", {
        get: function () {
            return this._mapper.entries().map(function (e) { return { urlPrefix: e.urlPrefix, tokenName: e.value }; });
        },
        enumerable: true,
        configurable: true
    });
    return ApiManager;
}());
exports.ApiManager = ApiManager;
//# sourceMappingURL=apimanager.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlmapper_1 = __webpack_require__(0);
exports.UrlMapper = urlmapper_1.UrlMapper;
var apimanager_1 = __webpack_require__(1);
exports.ApiManager = apimanager_1.ApiManager;
//# sourceMappingURL=index.js.map

/***/ })
/******/ ])));

/***/ }),
/* 6 */
/***/ (function(module, exports) {

(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var userstore_1 = __webpack_require__(8);
var login_1 = __webpack_require__(5);
var tokenutils_1 = __webpack_require__(6);
function createLoginManager(providerManager, log) {
    return new LoginManager(providerManager, log);
}
exports.createLoginManager = createLoginManager;
var LoginManager = (function () {
    function LoginManager(_providerManager, _log) {
        this._providerManager = _providerManager;
        this._logins = {};
        this._initialTokens = {};
        if (!_log)
            throw new Error("A non-null log parameter must be supplied");
        this.log = _log;
        this._userManager = new userstore_1.UserStore(_log);
    }
    Object.defineProperty(LoginManager.prototype, "providerManager", {
        //private readonly _urlMapper: IUrlMapper<string> = new UrlMapper<string>();
        get: function () { return this._providerManager; },
        enumerable: true,
        configurable: true
    });
    //********************************************************************
    //* Registrations:
    //* ==============
    //* 
    //* 
    //********************************************************************
    LoginManager.prototype.createImplicitLogin = function (loginName, flow, idScopes, initialAccessToken) {
        var flowlog = this.log.sublog(loginName);
        var provider = this.providerManager.registerImplicitProvider(loginName, function () { return flow(flowlog); }, idScopes, initialAccessToken);
        //this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);
        var login = new login_1.Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;
        return login;
    };
    LoginManager.prototype.createAuthcodeLogin = function (loginName, flow, requestRefreshToken) {
        var flowlog = this.log.sublog(loginName);
        var provider = this.providerManager.registerAuthcodeProvider(loginName, function () { return flow(flowlog); }, requestRefreshToken);
        var login = new login_1.Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;
        return login;
    };
    LoginManager.prototype.createHybridLogin = function (loginName, flow, idScopes, requestAccessToken, requestRefreshToken) {
        var flowlog = this.log.sublog(loginName);
        var provider = this.providerManager.registerHybridProvider(loginName, function () { return flow(flowlog); }, idScopes, requestAccessToken, requestRefreshToken);
        //this.registerAccessToken2(loginName, requestAccessToken.name, requestAccessToken.resource, requestAccessToken.scopes, requestAccessToken.protectUrls);
        //for (var token of additionalAccessTokens)
        //    this.registerAccessToken2(loginName, token.name, token.resource, token.scopes, token.protectUrls);
        var login = new login_1.Login(this, provider, this._userManager, flowlog, loginName);
        this._logins[loginName] = login;
        return login;
    };
    Object.defineProperty(LoginManager.prototype, "loginNames", {
        get: function () {
            var res = [];
            for (var loginName in this._logins)
                res.push(loginName);
            return res;
        },
        enumerable: true,
        configurable: true
    });
    LoginManager.prototype.getLogin = function (loginName) {
        return this._logins[loginName];
    };
    //********************************************************************
    //* Handling redirects:
    //* ===================
    //* 
    //* 
    //********************************************************************
    LoginManager.prototype.handleRedirect = function (url, success, noRedirect, error) {
        var _this = this;
        var sublog = this.log.sublog("handleRedirect");
        var sanitizedUrl = url && url.substr(0, 20);
        sublog.debug("handleRedirect(): Checking if this is an authentication response redirect (url=" + sanitizedUrl + "...)");
        // First sneak-peek at the '...#state=...' fragment of the URL,
        // to see if this is a recognizable redirect:
        var state = tokenutils_1.decodeHash(url);
        if (!state) {
            var msg = "Not a redirect url";
            sublog.debug("handleRedirect(): ...not a redirect");
            noRedirect();
            return null;
        }
        var loginName = state.flow;
        //var accessTokenName = state.at;
        var userstate = state.uss;
        var nonce = state.nonce;
        var flow = this.providerManager.findProvider(loginName);
        if (!flow) {
            var msg = "Redirect URL references login named " + loginName + " - but no such login has been registered";
            sublog.error("handleRedirect(): " + msg);
            error(loginName, msg, userstate);
            ;
            return null;
        }
        //var requestedAccessTokenName = accessTokenName;
        sublog.debug("handleRedirect() => " + loginName + ".handleRedirect()");
        flow.handleRedirect(url, nonce, function (user, accessTokenName, accessToken) {
            // Check to see that we got what we asked for:
            if (!!accessTokenName) {
                if (!accessToken) {
                    var msg = "login \"" + loginName + "\"did not return the requested access token \"" + accessTokenName + "\"";
                    _this.log.error("handleRedirect(): " + msg);
                    return error(loginName, msg, userstate);
                }
            }
            sublog.info("handleRedirect(): successful redirect processed");
            var sanitizedAccessToken = accessToken && accessToken.substr(0, accessToken.length / 2);
            var sanitizedIdtoken = user.idtoken && user.idtoken.substr(0, user.idtoken.length / 2);
            sublog.debug("handleRedirect(): Saving tokens");
            sublog.debug("handleRedirect():    idtoken = " + sanitizedIdtoken);
            sublog.debug("handleRedirect():    " + accessTokenName + " = " + sanitizedAccessToken);
            //this.tokenManager.setValue(accessTokenName, accessToken, sublog);
            _this._userManager.set(loginName, user);
            success(loginName, user, userstate);
        }, function (reason) { error(loginName, reason, userstate); });
        return userstate;
    };
    return LoginManager;
}());
exports.LoginManager = LoginManager;
//# sourceMappingURL=loginmanager.js.map

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var datastore_1 = __webpack_require__(1);
exports.DataStore = datastore_1.DataStore;
var istorage_1 = __webpack_require__(3);
exports.LocalStorageStore = istorage_1.LocalStorageStore;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var EventDispatcher = (function () {
    function EventDispatcher() {
        this._subscriptions = new Array();
    }
    EventDispatcher.prototype.subscribe = function (fn) {
        if (fn) {
            this._subscriptions.push(fn);
        }
    };
    EventDispatcher.prototype.unsubscribe = function (fn) {
        var i = this._subscriptions.indexOf(fn);
        if (i > -1) {
            this._subscriptions.splice(i, 1);
        }
    };
    EventDispatcher.prototype.dispatch = function () {
        for (var _i = 0, _a = this._subscriptions; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler();
        }
    };
    EventDispatcher.prototype.clear = function () {
        this._subscriptions = [];
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=event.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var event_1 = __webpack_require__(4);
var Login = (function () {
    function Login(manager, provider, _userManager, log, name) {
        this.manager = manager;
        this.provider = provider;
        this._userManager = _userManager;
        this.log = log;
        this.name = name;
        this._loggedIn = new event_1.EventDispatcher(); // IEvent<void, void> = new EventDispatcher<void, void>();
        this._loggingOut = new event_1.EventDispatcher(); //EventDispatcher<void, void> = new EventDispatcher<void, void>();
    }
    //********************************************************************
    //* ILogin: basic login/logout:
    //* ===========================
    //* 
    //* 
    //********************************************************************
    Login.prototype.login = function (userstate, success, redirecting, error) {
        var _this = this;
        this.log.info("login(loginName=" + this.name + ")");
        var nonce = this.makeNonce(); // this.createNonce(loginName, accessTokenName);
        var encodedState = JSON.stringify({ flow: this.name, nonce: nonce, uss: userstate });
        this.log.info("login(loginName=" + this.name + ", nonce=" + nonce + ")");
        this.provider.login(nonce, encodedState, function (user, accessTokenName, accessTokenValue) {
            _this.log.info("Login succeeeded!");
            _this._implicitTokenValue = accessTokenValue;
            _this._userManager.set(_this.name, user);
            success();
            _this._loggedIn.dispatch();
        }, redirecting, function (reason) {
            error(reason);
        });
    };
    Login.prototype.makeNonce = function () {
        var length = 10;
        var text = "n"; // prefix "n" => nonce is valid property name
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    Login.prototype.logout = function () {
        this._loggingOut.dispatch();
        //this.manager.logout2(this.name, this.log);
        this.log.info("Logging out");
        this.provider.logout();
        this._implicitTokenValue = null;
        this._userManager.clear(this.name);
    };
    Object.defineProperty(Login.prototype, "loggedIn", {
        get: function () { return this._loggedIn; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login.prototype, "loggingOut", {
        get: function () { return this._loggingOut; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login.prototype, "user", {
        get: function () {
            return this._userManager.get(this.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Login.prototype, "implicitTokenValue", {
        get: function () { return this._implicitTokenValue; },
        enumerable: true,
        configurable: true
    });
    //********************************************************************
    //* IAuthCodeLogin:
    //* ===================
    //* 
    //* 
    //********************************************************************
    Login.prototype.acquireAccessToken = function (resource, scopes, success, error) {
        this.provider.requestAccessToken(resource, scopes, success, error);
    };
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlutils = __webpack_require__(7);
function parseRedirectUrl(redirectUrl) {
    if (!redirectUrl)
        return null;
    var result = {};
    var urlParts = urlutils.urlparse(redirectUrl);
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
//# sourceMappingURL=tokenutils.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function urlparse(url) {
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
exports.urlparse = urlparse;
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var datastore_1 = __webpack_require__(2);
var UserStore = (function (_super) {
    __extends(UserStore, _super);
    function UserStore(log) {
        return _super.call(this, new datastore_1.LocalStorageStore(), "sdpIdTokens", log) || this;
    }
    return UserStore;
}(datastore_1.DataStore));
exports.UserStore = UserStore;
//# sourceMappingURL=userstore.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//export { createBuilderManager } from "./builders/impl";
var loginmanager_1 = __webpack_require__(0);
exports.createLoginManager = loginmanager_1.createLoginManager;
//import { createProviderManager } from "./providers/impl";
//import { ILog } from "superdup-auth-log"; 
//import { ILoginManager } from "./iloginmanager"; 
//export function createLoginManager2(log: ILog): ILoginManager
//{
//    return createLoginManager(createProviderManager(), log);
//}
////export { UrlParts, parse} from "./impl";
//import { UrlParts, parse} from "./impl";
//export function urlparse(url: string): UrlParts { return parse(url); }
////export { decodeHash } from "./tokens/index"; 
//# sourceMappingURL=index.js.map

/***/ })
/******/ ])));

/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var FlowHelper = (function () {
    function FlowHelper() {
    }
    FlowHelper.ImplicitInfo = function (include_idtoken, include_accesstoken) {
        if (!include_idtoken && !include_accesstoken) {
            throw new Error("You cannot request an implicit flow with neither access nor ID tokens. See " + FlowHelper.oauth2Url);
        }
        var result = {
            audience: undefined,
            scopes: [],
            response_types: []
        };
        if (!!include_idtoken) {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);
            result.response_types.push("id_token");
        }
        if (!!include_accesstoken) {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);
            result.response_types.push("token");
        }
        return result;
    };
    FlowHelper.AuthCodeInfo = function (include_idtoken, include_refreshtoken, include_accesstoken) {
        if (!include_idtoken && !include_accesstoken) {
            throw new Error("You cannot request an authorization code flow with neither access nor ID tokens. See " + FlowHelper.openidUrl);
        }
        var result = {
            audience: undefined,
            scopes: [],
            response_types: ['code']
        };
        if (include_refreshtoken) {
            result.scopes.push("offline_access");
        }
        if (!!include_idtoken) {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);
        }
        if (!!include_accesstoken) {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);
        }
        return result;
    };
    FlowHelper.HybridInfo = function (include_idtoken, include_refreshtoken, include_accesstoken) {
        if (!include_idtoken && !include_accesstoken) {
            throw new Error("You cannot request a hybrid flow with neither access nor ID tokens. See " + FlowHelper.openidUrl);
        }
        var result = {
            audience: undefined,
            scopes: [],
            response_types: ['code']
        };
        if (include_refreshtoken) {
            result.scopes.push("offline_access");
        }
        if (!!include_idtoken) {
            if (include_idtoken.indexOf("openid") < 0)
                result.scopes.push("openid");
            result.scopes = result.scopes.concat(include_idtoken);
            result.response_types.push("id_token");
        }
        if (!!include_accesstoken) {
            result.audience = include_accesstoken.api_resource;
            result.scopes = result.scopes.concat(include_accesstoken.api_scopes);
            result.response_types.push("token");
        }
        return result;
    };
    return FlowHelper;
}());
FlowHelper.oauth2Url = "http://tools.ietf.org/html/rfc6749";
FlowHelper.openidUrl = "http://openid.net/specs/openid-connect-core-1_0.html";
exports.FlowHelper = FlowHelper;
//# sourceMappingURL=flowhelper.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function createProviderManager(log) {
    return new ProviderManager(log);
}
exports.createProviderManager = createProviderManager;
var ProviderManager = (function () {
    function ProviderManager(_log) {
        this._log = _log;
        //********************************************************************
        //* Plugins:
        //* ========
        //* 
        //* 
        //********************************************************************
        this._flows = {};
    }
    ProviderManager.prototype.registerImplicitProvider = function (loginName, creator, idScopes, requestAccessToken) {
        this._log.debug("Registering authentication flow \"" + loginName + "\"");
        var res = new ImplicitProviderAdapter(creator, idScopes, requestAccessToken); // { creator: creator, flow: null };
        this._flows[loginName] = res;
        return res;
    };
    ProviderManager.prototype.registerAuthcodeProvider = function (loginName, creator, requestRefreshToken) {
        this._log.debug("Registering code flow \"" + loginName + "\"");
        var res = new AuthcodeProviderAdapter(creator, requestRefreshToken); // { creator: creator, flow: null };
        this._flows[loginName] = res;
        return res;
    };
    ProviderManager.prototype.registerHybridProvider = function (loginName, creator, idScopes, requestAccessToken, requestRefreshToken) {
        this._log.debug("Registering hybrid flow \"" + loginName + "\"");
        var res = new HybridProviderAdapter(creator, idScopes, requestAccessToken, requestRefreshToken); // { creator: creator, flow: null };
        this._flows[loginName] = res;
        return res;
    };
    ProviderManager.prototype.findProvider = function (name) {
        var info = this._flows[name];
        return info; //as IImplicitProvider;
    };
    return ProviderManager;
}());
var ImplicitProviderAdapter = (function () {
    function ImplicitProviderAdapter(creator, idScopes, requestInitialAccessToken) {
        this.creator = creator;
        this.idScopes = idScopes;
        this.requestInitialAccessToken = requestInitialAccessToken;
        this._provider = null;
    }
    Object.defineProperty(ImplicitProviderAdapter.prototype, "provider", {
        get: function () {
            if (!this._provider)
                this._provider = this.creator();
            return this._provider;
        },
        enumerable: true,
        configurable: true
    });
    ImplicitProviderAdapter.prototype.login = function (nonce, state, success, redirecting, error) {
        var accessTokenName = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;
        this.provider.login(nonce, state, this.idScopes, this.requestInitialAccessToken, function (user, accesstoken) {
            success(user, accessTokenName, accesstoken);
        }, redirecting, error);
    };
    ImplicitProviderAdapter.prototype.requestAccessToken = function (resource, scopes, success, error) {
        throw new Error("Implicit flow does not support token acquisition after login");
    };
    ImplicitProviderAdapter.prototype.handleRedirect = function (url, nonce, success, error) {
        var accessTokenName = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;
        this.provider.handleRedirect(url, nonce, function (user, accessToken) {
            success(user, accessTokenName, accessToken);
        }, error);
    };
    ImplicitProviderAdapter.prototype.logout = function () {
        this.provider.logout();
    };
    return ImplicitProviderAdapter;
}());
var AuthcodeProviderAdapter = (function () {
    function AuthcodeProviderAdapter(creator, requestRefreshToken) {
        this.creator = creator;
        this.requestRefreshToken = requestRefreshToken;
        this._provider = null;
    }
    Object.defineProperty(AuthcodeProviderAdapter.prototype, "provider", {
        get: function () {
            if (!this._provider)
                this._provider = this.creator();
            return this._provider;
        },
        enumerable: true,
        configurable: true
    });
    AuthcodeProviderAdapter.prototype.login = function (nonce, state, success, redirecting, error) {
        this.provider.login(this.requestRefreshToken, nonce, state, function () {
            success();
        }, redirecting, error);
    };
    AuthcodeProviderAdapter.prototype.requestAccessToken = function (resource, scopes, success, error) {
        this.provider.requestAccessToken(resource, scopes, success, error);
    };
    AuthcodeProviderAdapter.prototype.handleRedirect = function (url, nonce, success, error) {
        this.provider.handleRedirect(url, nonce, function () {
            success();
        }, error);
    };
    AuthcodeProviderAdapter.prototype.logout = function () {
        this.provider.logout();
    };
    return AuthcodeProviderAdapter;
}());
var HybridProviderAdapter = (function () {
    function HybridProviderAdapter(creator, idScopes, requestInitialAccessToken, requestRefreshToken) {
        this.creator = creator;
        this.idScopes = idScopes;
        this.requestInitialAccessToken = requestInitialAccessToken;
        this.requestRefreshToken = requestRefreshToken;
        this._provider = null;
    }
    Object.defineProperty(HybridProviderAdapter.prototype, "provider", {
        get: function () {
            if (!this._provider)
                this._provider = this.creator();
            return this._provider;
        },
        enumerable: true,
        configurable: true
    });
    HybridProviderAdapter.prototype.login = function (nonce, state, success, redirecting, error) {
        var accessTokenName = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;
        this.provider.login(this.requestRefreshToken, nonce, state, this.idScopes, this.requestInitialAccessToken, function (user, accesstoken) {
            success(user, accessTokenName, accesstoken);
        }, redirecting, error);
    };
    HybridProviderAdapter.prototype.requestAccessToken = function (resource, scopes, success, error) {
        this.provider.requestAccessToken(resource, scopes, success, error);
    };
    HybridProviderAdapter.prototype.handleRedirect = function (url, nonce, success, error) {
        var accessTokenName = null;
        if (!!this.requestInitialAccessToken)
            accessTokenName = this.requestInitialAccessToken.name;
        this.provider.handleRedirect(url, nonce, function (user, accessToken) {
            success(user, accessTokenName, accessTokenName);
        }, error);
    };
    HybridProviderAdapter.prototype.logout = function () {
        this.provider.logout();
    };
    return HybridProviderAdapter;
}());
//# sourceMappingURL=manager.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var manager_1 = __webpack_require__(1);
exports.createProviderManager = manager_1.createProviderManager;
//export { IThreeLegggedFlow } from "./ibase";
var flowhelper_1 = __webpack_require__(0);
exports.FlowHelper = flowhelper_1.FlowHelper;
//# sourceMappingURL=index.js.map

/***/ })
/******/ ])));

/***/ }),
/* 8 */
/***/ (function(module, exports) {

(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import { IMultiMap, MultiMap } from "./datatypes/multimap";
var tokenstore_1 = __webpack_require__(2);
var token_1 = __webpack_require__(1);
function createTokenManager(/*acquireAccessToken: acquireTokenFn,*/ log, tokenStore) {
    if (tokenStore === void 0) { tokenStore = null; }
    if (!tokenStore)
        tokenStore = new tokenstore_1.LocalStorageTokenStore();
    return new AccessTokenManager(tokenStore /*, acquireAccessToken*/, log);
}
exports.createTokenManager = createTokenManager;
//export type acquireTokenFn =
//(
//    loginName: string,
//    resource: string,
//    scopes: string[],
//    success: (token: string) => void,
//    error: (reason: any) => void
//) => void;
var AccessTokenManager = (function () {
    function AccessTokenManager(tokenStore /*, private readonly acquireAccessToken: acquireTokenFn*/, _log) {
        this.tokenStore = tokenStore; /*, private readonly acquireAccessToken: acquireTokenFn*/
        this._log = _log;
        // 
        // =============
        this._tokens = {};
        this.loadState(_log);
    }
    Object.defineProperty(AccessTokenManager.prototype, "tokenNames", {
        get: function () {
            var res = [];
            for (var tokenName in this._tokens)
                res.push(tokenName);
            return res;
        },
        enumerable: true,
        configurable: true
    });
    AccessTokenManager.prototype.tokenByName = function (tokenName) {
        return this._tokens[tokenName];
    };
    AccessTokenManager.prototype.tokensByProvider = function (providerName) {
        var res = [];
        for (var tokenname in this._tokens) {
            var tokenInfo = this._tokens[tokenname];
            if (!tokenInfo.provider || !tokenInfo.provider.providerId) {
                if (!providerName)
                    res.push(tokenInfo);
                continue;
            }
            if (tokenInfo.provider.providerId === providerName) {
                res.push(tokenInfo);
            }
        }
        return res;
    };
    AccessTokenManager.prototype.loadState = function (log) {
        log.info("Reloading persisted authentication state...");
        var loadedValues = this.tokenStore.loadAll();
        if (!loadedValues) {
            log.info("...no tokens found");
            return;
        }
        log.info("...reloaded " + loadedValues.length + " access tokens from token storage");
        for (var n = 0; n < loadedValues.length; n++) {
            var loadedValue = loadedValues[n];
            // no value =>  don't save:
            if (!loadedValue.value) {
                log.debug("   ...skipping access token " + loadedValue.name + " (no value)");
                continue;
            }
            var token = this._tokens[loadedValue.name];
            if (!token)
                continue;
            //// expired value =>  don't save:
            //if (isExpired(tokenInfo.expiresAt))
            //{
            //    log.debug("   ...skipping access token " + tokenInfo.name + " (expired)");
            //    continue;
            //}
            token.setValue(loadedValue.value);
            log.debug("   ...reloaded access token " + loadedValue.name + " from token storage");
        }
    };
    //private saveState(log: ILog)
    //{
    //    log.info("Persisting authentication state...");
    //    var tokens: Token[] = [];
    //    for (var tokenName in this._tokens)
    //    {
    //        var tokenInfo = this._tokens[tokenName];
    //        // no value =>  don't save:
    //        if (!tokenInfo.tokenValue)
    //        {
    //            log.debug("   ...skipping access token " + tokenInfo.tokenName + " (no value)");
    //            continue;
    //        }
    //        // expired value =>  don't save:
    //        if (isExpired(tokenInfo.expiresAt))
    //        {
    //            log.debug("   ...skipping access token " + tokenInfo.tokenName + " (expired)");
    //            continue;
    //        }
    //        log.debug("   ...saving access token " + tokenInfo.tokenName + " to token storage");
    //        tokens.push(tokenInfo);
    //    }
    //    this.tokenStore.saveAll(tokens);
    //    log.info("...saved " + tokens.length + " access tokens");
    //}
    AccessTokenManager.prototype.registerProvider = function (tokenName, providedBy) {
        this._log.info("Registering provider " + providedBy.providerId + " for token " + tokenName);
        var token = this._tokens[tokenName];
        if (!token) {
            var msg = "No token " + tokenName + " registered";
            this._log.error(msg);
            throw new Error(msg);
        }
        if (!!token.provider) {
            var msg = "Token " + tokenName + " already has a provider registered";
            this._log.error(msg);
            throw new Error(msg);
        }
        token.provider = providedBy;
    };
    AccessTokenManager.prototype.registerToken = function (tokenName, resource, scopes) {
        this._log.debug("Registering access token \"" +
            tokenName +
            "\" (" +
            "resource=" + resource + ", " +
            "scopes=" + JSON.stringify(scopes) +
            ")");
        var existingValue = this._tokens[tokenName];
        var self = this;
        var newValue = new token_1.Token(tokenName, resource, scopes, null, //providedBy,
        this.tokenStore, this._log);
        if (!!existingValue) {
            if (this.sameDefinition(existingValue, newValue))
                return existingValue;
            this._log.error("Trying to redefine access token \"" + tokenName + "\"");
        }
        this._tokens[tokenName] = newValue;
        return newValue;
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
    return AccessTokenManager;
}());
//# sourceMappingURL=tokenmanager.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var tokenutils_1 = __webpack_require__(3);
var Token = (function () {
    function Token(tokenName, resource, scopes, provider, tokenStore, log) {
        this.tokenName = tokenName;
        this.resource = resource;
        this.scopes = scopes;
        this.tokenStore = tokenStore;
        this.log = log;
        this.expiresAt = null;
        this._provider = null;
        this._tokenValue = null;
        var self = this;
        this.provider = provider;
    }
    Object.defineProperty(Token.prototype, "provider", {
        get: function () {
            return this._provider;
        },
        set: function (value) {
            if (value == this._provider)
                return;
            if (!!this._provider) {
                var self = this;
                this.provider.loggingOut.unsubscribe(function () {
                    self.clearValue();
                });
            }
            this._provider = value;
            if (!!this._provider) {
                var self = this;
                this.provider.loggingOut.subscribe(function () {
                    self.clearValue();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "tokenValue", {
        get: function () {
            return this._tokenValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "providerId", {
        get: function () {
            if (!this.provider)
                return null;
            return this.provider.providerId;
        },
        enumerable: true,
        configurable: true
    });
    Token.prototype.getValue = function (success, error) {
        var _this = this;
        // Check for expiration:
        if (tokenutils_1.isExpired(this.expiresAt)) {
            this._tokenValue = null;
            this.expiresAt = null;
        }
        if (!!this._tokenValue)
            return success(this._tokenValue);
        this.provider.provideTokenValue(this.resource, this.scopes, function (value) {
            _this.setValue(value);
            success(value);
        }, error);
    };
    Token.prototype.setValue = function (accessTokenValue) {
        if (!accessTokenValue) {
            this.log.debug("Unexpected: resolving null value for access token " + this.tokenName);
            return;
        }
        this._tokenValue = accessTokenValue;
        this.expiresAt = tokenutils_1.getExpiration(accessTokenValue);
        if (tokenutils_1.isExpired(this.expiresAt)) {
            this.log.debug("Expired value for access token " + this.tokenName);
            this._tokenValue = null;
            this.expiresAt = null;
            return;
        }
        this.tokenStore.saveToken(this.tokenName, this._tokenValue);
    };
    Token.prototype.clearValue = function () {
        this.log.debug("Clearing access token " + this.tokenName);
        this._tokenValue = null;
        this.expiresAt = null;
        this.tokenStore.clearToken(this.tokenName);
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=token.js.map

/***/ }),
/* 2 */
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
    LocalStorageTokenStore.prototype.saveToken = function (name, value) { };
    LocalStorageTokenStore.prototype.clearToken = function (name) { };
    return LocalStorageTokenStore;
}());
exports.LocalStorageTokenStore = LocalStorageTokenStore;
//# sourceMappingURL=tokenstore.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var jwtdecode = __webpack_require__(7);
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
//# sourceMappingURL=tokenutils.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//export { AccessTokenInfo } from "./tokeninfo";
var tokenmanager_1 = __webpack_require__(0);
exports.createTokenManager = tokenmanager_1.createTokenManager;
//# sourceMappingURL=index.js.map

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(5);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(6);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ })
/******/ ])));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var authenticationconfig_1 = __webpack_require__(11);
function createConfigBuilder(log, loginManager, tokenManager, apiManager) {
    return new authenticationconfig_1.AuthenticationConfig(log, loginManager, tokenManager, apiManager);
}
exports.createConfigBuilder = createConfigBuilder;
//# sourceMappingURL=iauthenticationconfig.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ApiBuilder = (function () {
    function ApiBuilder(urls, _tokenManager, _apiManager, _log) {
        this.urls = urls;
        this._tokenManager = _tokenManager;
        this._apiManager = _apiManager;
        this._log = _log;
        this._requires = null;
        this._providedBy = null;
    }
    ApiBuilder.prototype.requiresToken = function (accessToken) {
        this._requires = accessToken;
        return new ApiTokenRequirement(this);
    };
    ApiBuilder.prototype.providedBy = function (login) {
        this._providedBy = login;
        return this;
    };
    ApiBuilder.prototype.registerAs = function (name) {
        if (!!this._requires && !!this.urls) {
            for (var _i = 0, _a = this.urls; _i < _a.length; _i++) {
                var url = _a[_i];
                this._apiManager.registerApi(url, this._requires.tokenName);
            }
        }
        if (!!this._requires && !!this._providedBy) {
            this._tokenManager.registerToken;
        }
    };
    return ApiBuilder;
}());
exports.ApiBuilder = ApiBuilder;
var ApiTokenRequirement = (function () {
    function ApiTokenRequirement(_builder) {
        this._builder = _builder;
    }
    ApiTokenRequirement.prototype.providedBy = function (login) {
        return this._builder.providedBy(login);
    };
    return ApiTokenRequirement;
}());
exports.ApiTokenRequirement = ApiTokenRequirement;
//# sourceMappingURL=apibuilder.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var apibuilder_1 = __webpack_require__(10);
var tokenbuilder_1 = __webpack_require__(14);
var implicitloginbuilder_1 = __webpack_require__(13);
var hybridloginbuilder_1 = __webpack_require__(12);
//import { TokenBuilder, ApiBuilder } from "../ihybridloginbuilder";
var utils_1 = __webpack_require__(1);
var AuthenticationConfig = (function () {
    //private readonly _loginManager: ILoginManager;
    //private readonly _tokenManager: ITokenManager;
    //private readonly _apiManager: ApiManager = new ApiManager();
    function AuthenticationConfig(_log, _loginManager, _tokenManager, _apiManager) {
        this._log = _log;
        this._loginManager = _loginManager;
        this._tokenManager = _tokenManager;
        this._apiManager = _apiManager;
        //var provider = createProviderManager();
        //this._loginManager = createLoginManager(provider, this._log);
        //this._tokenManager = createTokenManager(this._log);
    }
    //********************************************************************
    //* Logins:
    //* ===================
    //* 
    //* 
    //********************************************************************
    AuthenticationConfig.prototype.implicitLogin = function (flow) {
        return new implicitloginbuilder_1.TImplicitLoginBuilder(this._loginManager, this._tokenManager, flow);
    };
    AuthenticationConfig.prototype.hybridLogin = function (flow) {
        return new hybridloginbuilder_1.THybridLoginBuilder(this._loginManager, this._tokenManager, flow);
    };
    //********************************************************************
    //* Tokens:
    //* =======
    //* 
    //* 
    //********************************************************************
    AuthenticationConfig.prototype.token = function (resource, scopes) {
        return new tokenbuilder_1.TokenBuilder(this._tokenManager, resource, scopes, this._log);
    };
    //********************************************************************
    //* APIs:
    //* =======
    //* 
    //* 
    //********************************************************************
    AuthenticationConfig.prototype.api = function () {
        var urls = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            urls[_i] = arguments[_i];
        }
        return new apibuilder_1.ApiBuilder(urls, this._tokenManager, this._apiManager, this._log);
    };
    AuthenticationConfig.prototype.verify = function () {
        var errors = [];
        var verifiedTokenNames = [];
        var verifiedProviderIds = [];
        for (var _i = 0, _a = this._apiManager.registrations; _i < _a.length; _i++) {
            var api = _a[_i];
            if (!api.tokenName) {
                errors.push("Missing token name in API registration: URL prefix " + api.urlPrefix + " registered with token name " + api.tokenName);
                continue;
            }
            if (verifiedTokenNames.indexOf(api.tokenName) >= 0)
                continue;
            verifiedTokenNames.push(api.tokenName);
            var token = this._tokenManager.tokenByName(api.tokenName);
            if (!token) {
                errors.push("Undefined token: token name " + api.tokenName + " (required by URL " + api.urlPrefix + ") is not defined");
                continue;
            }
            if (!token.providerId) {
                errors.push("Missing provider in token registration: token " + token.tokenName + " registered with provider " + token.providerId);
                continue;
            }
            if (verifiedProviderIds.indexOf(token.providerId) >= 0)
                continue;
            verifiedProviderIds.push(token.providerId);
            var login = this._loginManager.getLogin(token.providerId);
            if (!login) {
                errors.push("Undefined login: login name " + token.providerId + " (providing token " + token.tokenName + ") is not defined");
                continue;
            }
        }
        var warnings = [];
        for (var _b = 0, _c = this._loginManager.loginNames; _b < _c.length; _b++) {
            var loginName = _c[_b];
            var tokens = this._tokenManager.tokensByProvider(loginName);
            if (!tokens || tokens.length == 0) {
                warnings.push("Unreferenced login: Login " + loginName + " is defined, but not registered to provide any access tokens");
            }
        }
        for (var _d = 0, _e = this._tokenManager.tokenNames; _d < _e.length; _d++) {
            var tokenName = _e[_d];
            var isUsed = this._apiManager.registrations.some(function (api) { return api.tokenName === tokenName; });
            if (!isUsed)
                warnings.push("Unreferenced token: Token " + tokenName + " is defined, but not registered for use with any API");
        }
        var errMsg = null;
        if (errors.length > 0) {
            errMsg = "The authentication configuration contained the following errors:";
            for (var _f = 0, errors_1 = errors; _f < errors_1.length; _f++) {
                var err = errors_1[_f];
                errMsg = errMsg + "\n    " + err;
                this._log.error(err);
            }
        }
        var warningMsg = null;
        if (warnings.length > 0) {
            warningMsg = "The authentication configuration contained the following peculiarities that might indicate a problem:";
            for (var _g = 0, warnings_1 = warnings; _g < warnings_1.length; _g++) {
                var warning = warnings_1[_g];
                warningMsg = warningMsg + "\n    " + warning;
                this._log.warn(warning);
            }
        }
        if (errMsg != null)
            throw new Error(errMsg);
    };
    AuthenticationConfig.prototype.toString = function () {
        var _this = this;
        var apis = this._apiManager.registrations;
        var tokens = this._tokenManager.tokenNames.map(function (tokenname) { return _this._tokenManager.tokenByName(tokenname); });
        var logins = this._loginManager.loginNames.map(function (loginname) { return _this._loginManager.getLogin(loginname); });
        var apis_tokens_logins = Query
            .OuterJoin(apis, tokens, function (api, token) { return api.tokenName === token.tokenName; })
            .OuterJoin(logins, function (api, token, login) { return token.providerId === login.name; })
            .Select(function (api, token, login) { return { api: api, token: token, login: login }; });
        var stateTable = new utils_1.AsciiTable(20, 12, 12, 18, 25, 12, 12, 12, 40);
        stateTable
            .Separator(2, 4, 3)
            .AddCell("API definition", 2)
            .AddCell("Token definition", 4)
            .AddCell("Login definition", 3)
            .Newline()
            .Separator(1, 1, 1, 1, 1, 1, 1, 1, 1)
            .AddCell("URL")
            .AddCell("Token name")
            .AddCell("Token name")
            .AddCell("Resource")
            .AddCell("Scopes")
            .AddCell("Login name")
            .AddCell("Login name")
            .AddCell("Provider")
            .AddCell("Provider parameters")
            .Separator(1, 1, 1, 1, 1, 1, 1, 1, 1);
        "+--------------------------------+---------------------------------------------+---------------------------------------------+\n" +
            "|         API definition         |              Token definition               |              Login definition               |\n" +
            "+--------------------------------+---------------------------------------------+---------------------------------------------+\n" +
            "|        URL        | Token name | Token name | Resource | Scopes | Login name | Login name | Provider | Provider parameters |\n" +
            "+-------------------+------------+------------+----------+--------+------------+------------+----------+---------------------+\n";
        for (var _i = 0, apis_tokens_logins_1 = apis_tokens_logins; _i < apis_tokens_logins_1.length; _i++) {
            var line = apis_tokens_logins_1[_i];
            if (!!line.api) {
                stateTable
                    .AddCell(line.api.urlPrefix)
                    .AddCell(line.api.tokenName);
            }
            else {
                stateTable
                    .AddCell("-")
                    .AddCell("-");
            }
            if (!!line.token) {
                stateTable
                    .AddCell(line.token.tokenName)
                    .AddCell(line.token.resource)
                    .AddCell(line.token.scopes.join(", "))
                    .AddCell(line.token.providerId);
            }
            else {
                stateTable
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-");
            }
            if (!!line.login) {
                stateTable
                    .AddCell(line.login.name)
                    .AddCell("?")
                    .AddCell("?");
            }
            else {
                stateTable
                    .AddCell("-")
                    .AddCell("-")
                    .AddCell("-");
            }
            stateTable.Newline();
        }
        stateTable.Separator(1, 1, 1, 1, 1, 1, 1, 1, 1);
        var res = stateTable.toString();
        this._log.info(res);
        return res;
    };
    return AuthenticationConfig;
}());
exports.AuthenticationConfig = AuthenticationConfig;
var Query = (function () {
    function Query() {
    }
    Query.OuterJoin = function (part1, part2, onPredicate) {
        var res = [];
        for (var _i = 0, part1_1 = part1; _i < part1_1.length; _i++) {
            var p1 = part1_1[_i];
            var p1Matched = false;
            for (var _a = 0, part2_1 = part2; _a < part2_1.length; _a++) {
                var p2 = part2_1[_a];
                var pred = false;
                try {
                    pred = onPredicate(p1, p2);
                }
                catch (err) {
                }
                if (pred) {
                    res.push({ p1: p1, p2: p2 });
                    p1Matched = true;
                }
            }
            if (!p1Matched)
                res.push({ p1: p1, p2: null });
        }
        for (var _b = 0, part2_2 = part2; _b < part2_2.length; _b++) {
            var p2 = part2_2[_b];
            if (!res.some(function (r) { return r.p2 == p2; }))
                res.push({ p1: null, p2: p2 });
        }
        return new QueryResult(res);
    };
    return Query;
}());
var QueryResult = (function () {
    function QueryResult(res) {
        this.res = res;
    }
    QueryResult.prototype.Select = function (createResult) {
        return this.res.map(function (p) { return createResult(p.p1, p.p2); });
    };
    QueryResult.prototype.OuterJoin = function (rightSet, onPredicate) {
        var res = [];
        for (var _i = 0, _a = this.res; _i < _a.length; _i++) {
            var p12 = _a[_i];
            var p1 = !!p12 ? p12.p1 : null;
            var p2 = !!p12 ? p12.p2 : null;
            var p1Matched = false;
            for (var _b = 0, rightSet_1 = rightSet; _b < rightSet_1.length; _b++) {
                var right = rightSet_1[_b];
                var pred = false;
                try {
                    pred = onPredicate(p1, p2, right);
                }
                catch (err) {
                }
                if (pred) {
                    res.push({ p1: p1, p2: p2, p3: right });
                    p1Matched = true;
                }
            }
            if (!p1Matched)
                res.push({ p1: p1, p2: p2, p3: null });
        }
        for (var _c = 0, rightSet_2 = rightSet; _c < rightSet_2.length; _c++) {
            var right = rightSet_2[_c];
            if (!res.some(function (r) { return r.p3 == right; }))
                res.push({ p1: null, p2: null, p3: right });
        }
        return new QueryResult3(res);
    };
    return QueryResult;
}());
var QueryResult3 = (function () {
    function QueryResult3(res) {
        this.res = res;
    }
    QueryResult3.prototype.Select = function (createResult) {
        return this.res.map(function (p) { return createResult(p.p1, p.p2, p.p3); });
    };
    return QueryResult3;
}());
//# sourceMappingURL=authenticationconfig.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var login2_1 = __webpack_require__(0);
var THybridLoginBuilder = (function () {
    function THybridLoginBuilder(_loginManager, _tokenManager, flow) {
        this._loginManager = _loginManager;
        this._tokenManager = _tokenManager;
        this.flow = flow;
    }
    THybridLoginBuilder.prototype.withOptions = function (options) {
        var _this = this;
        return new HybridLoginBuilder(this._loginManager, this._tokenManager, function (log) { return new _this.flow(options, log); });
    };
    return THybridLoginBuilder;
}());
exports.THybridLoginBuilder = THybridLoginBuilder;
var HybridLoginBuilder = (function () {
    function HybridLoginBuilder(_loginManager, _tokenManager, flow) {
        this._loginManager = _loginManager;
        this._tokenManager = _tokenManager;
        this.flow = flow;
        this.requestAccessToken = null;
        //providesTokens: IToken[] = [];
        this.requestRefreshToken = false;
    }
    //public providesToken(token: IToken): HybridLoginBuilder
    //{
    //    this.providesTokens.push(token);
    //    return this;
    //}
    //public implicitToken(token: IToken): HybridLoginBuilder
    //{
    //    if (!token)
    //    {
    //        this.requestAccessToken = null;
    //        return;
    //    }
    //    if (!!this.requestAccessToken)
    //        throw new Error("only one implict token");
    //    this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };
    //    return this;
    //}
    HybridLoginBuilder.prototype.idToken = function () {
        var idScopes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            idScopes[_i] = arguments[_i];
        }
        return this;
    };
    HybridLoginBuilder.prototype.accessToken = function (token) {
        if (!!this.requestAccessToken)
            throw new Error("only one default access token");
        this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };
        return this;
    };
    HybridLoginBuilder.prototype.refreshToken = function (val) {
        this.requestRefreshToken = val;
        return this;
    };
    HybridLoginBuilder.prototype.registerAs = function (name) {
        var login = this._loginManager
            .createHybridLogin(name, this.flow, this.idScopes, this.requestAccessToken, this.requestRefreshToken);
        var provider = {
            providerId: login.name,
            provideTokenValue: function (res, scp, success, error) { success(login.implicitTokenValue); },
            loggedIn: login.loggedIn,
            loggingOut: login.loggingOut
        };
        var defaultAccessToken = this._tokenManager.registerToken(name, this.requestAccessToken.resource, this.requestAccessToken.scopes); //, provider);
        if (!!this.requestAccessToken)
            this._tokenManager.registerProvider(this.requestAccessToken.name, provider);
        //for (var token of this.providesTokens)
        //{
        //    this._tokenManager.registerProvider(token.tokenName, provider);
        //}
        //return new Login2(login, defaultAccessToken, this._tokenManager);
        return new login2_1.Login2(login, this._tokenManager);
    };
    return HybridLoginBuilder;
}());
exports.HybridLoginBuilder = HybridLoginBuilder;
//# sourceMappingURL=hybridloginbuilder.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var login2_1 = __webpack_require__(0);
var TImplicitLoginBuilder = (function () {
    function TImplicitLoginBuilder(_loginManager, _tokenManager, flow) {
        this._loginManager = _loginManager;
        this._tokenManager = _tokenManager;
        this.flow = flow;
    }
    TImplicitLoginBuilder.prototype.withOptions = function (options) {
        var _this = this;
        return new ImplicitLoginBuilder(this._loginManager, this._tokenManager, function (log) { return new _this.flow(options, log); });
    };
    return TImplicitLoginBuilder;
}());
exports.TImplicitLoginBuilder = TImplicitLoginBuilder;
var ImplicitLoginBuilder = (function () {
    function ImplicitLoginBuilder(_loginManager, _tokenManager, flow) {
        this._loginManager = _loginManager;
        this._tokenManager = _tokenManager;
        this.flow = flow;
        this.requestAccessToken = null;
        this.requestRefreshToken = false;
    }
    ImplicitLoginBuilder.prototype.idToken = function () {
        var idScopes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            idScopes[_i] = arguments[_i];
        }
        return this;
    };
    ImplicitLoginBuilder.prototype.accessToken = function (token) {
        if (!token) {
            this.requestAccessToken = null;
            return;
        }
        if (!!this.requestAccessToken)
            throw new Error("only one implict token");
        this.requestAccessToken = { name: token.tokenName, resource: token.resource, scopes: token.scopes };
        return this;
    };
    ImplicitLoginBuilder.prototype.registerAs = function (name) {
        var _this = this;
        var login = this._loginManager
            .createImplicitLogin(name, function (log) { return _this.flow(log); }, this.idScopes, this.requestAccessToken);
        return new login2_1.Login2(login, this._tokenManager);
    };
    return ImplicitLoginBuilder;
}());
exports.ImplicitLoginBuilder = ImplicitLoginBuilder;
//# sourceMappingURL=implicitloginbuilder.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TokenBuilder = (function () {
    function TokenBuilder(_tokenManager, 
        //private readonly _apiManager: IApiManager,
        resource, scopes, _log) {
        this._tokenManager = _tokenManager;
        this.resource = resource;
        this.scopes = scopes;
        this._log = _log;
    }
    //private provider: ITokenProvider = null;
    //public providedBy(login: IAuthCodeLogin): TokenBuilder
    //{
    //    if (!!this.provider)
    //    {
    //        throw new Error("Token can only have one provider");
    //    }
    //    this.provider =
    //        {
    //            providerId: login.name,
    //            provideTokenValue: login.acquireAccessToken,
    //            loggedIn: login.loggedIn,
    //            loggingOut: login.loggingOut
    //        };
    //    return this;
    //}
    //private _requiredBy: string[] = [];
    //public requiredBy(url: string): TokenBuilder
    //{
    //    this._requiredBy.push(url);
    //    return this;
    //}
    TokenBuilder.prototype.registerAs = function (name) {
        //if (!this.provider)
        //{
        //    throw new Error("Token must have a provider");
        //}
        //for (var url of this._requiredBy)
        //{
        //    this._apiManager.registerApi(url, name);
        //}
        return this._tokenManager.registerToken(name, this.resource, this.scopes); //, this.provider);
    };
    return TokenBuilder;
}());
exports.TokenBuilder = TokenBuilder;
//# sourceMappingURL=tokenbuilder.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var superdup_auth_log_1 = __webpack_require__(2);
exports.ConsoleLog = superdup_auth_log_1.ConsoleLog;
var authenticationmanager_1 = __webpack_require__(4);
exports.createAuthenticationManager = authenticationmanager_1.createAuthenticationManager;
var utils_1 = __webpack_require__(1);
exports.urlparse = utils_1.urlparse;
//# sourceMappingURL=index.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var AsciiTable = (function () {
    function AsciiTable() {
        var colWidths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colWidths[_i] = arguments[_i];
        }
        this.res = "";
        this.nextCol = 0;
        this.colWidths = colWidths;
    }
    AsciiTable.prototype._AddCell = function (text, colspan, cellPrefix) {
        if (!text)
            text = "-";
        var cols = this.colWidths.slice(this.nextCol, this.nextCol + colspan);
        //var space = cols.reduce((prev, curr, idx, all) => prev + curr, 0);
        var space = this.nChars(this.nextCol, colspan);
        if (space <= 0)
            return;
        if (space > text.length) {
            var extra = space - text.length;
            var before = Math.floor(extra / 2);
            var after = extra - before;
            text = AsciiTable.SPACES.substr(0, before) + text + AsciiTable.SPACES.substr(0, after);
        }
        if (space < text.length) {
            text = text.substr(0, space - 2) + "..";
        }
        this.res += cellPrefix;
        this.res += text;
        this.nextCol += colspan;
    };
    AsciiTable.prototype.AddCell = function (text, colspan) {
        if (!colspan)
            colspan = 1;
        this._AddCell(text, colspan, " | ");
        return this;
    };
    AsciiTable.prototype._Newline = function (lineEnd) {
        this.res += lineEnd + "\n";
        this.nextCol = 0;
    };
    AsciiTable.prototype.Newline = function () {
        this._Newline(" |");
        return this;
    };
    AsciiTable.prototype.nChars = function (startCol, colNo) {
        if (colNo <= 0)
            return 0;
        var cols = this.colWidths.slice(this.nextCol, this.nextCol + colNo);
        var colspace = cols.reduce(function (prev, curr, idx, all) { return prev + curr; });
        var res = colspace + (colNo - 1) * 3;
        return res;
    };
    AsciiTable.prototype.Separator = function () {
        var colspans = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            colspans[_i] = arguments[_i];
        }
        if (this.nextCol > 0)
            this.Newline();
        for (var _a = 0, colspans_1 = colspans; _a < colspans_1.length; _a++) {
            var colspan = colspans_1[_a];
            var width = this.nChars(this.nextCol, colspan);
            this._AddCell(AsciiTable.HYPHENS.substr(0, width), colspan, "-+-");
        }
        this._Newline("-+");
        return this;
    };
    AsciiTable.prototype.toString = function () {
        return this.res;
    };
    return AsciiTable;
}());
AsciiTable.SPACES = "                                                                                              " +
    "                                                                                              ";
AsciiTable.HYPHENS = "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------" +
    "----------------------------------------------------------------------------------------------";
exports.AsciiTable = AsciiTable;
//# sourceMappingURL=asciitable.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var urlutils = __webpack_require__(3);
var jwtdecode = __webpack_require__(20);
function parseRedirectUrl(redirectUrl) {
    if (!redirectUrl)
        return null;
    var result = {};
    var urlParts = urlutils.urlparse(redirectUrl);
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
/* 18 */
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__(18);

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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__(19);

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ })
/******/ ]);