
(function () {
    let app = angular.module('app')
            .controller('Game3Controller', function ($scope, $http, $window, $state, $timeout, $rootScope, $interval, $stateParams) {
                $scope.gameName = 'Game 3';
                $scope.pause = true;
                $scope.gameSettings =
                        {
                            mode: {
                                options: ['Standard', 'Extra figures', 'Colored'],
                                name: 'Mode',
                                value: 'Standard'
                            },
                            level: {
                                options: [1, 2, 3, 4, 5],
                                name: 'Level',
                                value: '1'
                            },
                            difficulty: {
                                options: ['easy', 'normal', 'hard'],
                                name: 'Difficulty',
                                value: 'easy'
                            }
                        };
                $scope.currentFigureType = {
                    type: '',
                    position: 0
                };
                let renderer = PIXI.autoDetectRenderer(400, 300, {
                    transparent: true,
                    resolution: 1,
                    forceCanvas: true
                });
                $scope.keyboard = {
                    left: false,
                    right: false,
                    up: false,
                    down: false
                };
                $timeout(function () {
                    $scope.gameWindow = document.getElementById('game-container');
                    $scope.gameWindow.appendChild(renderer.view);
                    $scope.stage = new PIXI.Container();
//                    $scope.nextFigureContainer = new PIXI.Container();
                    PIXI.loader.reset()
                    $scope.loader = PIXI.loader;
                    $scope.loader.add('images/heart.png');
                    $scope.loader.load($scope.setup);
                }, 100);
                $scope.setup = function () {
                    $window.addEventListener('resize', function () {
                        $scope.resized();
                    });
                    $scope.resized();
                    renderer.render($scope.stage);
                };
                $scope.resized = function () {
                    $scope.gameWindow.style.height = $scope.gameWindow.offsetWidth * 0.62;
                    $scope.height = $scope.gameWindow.offsetHeight;
                    $scope.width = $scope.gameWindow.offsetWidth;
                };
                $scope.$on('keyboardEvent', function (e, k) {
                    switch (k.keyPressed) {
                        case 37:
                            $scope.keyboard.left = true;
                            break;
                        case 38:
                            $scope.keyboard.rotate = true;
                            break;
                        case 39:
                            $scope.keyboard.right = true;
                            break;
                        case 40:
                            $scope.keyboard.down = true;
                            break;
                    }
                });



                $scope.clearAll = function () {
                    let color = '';
                    let iteration = 1;
                    for (let x in $scope.occupiedPositions) {
                        if ($scope.occupiedPositions[x] > 190) {
                            continue;
                        }
                        $scope.score += 4;
                        if ($scope.score >= $scope.nextLevel) {
                            $scope.increaseLevel();
                        }
                        $scope.scoreText.text = "Score:             " + $scope.score;
                        let inter = $interval(function () {
                            iteration % 2 === 0 ? color = '0xf2fe21' : color = '0xfcac1e';
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].clear();
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].lineStyle(1, 0x212529);
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].beginFill(0x868687);
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].drawRect(0, 0, 20, 20);

                            $scope.stage.children[$scope.occupiedPositions[x] - 40].clear();
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].lineStyle(1, 0x212529);
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].beginFill(color);
                            $scope.stage.children[$scope.occupiedPositions[x] - 40].drawRect(0, 0, 20, 20);
                            iteration++;
                            if (iteration > 10) {
                                $interval.cancel(inter);
                            }
                        }, 20);
                    }

                    $timeout(function () {
                        $scope.occupiedPositions = [191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
                    }, 450);
                };

                $scope.line = function (lines) {
                    for (let l = 0; l < lines.length; l++) {
                        let color = '';
                        let iteration = 1;
                        for (let r = 1; r <= 10; r++) {
                            $scope.occupiedPositions = $scope.occupiedPositions.filter(item => item !== lines[l] * 10 + r);
                            $scope.stage.children[lines[l] * 10 + r - 40].colored = 10;
                        }
                        $scope.occupiedPositions.sort();
                        $scope.occupiedPositions.reverse();
                        for (let x in $scope.occupiedPositions) {
                            if ($scope.occupiedPositions[x] <= lines[l] * 10) {
                                $scope.stage.children[  $scope.occupiedPositions[x] - 30].colored = $scope.stage.children[  $scope.occupiedPositions[x] - 40].colored;  //works
                                $scope.occupiedPositions[x] += 10;
                                $scope.stage.children[  $scope.occupiedPositions[x] - 40].colored = $scope.stage.children[  $scope.occupiedPositions[x] - 50].colored; //works
                            }
                        }
                        let inter = $interval(function () {
                            iteration % 2 === 0 ? color = '0xf2fe21' : color = '0xfcac1e';
                            for (let r = 1; r <= 10; r++) {
                                $scope.stage.children[lines[l] * 10 + r - 40].clear();
                                $scope.stage.children[lines[l] * 10 + r - 40].lineStyle(1, 0x212529);
                                $scope.stage.children[lines[l] * 10 + r - 40].beginFill(0x868687);
                                $scope.stage.children[lines[l] * 10 + r - 40].drawRect(0, 0, 20, 20);
                            }
                            for (let r = 1; r <= 10; r++) {
                                $scope.stage.children[lines[l] * 10 + r - 40].clear();
                                $scope.stage.children[lines[l] * 10 + r - 40].lineStyle(1, 0x212529);
                                $scope.stage.children[lines[l] * 10 + r - 40].beginFill(color);
                                $scope.stage.children[lines[l] * 10 + r - 40].drawRect(0, 0, 20, 20);
                            }
                            iteration++;
                            if (iteration > 10) {
                                $interval.cancel(inter);
                            }
                        }, 20);
                    }
                };

                $scope.checkNewPosition = function (newCoordinates) {
                    let occupied = $scope.occupiedPositions.some(x => newCoordinates.includes(x)); //false is available
                    function outsideGridLeft() {
                        if (newCoordinates.some(x => x % 10 === 0) && ($scope.currentFigure.blocks.some(x => x % 10 === 1) || $scope.currentFigure.blocks.some(x => x % 10 === 2))) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    function outsideGridRight() {
                        if (newCoordinates.some(x => x % 10 === 1) && ($scope.currentFigure.blocks.some(x => x % 10 === 0) || $scope.currentFigure.blocks.some(x => x % 10 === 9))) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    function outsideGridRight() {
                        if (newCoordinates.some(x => x % 10 === 1) && ($scope.currentFigure.blocks.some(x => x % 10 === 0) || $scope.currentFigure.blocks.some(x => x % 10 === 9))) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    if (!occupied && !outsideGridLeft() && !outsideGridRight()) {
                        return true;
                    } else {
                        return  false;
                    }
                };
                $scope.$on('gameChanged', function (e, games) {
                    if (games.game !== 'game3') {
                        $scope.pause = true;
                    }
                });


                $scope.stealColoredBlock = function () {
//                    console.log('');
                    let coloredBlocks = $scope.occupiedPositions.filter(x => x < 191 && [1, 2, 3].includes($scope.stage.children[x - 40].colored))
                    let randomBlockPosition = coloredBlocks[Math.floor(Math.random() * coloredBlocks.length)];
                    let x = randomBlockPosition % 10 === 0 ? 360 : randomBlockPosition % 10 * 20 + 160;
                    let y = Math.floor((randomBlockPosition - 50) / 10) * 20

//                    alert()

                    if (randomBlockPosition) {
//                        console.log(coloredBlocks);
                        console.log(randomBlockPosition);
//                        console.log(x);
//                        console.log(y);


                        $scope.handActive = true;
//                        $scope.time += 11300// $scope.gameSpeedF


//  x=pos%10*20 +180
//  y=Math.floor((pos-50)/10)   *20
                        let tl = new TimelineLite();
                        tl
                                .to($scope.hand, 0, {rotation: 2, transformOrigin: "left 100%"}, 0)
                                .to($scope.hand, 0.5, {x: x, y: y, rotation: 0, transformOrigin: "left 50%", onComplete: function () {
//                                      
//                                        
                                        $scope.occupiedPositions = $scope.occupiedPositions.filter(x => x !== randomBlockPosition)
                                        $scope.clearOldPosition([randomBlockPosition])
                                        $scope.stage.children[randomBlockPosition - 40].colored = 10;
                                        console.log($scope.stage.children[randomBlockPosition - 40].colored);
//                                                
//                                                  
//                                                      alert()
                                    }}, 0.55)
                                .to($scope.hand, 1, {x: 460, y: 0, rotation: 2, transformOrigin: "left 100%", onComplete: function () {
                                        $scope.handActive = false;


                                    }}, 1.15);
                    }
                };


                function animationLoop(delta) {





                    //CHECK FOR POSSIBLE LEFT MOVE!
                    if ($scope.keyboard.left) {
                        $scope.keyboard.left = false;
                        let temp = Array.from($scope.currentFigure.blocks);
                        for (let x in temp) {
                            temp[x] > 0 ? temp[x]-- : temp[x]++;
                        }
                        if ($scope.checkNewPosition(temp)) {
                            $scope.clearOldPosition($scope.currentFigure.blocks);
                            $scope.currentFigure.blocks = temp;
                            $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                        }
                    }
//                  CHECK FOR POSSIBLE RIGHT MOVE!
                    if ($scope.keyboard.right) {
                        $scope.keyboard.right = false;
                        let temp = Array.from($scope.currentFigure.blocks);
                        for (let x in temp) {
                            temp[x] > 0 ? temp[x]++ : temp[x]--;
                        }
                        if ($scope.checkNewPosition(temp)) {
                            $scope.clearOldPosition($scope.currentFigure.blocks);
                            $scope.currentFigure.blocks = temp;
                            $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                        }
                    }
//                  CHECK FOR POSSIBLE FORCED DOWN!                
                    if ($scope.keyboard.down) {
                        $scope.keyboard.down = false;

                        $scope.handActive ? '' : $scope.time -= $scope.gameSpeed;
                    }
//                  CHECK ROTATE!








                    if ($scope.keyboard.rotate) {







                        $scope.keyboard.rotate = false;
//                      CHECK FIGURE TYPE!
                        switch ($scope.currentFigure.type) {
                            case 1:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp - 21, temp - 20, temp - 19, temp - 18])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 21, temp - 20, temp - 19, temp - 18];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 2:
                                break;
                            case 3:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[3];
                                    if ($scope.checkNewPosition([temp, temp + 11, temp + 1, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 11, temp + 1, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp + 10, temp - 1])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp + 10, temp - 1];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp + 9, temp - 1, temp - 11, temp])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 9, temp - 1, temp - 11, temp];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[3];
                                    if ($scope.checkNewPosition([temp + 9, temp + 10, temp + 11, temp])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 9, temp + 10, temp + 11, temp];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 4:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 9, temp + 10, temp, temp + 1])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 9, temp + 10, temp, temp + 1];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp - 1, temp, temp - 11])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp - 1, temp, temp - 11];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 5:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 1, temp, temp + 10, temp + 11])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp, temp + 10, temp + 11];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 10, temp, temp + 1, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp, temp + 1, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 6:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 2, temp - 1, temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 2, temp - 1, temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp, temp - 10, temp - 11])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp, temp - 10, temp - 11];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 1, temp - 11, temp - 10, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp - 11, temp - 10, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp - 10, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp - 10, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 7:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp + 1, temp - 11, temp - 10, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 1, temp - 11, temp - 10, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp, temp + 1])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp, temp + 1];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp + 11, temp + 12, temp])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp + 11, temp + 12, temp];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 1, temp, temp - 10, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp, temp - 10, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 8:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp + 1, temp - 10, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 1, temp - 10, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp - 1, temp - 11, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp - 11, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 9:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 1, temp, temp + 1])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp, temp + 1];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 10, temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 10:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp - 1, temp])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 1, temp];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 11:
                                break;
                            case 12:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp + 2, temp - 8, temp - 18])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp + 2, temp - 8, temp - 18];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[4];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp - 2, temp - 1, temp])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp - 2, temp - 1, temp];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp, temp + 1, temp + 2])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp, temp + 1, temp + 2];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp, temp + 1, temp + 2, temp - 8, temp - 18])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp, temp + 1, temp + 2, temp - 10, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 13:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp - 12, temp - 11, temp - 10, temp - 9, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 12, temp - 11, temp - 10, temp - 9, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp - 1, temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp - 1, temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[3];
                                    if ($scope.checkNewPosition([temp + 10, temp - 1, temp, temp + 1, temp + 2])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp - 1, temp, temp + 1, temp + 2];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }

                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp, temp + 1, temp - 10, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp, temp + 1, temp - 10, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 14:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp - 11, temp - 10, temp - 9, temp - 8, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 11, temp - 10, temp - 9, temp - 8, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 10, temp - 1, temp, temp - 10, temp - 20])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp - 1, temp, temp - 10, temp - 20];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp - 2, temp - 1, temp, temp + 1])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp - 2, temp - 1, temp, temp + 1];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[3];
                                    if ($scope.checkNewPosition([temp + 20, temp + 10, temp + 1, temp, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 20, temp + 10, temp + 1, temp, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 15:
                                break;
                            case 16:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 9, temp, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 9, temp, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[1];
                                    if ($scope.checkNewPosition([temp + 11, temp, temp - 11])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 11, temp, temp - 11];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 17:
                                if ($scope.currentFigure.position === 1) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp - 2, temp, temp - 12, temp - 11, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp - 2, temp, temp - 12, temp - 11, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 2;
                                    }
                                } else if ($scope.currentFigure.position === 2) {
                                    let temp = $scope.currentFigure.blocks[0];
                                    if ($scope.checkNewPosition([temp + 10, temp + 11, temp, temp - 10, temp - 9])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp + 11, temp, temp - 10, temp - 9];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 3;
                                    }
                                } else if ($scope.currentFigure.position === 3) {
                                    let temp = $scope.currentFigure.blocks[2];
                                    if ($scope.checkNewPosition([temp + 10, temp + 11, temp + 12, temp, temp + 2])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 10, temp + 11, temp + 12, temp, temp + 2];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 4;
                                    }
                                } else if ($scope.currentFigure.position === 4) {
                                    let temp = $scope.currentFigure.blocks[4];
                                    if ($scope.checkNewPosition([temp + 9, temp + 10, temp, temp - 11, temp - 10])) {
                                        $scope.clearOldPosition($scope.currentFigure.blocks);
                                        $scope.currentFigure.blocks = [temp + 9, temp + 10, temp, temp - 11, temp - 10];
                                        $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);
                                        $scope.currentFigure.position = 1;
                                    }
                                }
                                break;
                            case 18:
                                break;
                            case 19:
                                break;
                            case 20:
                                break;
                        }
                    }
                    if ($scope.moveBlocksUpInterval && delta - $scope.moveBlocksUp > $scope.moveBlocksUpInterval) {
                        $scope.moveBlocksUp = delta;
                        $scope.rowUp();
                    }
                    if (delta - $scope.time > $scope.gameSpeed) {
                        $scope.time = delta;


                        if (Math.floor(Math.random() * 10) + 1 === 1 && !$scope.handActive) {
//                            $scope.handActive = true;

//                            $timeout(function () {
                                $scope.stealColoredBlock()
//                                $scope.time += 10
//                                00;// $scope.gameSpeed
//                            }, 550)
                        }


                        if ($scope.checkCollision()) {
                            let match = false;
                            let occupiedPositionsCopyArr;
                            if ($scope.currentFigure.blocks.some(x => x < 40)) {
                                $scope.gameOver();
                            }
                            $scope.occupiedPositions = $scope.occupiedPositions.concat($scope.currentFigure.blocks);






                            for (let x in $scope.currentFigure.blocks) {
                                $scope.stage.children[$scope.currentFigure.blocks[x] - 40].colored = $scope.currentFigure.color;
//                                console.log($scope.stage.children[$scope.currentFigure.blocks[x] - 40]);
                            }





//                            console.log($scope.currentFigure.blocks);
//                            console.log($scope.stage.children);
//                            alert()

                            let matches = [];
                            let colorMatch = false;
//                            occupiedPositionsCopyArr = $scope.occupiedPositions.slice(0);
                            for (let r = 4; r <= 18; r++) {
                                for (let i = 1; i <= 10; i++) {
                                    if (!$scope.occupiedPositions.includes(r * 10 + i)) {
                                        break;
                                    }
                                    if (i === 10) {
                                        let color = $scope.stage.children[r * 10 + 1 - 40].colored;
                                        console.log(color);

                                        for (let k = 2; k <= 10; k++) {
                                            if ($scope.stage.children[r * 10 + k - 40].colored !== color) {

                                                break;
                                            }
                                            if (k === 10) {
                                                colorMatch = true;
                                            }
                                        }





                                        occupiedPositionsCopyArr = $scope.occupiedPositions.slice(0);
                                        match = true;
                                        matches.push(r);



//                                        alert(colorMatch)
                                    }
                                }

                            }


//                            colorMatch ? $scope.clearAll() : $scope.line(matches);
                            if (colorMatch && $scope.gameMode === 'Colored') {
                                $scope.clearAll();
//                                occupiedPositionsCopyArr =[];
                            } else {
//                                occupiedPositionsCopyArr = $scope.occupiedPositions.slice(0);
                                $scope.line(matches);
                            }


//  $scope.line(matches);

                            if (match) {
                                switch (matches.length) {
                                    case 1:
                                        $scope.score += 8 * $scope.multiplier;
                                        break;
                                    case 2:
                                        $scope.score += 10 * $scope.multiplier;
                                        break;
                                    case 3:
                                        $scope.score += 30 * $scope.multiplier;
                                        break;
                                    case 4:
                                        $scope.score += 120 * $scope.multiplier;
                                        break;
                                }
                                if ($scope.score >= $scope.nextLevel) {
                                    $scope.increaseLevel();
                                }
                                $scope.scoreText.text = "Score:             " + $scope.score;
                                $scope.multiplier++;
                                $scope.multiplierText.text = "Multiplier:       " + $scope.multiplier;
                                $scope.currentFigure.blocks = [];
                                $timeout(function () {
//                                    console.log(occupiedPositions);
//                                    alert()
                                    $scope.clearOldPosition(occupiedPositionsCopyArr);
//                                    $scope.clearOldPosition($scope.occupiedPositions);
                                    $scope.drawNewPosition($scope.occupiedPositions);
                                    $scope.currentFigure = $scope.nextFigure;
                                    $scope.nextFigure = $scope.randomFigure();
                                    $scope.showNextFigure($scope.nextFigure.coordinates_next, $scope.nextFigure.color);
                                }, 500)// + $scope.gameSpeed)
                            } else {



//                                for (let x in $scope.currentFigure.blocks) {
//                                    $scope.stage.children[$scope.currentFigure.blocks[x] - 40].colored = $scope.currentFigure.color;
////                                console.log($scope.stage.children[$scope.currentFigure.blocks[x] - 40]);
//                                }





                                $scope.multiplier = 1;
                                $scope.multiplierText.text = "Multiplier:       " + $scope.multiplier;
                                $scope.currentFigure = $scope.nextFigure;
                                $scope.nextFigure = $scope.randomFigure();
                                $scope.showNextFigure($scope.nextFigure.coordinates_next, $scope.nextFigure.color);
                            }
                        } else {
                            $scope.clearOldPosition($scope.currentFigure.blocks);
                            for (let x in $scope.currentFigure.blocks) {
                                $scope.currentFigure.blocks[x] += 10;
                            }
                            $scope.drawNewPosition($scope.currentFigure.blocks, $scope.currentFigure.color);

                        }
                    }
                    if ($scope.pause) {
                        return;
                    }
                    renderer.render($scope.stage);
                    requestAnimationFrame(animationLoop);
                }

                $scope.clearOldPosition = function (elements) {
                    for (let x in elements) {
                        if (elements[x] - 40 > 0 && elements[x] - 40 < 151) {
                            $scope.stage.children[elements[x] - 40].clear();
                            $scope.stage.children[elements[x] - 40].lineStyle(1, 0xffffff);
                            $scope.stage.children[elements[x] - 40].beginFill(0x868687);
                            $scope.stage.children[elements[x] - 40].drawRect(0, 0, 20, 20);
                        }
                    }
                };
                $scope.rowUp = function () {
                    $scope.clearOldPosition($scope.occupiedPositions);
                    for (let x in $scope.occupiedPositions) {
                        if ($scope.occupiedPositions[x] < 191) {
                            $scope.occupiedPositions[x] -= 10;
                        }
                    }
                    $scope.drawNewPosition($scope.occupiedPositions);
                }
                $scope.drawNewPosition = function (elements, colorNumber) {

//                    console.log($scope.stage.children);

                    for (let x in elements) {
                        if ($scope.stage.children[elements[x] - 40]) {

                            if ($scope.stage.children[elements[x] - 40].colored === 1 || $scope.stage.children[elements[x] - 40].colored === 2 || $scope.stage.children[elements[x] - 40].colored === 3) {
                                console.log(elements[x] - 40);
                            }

//                                  console.log($scope.stage.children[elements[x] - 40].colored);
                        }

                    }


//                    let red = $scope.stage.children.filter(x => x.colored === 3)
//                    let green = $scope.stage.children.filter(x => x.colored === 2)
//                    let blue = $scope.stage.children.filter(x => x.colored === 1)
//                    console.log('red ' + red);
//                    console.log('green ' + green);
//                    console.log('blue ' + blue);


                    let color;

                    if (colorNumber === 1) {  //blue
                        color = 0x284cb8;
                    } else if (colorNumber === 2) {
                        color = 0x2e6a1e;
                    } else if (colorNumber === 3) {
                        color = 0xfc0a20;
                    } else {
                        color = 0x2a2727;
                    }

//                    console.log(colorNumber);
                    for (let x in elements) {
                        if (!colorNumber) {
//
//
//
                            if (!$scope.stage.children[elements[x] - 40]) {
                                color = 0x2a2727;
                            } else if ($scope.stage.children[elements[x] - 40].colored === 1) {
                                color = 0x284cb8;
                            } else if ($scope.stage.children[elements[x] - 40].colored === 2) {
                                color = 0x2e6a1e;
                            } else if ($scope.stage.children[elements[x] - 40].colored === 3) {
                                color = 0xfc0a20;
                            } else if ($scope.stage.children[elements[x] - 40].colored > 3) {
                                color = 0x2a2727;
//                                console.log($scope.stage.children[elements[x] - 40].colored);
//                                console.log(x);
                            }
                        }
                        if (elements[x] - 40 > 0 && elements[x] - 40 < 151) {
                            $scope.stage.children[elements[x] - 40].clear();
                            $scope.stage.children[elements[x] - 40].lineStyle(1, 0x7c6e6e, 2);
                            $scope.stage.children[elements[x] - 40].beginFill(color);
                            $scope.stage.children[elements[x] - 40].drawRect(0, 0, 20, 20);
                        }
                    }

                };
                $scope.startGame = function () {
                    $scope.score = 0;
                    $scope.multiplier = 1;
                    $scope.time = 0;
//                    $scope.moveBlocksUp = $scope.gameSettings.difficulty.value === 'easy' ? undefined : $scope.gameSettings.difficulty.value === 'normal' ? 10 : 5;
                    $scope.moveBlocksUp = 0;
                    $scope.moveBlocksUpInterval = $scope.gameSettings.difficulty.value === 'easy' ? undefined : $scope.gameSettings.difficulty.value === 'normal' ? 10000 : 5000;
                    $scope.gameMode = $scope.gameSettings.mode.value;
                    $scope.occupiedPositions = [191, 192, 193, 194, 195, 196, 197, 198, 199, 200];
                    $scope.start = true;
                    $scope.pause = false;
                    $scope.handActive = false;
                    $timeout(function () {
                        $window.dispatchEvent(new Event("resize"));
                    }, 0);
                    let graphics = new PIXI.Graphics();
                    graphics.lineStyle(1, 'black');
                    graphics.drawRect(0, 0, 200, 299);
                    graphics.x = 200;
                    $scope.stage.addChild(graphics);
                    $scope.currentFigure = $scope.randomFigure();
                    $scope.nextFigure = $scope.randomFigure();
                    $scope.showNextFigure($scope.nextFigure.coordinates_next, $scope.nextFigure.color);
                    $scope.createBlocks();
                    animationLoop();
//                    debugger
                };
                $scope.increaseLevel = function () {
                    $scope.level++;
                    $scope.gameSpeed = 1100 - $scope.level * 100;
                    $scope.nextLevel = Math.floor($scope.nextLevel *= 2.5);
                    $scope.nextLevelText.text = "Next level on:  " + $scope.nextLevel;
                    $scope.levelText.text = "Level:              " + $scope.level;
                };
                $scope.createBlocks = function () {
                    for (let column = 0; column < 15; column++) {
                        for (let row = 1; row <= 10; row++) {
                            let graphics = new PIXI.Graphics();
                            graphics.beginFill(0x868687);
                            graphics.lineStyle(1, 0xffffff);
                            graphics.drawRect(0, 0, 20, 20);
                            graphics.x = 180 + row * 20;
                            graphics.y = column * 20;
//                            graphics.anchor.set(0.5);                          

                            $scope.stage.addChild(graphics);
                        }
                    }
                    $scope.nextFigureContainer = new PIXI.Container();
                    $scope.nextFigureContainer.x = 25;
                    $scope.nextFigureContainer.y = 10;
                    let nextFigureRect = new PIXI.Graphics();
                    nextFigureRect.lineStyle(1, 0xffffff);
                    nextFigureRect.drawRect(0, 0, 150, 60);
                    $scope.nextFigureContainer.addChild(nextFigureRect);
                    $scope.stage.addChild($scope.nextFigureContainer);
                    for (let column = 0; column < 6; column++) {
                        for (let row = 0; row <= 5; row++) {
                            let rect = new PIXI.Graphics();
                            rect.beginFill(0x868687);
                            rect.lineStyle(1, 0xffffff);
                            rect.drawRect(0, 0, 10, 10);
                            rect.x = 90 + row * 10;
                            rect.y = column * 10;
                            $scope.nextFigureContainer.addChild(rect);
                        }
                    }
                    $scope.next = new PIXI.Text(
                            "Next",
                            {fontFamily: "Arial", fontSize: 15}
                    );
                    $scope.next.position.set(0, 24);
                    $scope.next.style.fill = ['#0f0d0d'];
                    $scope.next.style.fontWeight = '900';
                    $scope.nextFigureContainer.addChild($scope.next);
                    $scope.scoreText = new PIXI.Text(
                            "Score:             " + $scope.score,
                            {fontFamily: "Arial", fontSize: 15}
                    );
                    $scope.scoreText.position.set(0, 70);
                    $scope.scoreText.style.fill = ['#0f0d0d'];
                    $scope.scoreText.style.fontWeight = '900';
                    $scope.nextFigureContainer.addChild($scope.scoreText);
                    $scope.multiplierText = new PIXI.Text(
                            "Multiplier:       " + $scope.multiplier,
                            {fontFamily: "Arial", fontSize: 15}
                    );
                    $scope.multiplierText.position.set(0, 116);
                    $scope.multiplierText.style.fill = ['#0f0d0d'];
                    $scope.multiplierText.style.fontWeight = '900';
                    $scope.nextFigureContainer.addChild($scope.multiplierText);
                    $scope.levelText = new PIXI.Text(
                            "Level:              " + $scope.level,
                            {fontFamily: "Arial", fontSize: 15}
                    );
                    $scope.levelText.position.set(0, 162);
                    $scope.levelText.style.fill = ['#0f0d0d'];
                    $scope.levelText.style.fontWeight = '900';
                    $scope.nextFigureContainer.addChild($scope.levelText);
                    $scope.nextLevel = 200;
                    $scope.nextLevelText = new PIXI.Text(
                            "Next level on:  " + $scope.nextLevel,
                            {fontFamily: "Arial", fontSize: 15}
                    );
                    $scope.nextLevelText.position.set(0, 208);
                    $scope.nextLevelText.style.fill = ['#0f0d0d'];
                    $scope.nextLevelText.style.fontWeight = '900';
                    $scope.nextFigureContainer.addChild($scope.nextLevelText);
                    $scope.level = $scope.gameSettings.level.value - 1;

                    $scope.hand = PIXI.Sprite.fromImage('images/hand.png');
                    $scope.hand.x = 460;
                    $scope.hand.y = 0;
                    $scope.hand.scale.x = 0.1;
                    $scope.hand.scale.y = 0.1;
                    $scope.stage.addChild($scope.hand);


                    $scope.increaseLevel();
                };
                $scope.showNextFigure = function (coordinates, colorNumber) {
                    $timeout(function () {

                        let color;

//                        return 'red'
                        if (colorNumber === 1) {  //blue
                            color = 0x284cb8;
                        } else if (colorNumber === 2) {
                            color = 0x2e6a1e;
                        } else if (colorNumber === 3) {
                            color = 0xfc0a20;
                        } else {
                            color = 0x212529;
                        }



                        if ($scope.stage.children.length === 0) {
                            return;
                        }
                        let container = $scope.stage.children[151].children;
                        for (let x = 1; x <= 36; x++) {
                            container[x].clear();
                            container[x].lineStyle(1, 0xffffff);
                            container[x].beginFill(0xffffff);
                            container[x].drawRect(0, 0, 10, 10);
                        }
                        for (let x in coordinates) {
                            container[coordinates[x]].clear();
                            container[coordinates[x]].lineStyle(1, 0x7c6e6e);
                            container[coordinates[x]].beginFill(color);
                            container[coordinates[x] ].drawRect(0, 0, 10, 10);
                        }
                    }, 50);
                };

                $scope.randomColor = function () {
                    return Math.floor(Math.random() * 10) + 1;
                };

                $scope.randomFigure = function () {


                    let colored = $scope.gameMode === 'Colored'
                    let type;// = 1;

                    $scope.gameMode === 'Standard' ? type = Math.floor(Math.random() * 7) + 1 : $scope.gameMode === 'Extra figures' ? type = Math.floor(Math.random() * 20) + 1 : type = Math.floor(Math.random() * 7) + 1;
                    switch (type) {
                        case 1:
                            let position = Math.floor(Math.random() * 2) + 1;
                            switch (position) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type1position1StartAtColumn = Math.floor(Math.random() * 10) + 1;
                                    return{
                                        blocks: [type1position1StartAtColumn + 30, type1position1StartAtColumn + 20, type1position1StartAtColumn + 10, type1position1StartAtColumn],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [10, 16, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };

                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type1position2StartAtColumn = Math.floor(Math.random() * 7) + 1;
                                    return{
                                        blocks: [type1position2StartAtColumn + 30, type1position2StartAtColumn + 31, type1position2StartAtColumn + 32, type1position2StartAtColumn + 33],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [20, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                            }
                            break;
                        case 2:
                            let type2position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                            return{
                                blocks: [type2position1StartAtColumn + 30, type2position1StartAtColumn + 31, type2position1StartAtColumn + 20, type2position1StartAtColumn + 21],
                                type: type,
                                position: 1,
                                coordinates_next: [15, 16, 21, 22],
                                color: colored ? $scope.randomColor() : false
                            };
                            break;
                        case 3:
                            let type3Positionn = 1// Math.floor(Math.random() * 4) + 1;
                            switch (type3Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type3position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type3position1StartAtColumn + 30, type3position1StartAtColumn + 31, type3position1StartAtColumn + 32, type3position1StartAtColumn + 21],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [21, 22, 23, 16],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type3position2StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type3position2StartAtColumn + 20, type3position2StartAtColumn + 21, type3position2StartAtColumn + 31, type3position2StartAtColumn + 11],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [21, 22, 28, 16],
                                        color: colored ? $scope.randomColor() : false

                                    };
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type3position3StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type3position3StartAtColumn + 31, type3position3StartAtColumn + 21, type3position3StartAtColumn + 20, type3position3StartAtColumn + 22],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [21, 22, 23, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    return [type3position3StartAtColumn + 31, type3position3StartAtColumn + 21, type3position3StartAtColumn + 20, type3position3StartAtColumn + 22];
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type3position4StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type3position4StartAtColumn + 30, type3position4StartAtColumn + 20, type3position4StartAtColumn + 10, type3position4StartAtColumn + 21],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [21, 22, 27, 15],
                                        color: colored ? $scope.randomColor() : false
                                    };
                            }
                            break;
                        case 4:
                            let type4Positionn = Math.floor(Math.random() * 2) + 1;
                            switch (type4Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type4position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type4position1StartAtColumn + 31, type4position1StartAtColumn + 20, type4position1StartAtColumn + 21, type4position1StartAtColumn + 10],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 21, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type4position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type4position2StartAtColumn + 30, type4position2StartAtColumn + 31, type4position2StartAtColumn + 21, type4position2StartAtColumn + 22],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [16, 17, 21, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 5:
                            let type5Positionn = Math.floor(Math.random() * 2) + 1;
                            switch (type5Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type5position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type5position1StartAtColumn + 30, type5position1StartAtColumn + 20, type5position1StartAtColumn + 21, type5position1StartAtColumn + 11],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [16, 21, 22, 27],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type4position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type4position2StartAtColumn + 20, type4position2StartAtColumn + 21, type4position2StartAtColumn + 31, type4position2StartAtColumn + 32],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [15, 16, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 6:
                            let type6Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type6Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type6position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type6position1StartAtColumn + 30, type6position1StartAtColumn + 31, type6position1StartAtColumn + 20, type6position1StartAtColumn + 10],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 21, 27, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type6position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type6position2StartAtColumn + 30, type6position2StartAtColumn + 31, type6position2StartAtColumn + 32, type6position2StartAtColumn + 22],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [17, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type6position3StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type6position3StartAtColumn + 31, type6position3StartAtColumn + 21, type6position3StartAtColumn + 11, type6position3StartAtColumn + 10],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [15, 16, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:                                             //POTENTIAL PROBLEM!!!!
                                    $scope.currentFigureType.position = 4;
                                    let type6position4StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type6position4StartAtColumn + 30, type6position4StartAtColumn + 20, type6position4StartAtColumn + 21, type6position4StartAtColumn + 22],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [15, 16, 17, 21],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 7:
                            let type7Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type7Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type7position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type7position1StartAtColumn + 30, type7position1StartAtColumn + 31, type7position1StartAtColumn + 21, type7position1StartAtColumn + 11],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [16, 22, 27, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type7position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type7position2StartAtColumn + 32, type7position2StartAtColumn + 20, type7position2StartAtColumn + 21, type7position2StartAtColumn + 22],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [15, 16, 17, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type7position3StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type7position3StartAtColumn + 30, type7position3StartAtColumn + 20, type7position3StartAtColumn + 10, type7position3StartAtColumn + 11],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [15, 16, 21, 27],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type7position4StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type7position4StartAtColumn + 30, type7position4StartAtColumn + 31, type7position4StartAtColumn + 32, type7position4StartAtColumn + 20],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [15, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 8:
                            let type8Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type8Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type8position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type8position1StartAtColumn + 30, type8position1StartAtColumn + 31, type8position1StartAtColumn + 20],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 21, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type8position2StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type8position2StartAtColumn + 30, type8position2StartAtColumn + 31, type8position2StartAtColumn + 21],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [16, 21, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type8position3StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type8position3StartAtColumn + 31, type8position3StartAtColumn + 20, type8position3StartAtColumn + 21],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [15, 16, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type8position4StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type8position4StartAtColumn + 30, type8position4StartAtColumn + 20, type8position4StartAtColumn + 21],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [15, 16, 21],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 9:
                            let type9Positionn = Math.floor(Math.random() * 2) + 1;
                            switch (type9Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type9position1StartAtColumn = Math.floor(Math.random() * 10) + 1;
                                    return{
                                        blocks: [type9position1StartAtColumn + 30, type9position1StartAtColumn + 20, type9position1StartAtColumn + 10],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [16, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type9position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type9position2StartAtColumn + 30, type9position2StartAtColumn + 31, type9position2StartAtColumn + 32],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 10:
                            let type10Positionn = Math.floor(Math.random() * 2) + 1;
                            switch (type10Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type10position1StartAtColumn = Math.floor(Math.random() * 10) + 1;
                                    return{
                                        blocks: [type10position1StartAtColumn + 30, type10position1StartAtColumn + 20],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [16, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type8position2StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type8position2StartAtColumn + 30, type8position2StartAtColumn + 31],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [21, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 11:
                            $scope.currentFigureType.position = 1;
                            let type11position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                            return{
                                blocks: [type11position1StartAtColumn + 30, type11position1StartAtColumn + 32, type11position1StartAtColumn + 21, type11position1StartAtColumn + 30, type11position1StartAtColumn + 10, type11position1StartAtColumn + 12],
                                type: type,
                                position: 1,
                                coordinates_next: [15, 17, 22, 27, 29],
                                color: colored ? $scope.randomColor() : false
                            };
                            break;
                        case 12:
                            let type12Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type12Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type12position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type12position1StartAtColumn + 30, type12position1StartAtColumn + 31, type12position1StartAtColumn + 32, type12position1StartAtColumn + 20, type12position1StartAtColumn + 10],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 21, 27, 28, 29],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type12position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type12position2StartAtColumn + 30, type12position2StartAtColumn + 31, type12position2StartAtColumn + 32, type12position2StartAtColumn + 22, type12position2StartAtColumn + 12],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [17, 23, 27, 28, 29],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type12position3StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type12position3StartAtColumn + 32, type12position3StartAtColumn + 22, type12position3StartAtColumn + 10, type12position3StartAtColumn + 11, type12position3StartAtColumn + 12],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [15, 16, 17, 23, 29],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type12position4StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type12position4StartAtColumn + 30, type12position4StartAtColumn + 20, type12position4StartAtColumn + 10, type12position4StartAtColumn + 11, type12position4StartAtColumn + 12],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [15, 16, 17, 21, 27],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 13:
                            let type13Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type13Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type13position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type13position1StartAtColumn + 30, type13position1StartAtColumn + 20, type13position1StartAtColumn + 21, type13position1StartAtColumn + 10, type13position1StartAtColumn],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [10, 16, 22, 23, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type13position2StartAtColumn = Math.floor(Math.random() * 7) + 1;
                                    return{
                                        blocks: [type13position2StartAtColumn + 30, type13position2StartAtColumn + 31, type13position2StartAtColumn + 32, type13position2StartAtColumn + 33, type13position2StartAtColumn + 22],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [16, 20, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type13position3StartAtColumn = Math.floor(Math.random() * 7) + 2;
                                    return{
                                        blocks: [type13position3StartAtColumn + 31, type13position3StartAtColumn + 21, type13position3StartAtColumn + 10, type13position3StartAtColumn + 11, type13position3StartAtColumn + 1],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [10, 15, 16, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type13position4StartAtColumn = Math.floor(Math.random() * 7) + 1;
                                    return{
                                        blocks: [type13position4StartAtColumn + 31, type13position4StartAtColumn + 20, type13position4StartAtColumn + 21, type13position4StartAtColumn + 22, type13position4StartAtColumn + 23],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [14, 15, 16, 17, 21],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 14:
                            let type14Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type14Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type14position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type14position1StartAtColumn + 30, type14position1StartAtColumn + 20, type14position1StartAtColumn + 10, type14position1StartAtColumn + 11, type14position1StartAtColumn],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [10, 16, 17, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type14position2StartAtColumn = Math.floor(Math.random() * 7) + 1;
                                    return{
                                        blocks: [type14position2StartAtColumn + 30, type14position2StartAtColumn + 31, type14position2StartAtColumn + 32, type14position2StartAtColumn + 33, type14position2StartAtColumn + 21],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [15, 20, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type14position3StartAtColumn = Math.floor(Math.random() * 7) + 2;
                                    return{
                                        blocks: [type14position3StartAtColumn + 31, type14position3StartAtColumn + 20, type14position3StartAtColumn + 21, type14position3StartAtColumn + 11, type14position3StartAtColumn + 1],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [10, 16, 21, 22, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type14position4StartAtColumn = Math.floor(Math.random() * 7) + 1;
                                    return{
                                        blocks: [type14position4StartAtColumn + 32, type14position4StartAtColumn + 20, type14position4StartAtColumn + 21, type14position4StartAtColumn + 22, type14position4StartAtColumn + 23],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [14, 15, 16, 17, 22],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                            break;
                        case 15:
                            $scope.currentFigureType.position = 1;
                            let type14position1StartAtColumn = Math.floor(Math.random() * 10) + 1;
                            return{
                                blocks: [type14position1StartAtColumn + 30],
                                type: type,
                                position: 1,
                                coordinates_next: [16],
                                color: colored ? $scope.randomColor() : false
                            };
                            break;
                        case 16:
                            let type16Positionn = Math.floor(Math.random() * 2) + 1;
                            switch (type16Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type16position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type16position1StartAtColumn + 32, type16position1StartAtColumn + 21, type16position1StartAtColumn + 10],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 22, 29],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type16position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type16position2StartAtColumn + 30, type16position2StartAtColumn + 21, type16position2StartAtColumn + 12],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [17, 22, 27],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                        case 17:
                            let type17Positionn = Math.floor(Math.random() * 4) + 1;
                            switch (type17Positionn) {
                                case 1:
                                    $scope.currentFigureType.position = 1;
                                    let type17position1StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type17position1StartAtColumn + 30, type17position1StartAtColumn + 31, type17position1StartAtColumn + 21, type17position1StartAtColumn + 10, type17position1StartAtColumn + 11],
                                        type: type,
                                        position: 1,
                                        coordinates_next: [15, 16, 22, 27, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 2:
                                    $scope.currentFigureType.position = 2;
                                    let type17position2StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type17position2StartAtColumn + 30, type17position2StartAtColumn + 32, type17position2StartAtColumn + 20, type17position2StartAtColumn + 21, type17position2StartAtColumn + 22],
                                        type: type,
                                        position: 2,
                                        coordinates_next: [15, 16, 17, 21, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 3:
                                    $scope.currentFigureType.position = 3;
                                    let type17position3StartAtColumn = Math.floor(Math.random() * 9) + 1;
                                    return{
                                        blocks: [type17position3StartAtColumn + 30, type17position3StartAtColumn + 31, type17position3StartAtColumn + 20, type17position3StartAtColumn + 10, type17position3StartAtColumn + 11],
                                        type: type,
                                        position: 3,
                                        coordinates_next: [15, 16, 21, 27, 28],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                                case 4:
                                    $scope.currentFigureType.position = 4;
                                    let type17position4StartAtColumn = Math.floor(Math.random() * 8) + 1;
                                    return{
                                        blocks: [type17position4StartAtColumn + 30, type17position4StartAtColumn + 31, type17position4StartAtColumn + 32, type17position4StartAtColumn + 20, type17position4StartAtColumn + 22],
                                        type: type,
                                        position: 4,
                                        coordinates_next: [15, 17, 21, 22, 23],
                                        color: colored ? $scope.randomColor() : false
                                    };
                                    break;
                            }
                        case 18:
                            $scope.currentFigureType.position = 1;
                            let type18position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                            return{
                                blocks: [type18position1StartAtColumn + 30, type18position1StartAtColumn + 31, type18position1StartAtColumn + 32, type18position1StartAtColumn + 20, type18position1StartAtColumn + 22, type18position1StartAtColumn + 10, type18position1StartAtColumn + 11, type18position1StartAtColumn + 12],
                                type: type,
                                position: 1,
                                coordinates_next: [15, 16, 17, 21, 23, 27, 28, 29]
                            };
                            break;
                        case 19:
                            $scope.currentFigureType.position = 1;
                            let type19position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                            return{
                                blocks: [type19position1StartAtColumn + 30, type19position1StartAtColumn + 31, type19position1StartAtColumn + 32, type19position1StartAtColumn + 20, type19position1StartAtColumn + 21, type19position1StartAtColumn + 22, type19position1StartAtColumn + 10, type19position1StartAtColumn + 11, type19position1StartAtColumn + 12],
                                type: type,
                                position: 1,
                                coordinates_next: [15, 16, 17, 21, 22, 23, 27, 28, 29]
                            };
                            break;
                        case 20:
                            $scope.currentFigureType.position = 1;
                            let type20position1StartAtColumn = Math.floor(Math.random() * 8) + 1;
                            return{
                                blocks: [type20position1StartAtColumn + 31, type20position1StartAtColumn + 20, type20position1StartAtColumn + 21, type20position1StartAtColumn + 22, type20position1StartAtColumn + 11],
                                type: type,
                                position: 1,
                                coordinates_next: [16, 21, 22, 23, 28]
                            };
                            break;
                    }
                };
                $scope.checkCollision = function () {
                    for (let x in $scope.currentFigure.blocks) {
                        if ($scope.occupiedPositions.includes($scope.currentFigure.blocks[x] + 10)) {
                            return true;
                        } else if (x === $scope.currentFigure.blocks.length) {
                            return false;
                        }
                    }
                };
                $scope.gameOver = function () {
//
//                    console.log($scope.stage.children);
                    $scope.stage.children = [];
//                    let gameOver = new PIXI.Text('Game Over', {
//                        fontFamily: "Arial",
//                        fontSize: 40,
//                        dropShadow: true,
//                        dropShadowBlur: 7,
//                        dropShadowColor: '#d9cb32',
//                        dropShadowAngle: 15,
//                        dropShadowDistance: 0
//                    });
//                    gameOver.anchor.set(0.5);
//                    gameOver.x = 100;
//                    gameOver.y = 100;
//                    $scope.stage.addChild(gameOver);
//                    renderer.render($scope.stage);
                    $scope.pause = true;
//                    $timeout(function () {
//                        $state.transitionTo($state.current, $stateParams, {reload: true, inherit: true, notify: true});
//                    }, 0);
                };
            });
})();







