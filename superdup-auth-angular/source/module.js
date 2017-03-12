"use strict";
var angular = require("angular");
var AuthServiceProvider = require("./serviceprovider");
angular.module("superdup.auth2", ['base64', 'angular-jwt', 'AdalAngular']);
angular.module('superdup.auth2')
    .provider('superdupAuth2Service', ['$injector', AuthServiceProvider]);
