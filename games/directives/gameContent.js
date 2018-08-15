(function () {
    let app = angular.module('app')
            .directive('gameContent', function ($state, $filter, $timeout, $interval, $document) {
                return {
                    restrict: 'EA',
                    templateUrl: 'views/gameContent.html',
                    scope: {
                        gameName: '=',
                        gameSettings: '=',
                        level: '=',
                        pause: '=',
                        start: '=',
                        test: "&"

                    },
                    controller: function ($scope, $rootScope) {




                    }
                };
            });
})();