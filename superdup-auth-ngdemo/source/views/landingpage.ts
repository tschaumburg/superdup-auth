import auth = require("superdup-auth-angular");
import jwtdecode = require("jwt-decode");

class LandingPageController
{
    public tokens: { tokenName: string, tokenValue: {} }[] = [];
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
            .login2("newauth0", "localSuperdupApi", "/landingpage" )
            .then(
                () =>
                {
                    this.updateTokens();
                }
            );
    }

    public logout(): void
    {
        this.authService.logout2("newauth0");
        this.updateTokens();
    }

    public isLoggedIn(): boolean
    {
        if (!this.authService)
            return false;

        if (!this.authService.user)
            return false;

        return true;
    }

    private updateTokens(): void
    {
        this.tokens = [];
        var encoded = this.authService.getAccessTokens();
        for (var enc of encoded)
        {
            if (!enc.tokenValue)
                continue;

            var decoded = { tokenName: enc.tokenName, tokenValue: jwtdecode(enc.tokenValue) };
            console.log("   ..." + decoded.tokenName + " => " + JSON.stringify(decoded.tokenValue));
            this.tokens.push(decoded);
        }
    }
}

module.exports = LandingPageController;