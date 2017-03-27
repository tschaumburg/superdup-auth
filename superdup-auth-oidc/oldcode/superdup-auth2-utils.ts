///<reference types='jsonwebtoken'/>

//declare function decode(token: string, options?: /*DecodeOptions*/{}): any;
//import jwt from 'jsonwebtoken';

//var jwtLib = require('jsonwebtoken');
//declare namespace jwtLib
//{
//    export interface DecodeOptions
//    {
//        complete?: boolean;
//        json?: boolean;
//    }
//    function decode(token: string, options?: DecodeOptions): any;
//}

namespace superdup.auth2
{
    //export interface SuperdupAuthState
    //{
    //    public mod: string;
    //    public idp: string;
    //    public at: string;
    //    public uss: any;
    //}

    export interface UrlParts
    {
        protocol?: string;
        host?: string;
        port?: string;
        path?: string;
        query?: string;
        fragment?: string;
    }

    export class utils
    {
        public static getExpiration(jwtToken: string): number
        {
            return 0;//jsonwebtoken.decode(jwtToken).exp;
        }

        public static isExpired(expiration: number): boolean
        {
            return (expiration < Date.now() / 1000);
        }

        public static sdpReadHashFragmentState(url: string): {}
        {
            if (!url)
                return null;

            var hashFragment = utils.parseUrl(url)['fragment'];
            if (!hashFragment)
                return null;

            var params = hashFragment.split('&');
            for (var n = 0; n < params.length; n++)
            {
                var kvp = params[n].split('=');
                if (kvp.length != 2)
                    continue;

                if ("state" === kvp[0].trim())
                    return utils.decodeHashValue(kvp[1]);
            }

            return null;
        }

        public static encodeHashValue(authModule: string, identityProvider: string, accessTokenName: string, userSuppliedState: string): string
        {
            var state: {} = { mod: authModule, idp: identityProvider, at: accessTokenName, uss: userSuppliedState };
            return JSON.stringify(state);
        }

        public static decodeHashValue(encodedState: string): {}
        {
            if (!encodedState)
                return null;

            try
            {
                return JSON.parse(decodeURIComponent(encodedState)) as {};
            }
            catch (err)
            {
                return null;
            }
        }

        // Copyright(c) 2015, Andreas F.Hoffmann
        // All rights reserved.
        // Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
        // 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        // 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/ or other materials provided with the distribution.
        // 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
        //THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        public static parseUrl(url: string): UrlParts
        {
            var match = url.match(/^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i);
            var ret: UrlParts = {};

            ret.protocol = '';
            ret.host = match[2];
            ret.port = '';
            ret.path = '';
            ret.query = '';
            ret.fragment = '';

            if (match[1])
            {
                ret.protocol = match[1];
            }

            if (match[3])
            {
                ret.port = match[3];
            }

            if (match[4])
            {
                ret.path = match[4];
            }

            if (match[5])
            {
                ret.query = match[5];
            }

            if (match[6])
            {
                ret.fragment = match[6];
            }

            return ret;
        }
    }

    export function getUrlParameterValue(url: string, parameterName: string): string
    {
        if (!!url)
            return null;

        var _url: URL;
        try
        {
            _url = new URL(url);
        }
        catch (e)
        {
            return null;
        }

        var query = _url.search;
        if (!!query)
            return null;

        var params = query.substring(1).split('&');
        for (var n = 0; n < params.length; n++)
        {
            var kvp = params[n].split('=');
            if (kvp.length != 2)
                continue;

            if (parameterName === kvp[0].trim())
                return decodeURIComponent(kvp[1]).trim();
        }

        return null;
    }

    export class AuthUtils
    {
        public static protectStates(
            $q: ng.IQService,
            $transitions: any,
            statepattern: string,
            refusedState: string,
            isUser: (users: string[]) => ng.IPromise<boolean>,
            isRole: (roles: string[]) => ng.IPromise<boolean>
        ): void
        {
            $transitions.onBefore(
                {
                    to: '*',
                    from: '*'
                },
                //['$state', '$transition$',
                function ($transition$: any, $state: any)
                    {
                        if (!$transition$)
                            return;

                        if ($transition$.$to().name === refusedState)
                            return;

                        if ($transition$.$to().data)
                        {
                            if ($transition$.$to().data.allowAnonymous)
                                return;

                            var deferred = $q.defer();
                            var promises: ng.IPromise<boolean>[] = [];

                            if ($transition$.$to().data.allowUsers)
                            {
                                var allowedUsers = $transition$.$to().data.allowUsers as string[];
                                promises.push(isUser(allowedUsers));
                            }

                            if ($transition$.$to().data.allowRoles)
                            {
                                var allowedRoles = $transition$.$to().data.allowRoles as string[];
                                promises.push(isRole(allowedRoles));
                            }

                            $q.all(promises).then(
                                (permissions: boolean[]) =>
                                {
                                    if (permissions.some((value, index, array) => value))
                                    {
                                        deferred.resolve();
                                    }
                                    else
                                    {
                                        var params =
                                            {
                                                protectedState: $transition$.$to().name,
                                                protectedStateParams: "x" //toStateParams
                                            };

                                        deferred.resolve($transition$.router.stateService.target(refusedState, params));
                                    }
                                }
                            ).catch(
                                (reason) =>
                                {
                                    deferred.reject(reason);
                                }
                            );

                            return deferred.promise;
                        }
                    }
                //]
            );
        }
    }
}
