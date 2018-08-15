(function () {
    let app = angular.module('app')
            .directive('navigation', function ($state, $filter, $timeout, $interval) {
                return {
                    restrict: 'E',
                    templateUrl: 'views/navigation.html',
                    scope: {

                    },
                    controller: function ($scope, $rootScope) {
                        $scope.gameChanged = function (game) {
                            $rootScope.$broadcast('gameChanged', {game: game});
                        };
                    }
                };
            });
})();