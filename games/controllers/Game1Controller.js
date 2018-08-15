
(function () {
    let app = angular.module('app')
            .controller('Game1Controller', function ($scope, $http, $window, $state, $timeout, $stateParams, $interval) {
                $scope.gameName = 'Game 1';
                $scope.gameSettings =
                        {
                            level: {
                                options: [1, 2, 3, 4, 5],
                                name: 'level',
                                value: '1'
                            },
                            enemy: {
                                options: ['box', 'rocket'],
                                name: 'enemy',
                                value: 'box'
                            },
                            health: {
                                options: [1, 2, 3, 4, 5],
                                name: 'health',
                                value: '1'
                            }
                        };

                $scope.score = 0;
                $scope.pause = true;
                $scope.enemy = 'images/box.png';
                let renderer = PIXI.autoDetectRenderer(400, 400, {
                    transparent: true,
                    resolution: 1,
                    forceCanvas: true
                });
                $timeout(function () {
                    $scope.gameWindow = document.getElementById('game-container');
                    $scope.gameWindow.appendChild(renderer.view);
                    $scope.stage = new PIXI.Container();
                    PIXI.loader.reset()
                    $scope.loader = PIXI.loader;
                    $scope.loader.add('images/heart.png');
                    $scope.addScore();
                    $scope.loader.load($scope.setup);
                }, 100);
                $scope.setup = function () {
                    $window.addEventListener('resize', function () {
                        $scope.resized();
                    });
                    $scope.resized();
                    renderer.render($scope.stage);
                };
                $scope.addScore = function () {
                    $scope.displayScore = new PIXI.Text(
                            "Score " + $scope.score,
                            {fontFamily: "Arial", fontSize: 25}
                    );
                    $scope.displayScore.position.set(275, 10);
                    $scope.displayScore.style.fill = ['orange'];
                    $scope.displayScore.style.fontWeight = '900';
                    $scope.stage.addChild($scope.displayScore);
                };
                $scope.resized = function () {
                    $scope.gameWindow.style.height = $scope.gameWindow.offsetWidth * 0.62;
                    $scope.height = $scope.gameWindow.offsetHeight;
                    $scope.width = $scope.gameWindow.offsetWidth;
                };
                $scope.addHealth = function () {
                    $scope.heart1 = PIXI.Sprite.fromImage('images/heart.png');
                    $scope.heart1.x = 0;
                    $scope.heart1.y = 10;
                    $scope.heart1.scale.x = 0.1;
                    $scope.heart1.scale.y = 0.1;
                    $scope.stage.addChild($scope.heart1);
                    if ($scope.health == 1)
                        return;
                    $scope.heart2 = PIXI.Sprite.fromImage('images/heart.png');
                    $scope.heart2.x = 30;
                    $scope.heart2.y = 10;
                    $scope.heart2.scale.x = 0.1;
                    $scope.heart2.scale.y = 0.1;
                    $scope.stage.addChild($scope.heart2);
                    if ($scope.health == 2)
                        return;
                    $scope.heart3 = PIXI.Sprite.fromImage('images/heart.png');
                    $scope.heart3.x = 60;
                    $scope.heart3.y = 10;
                    $scope.heart3.scale.x = 0.1;
                    $scope.heart3.scale.y = 0.1;
                    $scope.stage.addChild($scope.heart3);
                    if ($scope.health == 3)
                        return;
                    $scope.heart4 = PIXI.Sprite.fromImage('images/heart.png');
                    $scope.heart4.x = 90;
                    $scope.heart4.y = 10;
                    $scope.heart4.scale.x = 0.1;
                    $scope.heart4.scale.y = 0.1;
                    $scope.stage.addChild($scope.heart4);
                    if ($scope.health == 4)
                        return;
                    $scope.heart5 = PIXI.Sprite.fromImage('images/heart.png');
                    $scope.heart5.x = 120;
                    $scope.heart5.y = 10;
                    $scope.heart5.scale.x = 0.1;
                    $scope.heart5.scale.y = 0.1;
                    $scope.stage.addChild($scope.heart5);
                };
                $scope.startInterval = function () {
                    $scope.inter = $interval(function () {
                        if (Math.floor(Math.random() * 10) + 1 === 1) {
                            let sprite = PIXI.Sprite.fromImage('images/heart.png');
                            sprite.direction = $scope.setDirection();
                            sprite.heart = true
                            sprite.scale.x = 0.1;
                            sprite.scale.y = 0.1;
                            sprite.x = 100;
                            sprite.y = 100;
                            sprite.interactive = true;
                            sprite.buttonMode = true;
                            TweenMax.to(sprite, 0.3, {scaleX: 0.12, scaleY: 0.12}).yoyo(true).repeat(-1);
                            sprite.on('click', function (e, y) {
                                $scope.stage.removeChild(sprite);
                                if ($scope.health !== 5) {
                                    $scope.health++;
                                }
                                $scope.clearHealth();
                            });
                            sprite.on('touchstart', function (e, y) {
                                $scope.stage.removeChild(sprite);
                                if ($scope.health !== 5) {
                                    $scope.health++;
                                }
                                $scope.clearHealth();
                            });
                            $scope.stage.addChild(sprite);
                        } else {
                            let sprite = PIXI.Sprite.fromImage('images/' + $scope.gameSettings.enemy.value + '.png');
                            sprite.direction = $scope.setDirection();
                            sprite.rotation = $scope.setRotation(sprite.direction);
                            sprite.scale.x = 0.3;
                            sprite.scale.y = 0.3;
                            sprite.x = 100;
                            sprite.y = 100;
                            sprite.interactive = true;
                            sprite.buttonMode = true;
                            sprite.on('click', function (e, y) {
                                $scope.stage.removeChild(sprite);
                                $scope.score++;
                                if ($scope.score % 10 === 0) {
                                    $scope.level++;
                                }
                                $scope.displayScore.text = "Score " + $scope.score;
                            });
                            sprite.on('touchstart', function (e, y) {
                                $scope.stage.removeChild(sprite);
                                $scope.score++;
                                if ($scope.score % 10 === 0) {
                                    $scope.level++;
                                }
                                $scope.displayScore.text = "Score " + $scope.score;
                            });
                            $scope.stage.addChild(sprite);
                        }

                    }, 1500);
                };
                $scope.setDirection = function () {
                    switch (Math.floor(Math.random() * 4) + 1) {
                        case 1:
                            return 'up';
                        case 2:
                            return'down';
                        case 3:
                            return 'right';
                        case 4:
                            return 'left';
                    }

                };
                $scope.setRotation = function (direction) {
                    switch (direction) {
                        case 'up':
                            return 0;
                        case 'down':
                            return 3;
                        case 'right':
                            return 1.5;
                        case 'left':
                            return -1.5;
                    }
                };
                $scope.clearHealth = function () {
                    $scope.stage.removeChild($scope.heart1);
                    $scope.stage.removeChild($scope.heart2);
                    $scope.stage.removeChild($scope.heart3);
                    $scope.stage.removeChild($scope.heart4);
                    $scope.stage.removeChild($scope.heart5);
                    $scope.addHealth();
                };
                $scope.time = 0;
                $scope.$on('gameChanged', function (e, games) {
                    if (games.game !== 'game1') {
                        $scope.pause = true;
                    }
                });
                function animationLoop(delta) {
                    if (delta - $scope.time > 1000) {
                        $scope.time = delta;
                        $scope.pulse = true;
                    }
                    for (let i = 0; i < $scope.stage.children.length; i++) {
                        if (!$scope.stage.children[i].direction) {
                            continue;
                        }
                        let direction = $scope.stage.children[i].direction;
                        switch (direction) {
                            case 'right':
                                $scope.stage.children[i].x += Number($scope.level);
                                break;
                            case 'left':
                                $scope.stage.children[i].x -= Number($scope.level);
                                break;
                            case 'up':
                                $scope.stage.children[i].y -= Number($scope.level);
                                break;
                            case 'down':
                                $scope.stage.children[i].y += Number($scope.level);
                                break;
                        }
                        if ($scope.stage.children[i] && $scope.stage.children[i].x > $scope.width ||
                                $scope.stage.children[i].x < 0 - $scope.stage.children[i].width ||
                                $scope.stage.children[i].y > $scope.height ||
                                $scope.stage.children[i].y < 0 - $scope.stage.children[i].height
                                ) {
                            if ($scope.stage.children[i].heart) {
                                $scope.stage.removeChild($scope.stage.children[i]);
                                continue;
                            }
                            $scope.stage.removeChild($scope.stage.children[i]);
                            $scope.health == 5 ? $scope.stage.removeChild($scope.heart5) :
                                    $scope.health == 4 ? $scope.stage.removeChild($scope.heart4) :
                                    $scope.health == 3 ? $scope.stage.removeChild($scope.heart3) :
                                    $scope.health == 2 ? $scope.stage.removeChild($scope.heart2) :
                                    $scope.stage.removeChild($scope.heart1)
                            $scope.health--;
                            if ($scope.health === 0) {
                                $scope.over = new PIXI.Text(
                                        "Game Over ",
                                        {fontFamily: "Arial", fontSize: 35}
                                );
                                $scope.over.position.set(90, 200);
                                $scope.over.style.fill = ['red'];
                                $scope.over.style.fontWeight = '900';
                                $scope.stage.addChild($scope.over);
                                $interval.cancel($scope.inter);
                                for (let i = 0; i < $scope.stage.children.length; i++) {
                                    if ($scope.stage.children[i].direction) {
                                        $scope.stage.removeChild($scope.stage.children[i]);
                                    }
                                }
                                $timeout(function () {
                                    $scope.pause = true;
                                }, 500);
                            }
                            i--;
                        }
                    }
                    if ($scope.pause) {
                        return;
                    }
                    renderer.render($scope.stage);
                    requestAnimationFrame(animationLoop);
                }
                $scope.startGame = function () {
                    $scope.health = $scope.gameSettings.health.value;
                    $scope.addHealth();
                    $scope.score = 0;
                    $scope.start = true;
                    $scope.displayScore.text = "Score " + $scope.score;
                    $scope.level = $scope.gameSettings.level.value;
                    $scope.stage.removeChild($scope.over);
                    $scope.pause = false;
                    $timeout(function () {
                        $window.dispatchEvent(new Event("resize"));
                    }, 0);
                    $scope.startInterval();
                    animationLoop();
                };
            });
})();







