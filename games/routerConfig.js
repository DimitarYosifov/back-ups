
(function () {
    let app = angular.module('app')

            .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
//                $locationProvider.html5Mode(true);
                
                
                
                document.addEventListener('mousedown)', function (e) {
                        alert()
                        var keyCode = e.which;
                        console.log(e, keyCode, e.which)
                        if (keyCode == 88) {
//                            console.log("You pressed W!");
                            //alert("You pressed W!");
                        }
                    });
                
                
                $urlRouterProvider.otherwise('game1');







//                var abstract = {
//                    abstract:true,
//                    name: 'abstract',
//                    url: '',
//                    templateUrl: 'views/game1.html'
//                }


                var game1 = {
                    name: 'game1',
                    url: '/game1',
                    controller: 'Game1Controller',
                    templateUrl: 'views/game1.html'
                };
                var game2 = { 
                    name: 'game2',
                    url: '/game2',
                    controller: 'Game2Controller',
                    templateUrl: 'views/game2.html'
                };
                var game3 = {
                    name: 'game3',
                    url: '/game3',
                    controller: 'Game3Controller',
                    templateUrl: 'views/game3.html'
                };
                var game4 = {
                    name: 'game4',
                    url: '/game4',
                    controller: 'Game4Controller',
//                    templateUrl: 'views/game4.html'
                };
                var game5 = {
                    name: 'game5',
                    url: '/game5',
                    controller: 'Game5Controller',
//                    templateUrl: 'views/game5.html'
                };

                $stateProvider.state(game1);
                $stateProvider.state(game2);
                $stateProvider.state(game3);
                $stateProvider.state(game4);
                $stateProvider.state(game5);














//                $stateProvider
//                        .state('hello', {
//                            url: 'hello',
//                            views: {
//                                content: {
//                                    templateUrl: 'views/newGameReward.html',
//                                    controller: 'NewGameRewardController'
//                                },
//                                sidebar: {
//                                    templateUrl: 'views/sidebar.html'
//                                },
//                                header: {
//                                    templateUrl: 'views/header.html'
//                                }
//                            },
//                            data: {
//                                pageTitle: ''
//                            }
//                        })
//                        .state('games.editGameReward', {
//                            url: '/:id/rewards/:gameRewardId',
//                            views: {
//                                content: {
//                                    templateUrl: 'views/editGameReward.html',
//                                    controller: 'EditGameRewardController'
//                                },
//                                sidebar: {
//                                    templateUrl: 'views/sidebar.html'
//                                },
//                                header: {
//                                    templateUrl: 'views/header.html'
//                                }
//                            },
//                            data: {
//                                pageTitle: ''
//                            }
//                        });

            })
//            .config(['$httpProvider', function ($httpProvider) {
//                    //Reset headers to avoid OPTIONS request (aka preflight)
//                    $httpProvider.defaults.headers.common = {};
//                    $httpProvider.defaults.headers.post = {};
//                    $httpProvider.defaults.headers.put = {};
//                    $httpProvider.defaults.headers.patch = {};
//                }]);
})();