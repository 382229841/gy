app.controller('navbarController', function ($rootScope, $scope, analytics, $location, $window) {
    $scope.back = function () {
        history.back();
    }
});
