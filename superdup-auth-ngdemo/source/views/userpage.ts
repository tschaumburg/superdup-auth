class UserPageController
{
    public constructor(
        private $scope: any
    )
    {
        $scope.ctrl = this;
    }
}

module.exports = UserPageController;