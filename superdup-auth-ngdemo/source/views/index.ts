import lp = require("./landingpage");
import angular = require("angular");

angular
    .module('superdup.auth.ngdemo')
    .controller('LandingPageController', ["$scope", "superdupAuthService", require("./landingpage")])
    .controller('AdminPageController', ["$scope", require("./adminpage")])
    .controller('UserPageController', ["$scope", require("./userpage")]);
