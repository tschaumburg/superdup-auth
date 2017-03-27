import auth = require("superdup-auth-angular");

class LandingPageController
{
    public constructor(
        private $scope: any,
        private authService: auth.IAuthService
    )
    {
        $scope.ctrl = this;
        $scope.auth = authService;
    }

    public login()
    {
        var self = this;
        this.authService
            .login({ uistate: "/landingpage" })
            .then(
            () =>
            {
                //self.$scope.$apply(() => { });
            }
            );
    }

    public logout(): void
    {
        this.authService.logout();
    }

    public isLoggedIn(): boolean
    {
        if (!this.authService)
            return false;

        if (!this.authService.user)
            return false;

        return true;
    }
}

module.exports = LandingPageController;