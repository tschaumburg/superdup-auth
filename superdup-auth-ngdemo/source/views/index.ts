import angular = require("angular");

angular
    .module('superdup.auth.ngdemo')
    .controller('InitializingController', ["$scope", require("./initializing")])
    .controller('LoginController', ["$scope", "$state", "superdupAuthService", require("./login")])
    .controller('ErrorController', ["$scope", require("./error")])
    .controller('UserPageController', ["$scope", "superdupAuthService", require("./userpage")]);
