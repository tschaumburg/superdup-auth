class ErrorController
{
    public constructor(
        private $scope: any
    )
    {
        $scope.ctrl = this;
    }
}

module.exports = ErrorController;