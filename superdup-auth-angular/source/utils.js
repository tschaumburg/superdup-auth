//import jwt = require('jsonwebtoken.decode');
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
            if ($transition$.$to().name === refusedState)
                return;
            if ($transition$.$to().data) {
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
            }
        });
    };
    return AuthUtils;
}());
exports.AuthUtils = AuthUtils;
