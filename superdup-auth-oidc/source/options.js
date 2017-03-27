"use strict";
var LoginMechanism;
(function (LoginMechanism) {
    LoginMechanism[LoginMechanism["popup"] = 0] = "popup";
    LoginMechanism[LoginMechanism["redirect"] = 1] = "redirect";
    LoginMechanism[LoginMechanism["iframe"] = 2] = "iframe";
})(LoginMechanism = exports.LoginMechanism || (exports.LoginMechanism = {}));
var OidcOptions = (function () {
    function OidcOptions() {
    }
    return OidcOptions;
}());
exports.OidcOptions = OidcOptions;
//# sourceMappingURL=options.js.map