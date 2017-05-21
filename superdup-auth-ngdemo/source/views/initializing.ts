class InitializingController
{
    public constructor(
        private $scope: any
    )
    {
        $scope.ctrl = this;
    }
}

module.exports = InitializingController;