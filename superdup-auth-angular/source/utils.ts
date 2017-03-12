////import jwt = require('jsonwebtoken.decode');
import ng = require("angular");

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

                    if (!$transition$.$to())
                        return;

                    if ($transition$.$to().name === refusedState)
                        return;

                    if (!$transition$.$to().data)
                        return;

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
            );
        }
    }
