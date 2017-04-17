import authcore = require("superdup-auth-core");
import auth = require("superdup-auth-angular");
import jwtdecode = require("jwt-decode");

class LandingPageController
{
    public tokens: { tokenName: string, tokenValue: {} }[] = [];
    public user: authcore.UserInfo;
    public constructor(
        private $scope: any,
        private authService: auth.IAuthService
    )
    {
        $scope.ctrl = this;
        $scope.auth = authService;

        this.updateTokens();
    }

    public login()
    {
        var self = this;
        this.authService
            .getLogin("newauth0")
            .login(
                //"localSuperdupApi",
                "/landingpage",
                () => 
                {
                    this.updateTokens();
                },
                () =>
                {
                },
                (reason) =>
                {
                }
            );
            //.login("newauth0", "localSuperdupApi", "/landingpage" )
            //.then(
            //    () =>
            //    {
            //        this.updateTokens();
            //    }
            //);
    }

    public logout(): void
    {
        this.authService.logout("newauth0");
        this.updateTokens();
    }

    public isLoggedIn(): boolean
    {
        if (!this.authService)
            return false;

        if (!this.authService.getLogin("newauth0"))
            return false;

        if (!this.authService.getLogin("newauth0").user)
            return false;

        return true;
    }

    private updateTokens(): void
    {
        this.user = this.authService.getLogin("newauth0").user;
        this.tokens = [];

        var names = this.authService.getLogin("newauth0").getTokenNames();
        for (var name of names)
        {
            var value = this.authService.getLogin("newauth0").getTokenValue(name);
            if (!value)
                continue;

            var decoded = { tokenName: name, tokenValue: jwtdecode(value) };
            this.tokens.push(decoded);
        }
    }
}

module.exports = LandingPageController;