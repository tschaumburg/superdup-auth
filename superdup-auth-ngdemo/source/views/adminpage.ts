import auth = require("superdup-auth-angular");

class AdminPageController
{
    public constructor(
        private $scope: any
    )
    {
        $scope.ctrl = this;
    }
}

module.exports = AdminPageController;