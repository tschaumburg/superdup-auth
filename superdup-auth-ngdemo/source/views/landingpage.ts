import authcore = require("superdup-auth-core");
import auth = require("superdup-auth-angular");
import jwtdecode = require("jwt-decode");

class LandingPageController
{
    private newauth0: authcore.ILogin2;
    public tokens: { tokenName: string, tokenValue: {} }[] = [];
    public user: authcore.UserInfo;
    public constructor(
        private $scope: any,
        private authService: auth.IAuthService
    )
    {
        $scope.ctrl = this;
        $scope.auth = authService;

        this.newauth0 = this.authService.getLogin("newauth0");
        this.updateTokens();
    }

    public login()
    {
        var self = this;
        this.newauth0
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
        this.newauth0.logout();
        this.updateTokens();
    }

    public isLoggedIn(): boolean
    {
        if (!this.authService)
            return false;

        if (!this.newauth0)
            return false;

        if (!this.newauth0.user)
            return false;

        return true;
    }

    private updateTokens(): void
    {
        this.user = this.newauth0.user;
        this.tokens = [];

        for (var token of this.newauth0.tokens)
        {
            var value = token.tokenValue;
            if (!value)
                continue;

            var decoded = { tokenName: token.tokenName, tokenValue: jwtdecode(value) };
            this.tokens.push(decoded);
        }
    }
}

module.exports = LandingPageController;