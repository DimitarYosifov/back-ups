
(function () {
    let app = angular.module('app')
            .controller('Game2Controller', function ($scope, $http, $window, $state, $timeout, $stateParams, $interval) {
                $scope.gameName = 'Game 2';
                $scope.currentDealBet = 0;
                $scope.gameSettings =
                        {
                            'cards': {
                                options: [0, 1, 2],
                                name: 'opponent visible cards',
                                value: '1'
                            },

                            playerCash: {
                                options: [25, 250, 500, 1000, 2000],
                                name: 'player cash',
                                value: 1000
                            }
                        };
                $scope.pause = true;
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
                    $scope.loadCards();
                    $scope.resetForNewDeal();
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
                $scope.$on('gameChanged', function (e, games) {
                    if (games.game !== 'game2') {
                        $scope.pause = true;
                    }
                });
                function animationLoop(delta) {
                    if ($scope.pause) {
                        return;
                    }
                    renderer.render($scope.stage);
                    requestAnimationFrame(animationLoop);
                }
                $scope.loadElements = function () {
                    $scope.playerCash -= $scope.currentDealBet;
                    $scope.cash.text = ("" + $scope.playerCash + ' $');
                    $scope.hitCard = new PIXI.Text("Hit", {
                        background: 'red',
                        fontFamily: "Arial",
                        fontSize: 25,
                        dropShadow: true,
                        dropShadowBlur: 7,
                        dropShadowColor: '#2e8023',
                        dropShadowAngle: 15,
                        dropShadowDistance: 0
                    });
                    $scope.hitCard.anchor.set(0.5);
                    $scope.hitCard.x = 280;
                    $scope.hitCard.y = 370;
                    $scope.hitCard.style.fontWeight = '300';
                    $scope.hitCard.buttonMode = true;
                    $scope.hitCard.on('click', function () {
                        TweenMax.to($scope.hitCard, 0.1, {scaleX: 1.1, scaleY: 1.1}).yoyo(true).repeat(1);
                        $scope.drawCard();
                    });
                    $scope.hitCard.on('touchstart', function () {
                        TweenMax.to($scope.hitCard, 0.1, {scaleX: 1.1, scaleY: 1.1}).yoyo(true).repeat(1);
                        $scope.drawCard();
                    });
                    $scope.stage.addChild($scope.hitCard);
                    $scope.stand = new PIXI.Text("Stand", {
                        background: 'red',
                        fontFamily: "Arial",
                        fontSize: 25,
                        dropShadow: true,
                        dropShadowBlur: 4,
                        dropShadowColor: '#2e8023',
                        dropShadowAngle: 15,
                        dropShadowDistance: 0
                    });
                    $scope.stand.buttonMode = true;
                    $scope.stand.anchor.set(0.5);
                    $scope.stand.x = 350;
                    $scope.stand.y = 370;
                    $scope.stand.style.fontWeight = '300';
                    $scope.stand.interactive = true;
                    $scope.stand.buttonMode = true;
                    $scope.stand.on('touchstart', function () {
                        $scope.playerFolded = true;
                        TweenMax.to($scope.stand, 0.1, {scaleX: 1.1, scaleY: 1.1}).yoyo(true).repeat(1);
                        $scope.revealOpponentCards();
                    });
                    $scope.stand.on('click', function () {
                        $scope.playerFolded = true;
                        TweenMax.to($scope.stand, 0.1, {scaleX: 1.1, scaleY: 1.1}).yoyo(true).repeat(1);
                        $scope.revealOpponentCards();
                    });
                    $scope.stage.addChild($scope.stand);
                    $scope.displayPlayerScore = new PIXI.Text("" + $scope.playerScore, {fontFamily: "Arial", fontSize: 25});
                    $scope.displayPlayerScore.position.set(50, 285);
                    $scope.displayPlayerScore.style.fill = ['red'];
                    $scope.displayPlayerScore.style.fontWeight = '900';
                    $scope.stage.addChild($scope.displayPlayerScore);
                    $scope.displayOpponentScore = new PIXI.Text("?", {fontFamily: "Arial", fontSize: 25});
                    $scope.displayOpponentScore.position.set(50, 80);
                    $scope.displayOpponentScore.style.fill = ['red'];
                    $scope.displayOpponentScore.style.fontWeight = '900';
                    $scope.stage.addChild($scope.displayOpponentScore);
                    $scope.backForOpponentCard = PIXI.Sprite.fromImage('images/card-deck/yellow_back.png')
                    $scope.backForOpponentCard.scale.x = 0.1;
                    $scope.backForOpponentCard.scale.y = 0.1;
                    $scope.backForOpponentCard.x = 300;
                    $scope.backForOpponentCard.y = 100;
                    $scope.backForOpponentCard.width = 50;
                    $scope.stage.addChild($scope.backForOpponentCard);
                    $scope.backForOpponentCard2 = PIXI.Sprite.fromImage('images/card-deck/yellow_back.png')
                    $scope.backForOpponentCard2.scale.x = 0.1;
                    $scope.backForOpponentCard2.scale.y = 0.1;
                    $scope.backForOpponentCard2.x = 300;
                    $scope.backForOpponentCard2.y = 100;
                    $scope.backForOpponentCard2.width = 50;
                    $scope.stage.addChild($scope.backForOpponentCard2);
                    $scope.backForPlayerCard = PIXI.Sprite.fromImage('images/card-deck/yellow_back.png')
                    $scope.backForPlayerCard.scale.x = 0.1;
                    $scope.backForPlayerCard.scale.y = 0.1;
                    $scope.backForPlayerCard.x = 300;
                    $scope.backForPlayerCard.y = 100;
                    $scope.backForPlayerCard.width = 50;
                    $scope.stage.addChild($scope.backForPlayerCard);
                    $scope.addOpponentCard1 = function () {
                        let opponentCard1 = $scope.getRandomCard();
                        $scope.opponentCard1 = PIXI.Sprite.fromImage('images/card-deck/' + opponentCard1 + '.png');
                        $scope.opponentCard1.scale.x = 0.1;
                        $scope.opponentCard1.scale.y = 0.1;
                        $scope.opponentCard1.alpha = 0;
                        $scope.opponentCard1.x = 200;
                        $scope.opponentCard1.y = 75;
                        $scope.opponentHand.push(opponentCard1);
                        $scope.stage.addChild($scope.opponentCard1);
                        let opp1 = new TimelineLite();
                        if ($scope.gameSettings.cards.value == 0) {
                            opp1
                                    .to($scope.backForOpponentCard, 0, {x: 300, y: 100, alpha: 1, width: 50})
                                    .to($scope.backForOpponentCard, 0.3, {x: 100, y: 50, onComplete: function () {
                                            $scope.addPlayerCard2();
                                        }}, 0);
                        } else {
                            opp1
                                    .to($scope.backForOpponentCard, 0.3, {width: 1, x: 200, y: 75}, 0.0)
                                    .to($scope.backForOpponentCard, 0, {alpha: 0}, 0.3)
                                    .call(function () {

                                    })
                                    .to($scope.opponentCard1, 0, {alpha: 1, width: 1}, 0.3)
                                    .to($scope.opponentCard1, 0.3, {width: 50, x: 100, y: 50, onComplete: function () {
                                            if ($scope.gameSettings.cards.value === 2) {
                                                $scope.calculateOpponentScore(opponentCard1);
                                            }
                                            $scope.addPlayerCard2();
                                        }}, 0.3);
                        }
                    };
                    $scope.addOpponentCard2 = function () {
                        let opponentCard2 = $scope.getRandomCard();
                        $scope.opponentCard2 = PIXI.Sprite.fromImage('images/card-deck/' + opponentCard2 + '.png');
                        $scope.opponentCard2.scale.x = 0.1;
                        $scope.opponentCard2.scale.y = 0.1;
                        $scope.opponentCard2.x = 130;
                        $scope.opponentCard2.y = 50;
                        $scope.opponentCard2.alpha = 0;
                        $scope.opponentHand.push(opponentCard2);
                        $scope.stage.addChild($scope.opponentCard2);
                        $scope.backForOpponentCard2.alpha = 1;
                        let opp2 = new TimelineLite();
                        if ($scope.gameSettings.cards.value === 2) {
                            opp2
                                    .to($scope.backForOpponentCard2, 0.3, {width: 1, x: 200, y: 75}, 0.0)
                                    .to($scope.backForOpponentCard2, 0, {alpha: 0}, 0.3)
                                    .call(function () {

                                    })
                                    .to($scope.opponentCard2, 0, {alpha: 1, width: 1, x: 200, y: 75}, 0.3)
                                    .to($scope.opponentCard2, 0.3, {width: 50, x: 130, y: 50, onComplete: function () {
                                            $scope.hitCard.interactive = true;
                                            $scope.stand.interactive = true;
                                            $scope.calculateOpponentScore(opponentCard2);
                                        }}, 0.3);
                        } else {
                            opp2.set($scope.backForOpponentCard2, {zIndex: 5044})
                                    .to($scope.backForOpponentCard2, 0, {x: 300, y: 100, alpha: 1, width: 50})
                                    .to($scope.backForOpponentCard2, 0.3, {x: 130, y: 50, onComplete: function () {
                                            $scope.hitCard.interactive = true;
                                            $scope.stand.interactive = true;
                                        }}, 0);
                        }
                    };
                    $scope.addPlayerCard1 = function () {
                        let playerCard1 = $scope.getRandomCard();
                        $scope.playerCard1 = PIXI.Sprite.fromImage('images/card-deck/' + playerCard1 + '.png');
                        $scope.playerCard1.scale.x = 0.1;
                        $scope.playerCard1.scale.y = 0.1;
                        $scope.playerCard1.alpha = 0;
                        $scope.playerCard1.x = 200;
                        $scope.playerCard1.y = 162.5;
                        $scope.playerHand.push(playerCard1);
                        $scope.stage.addChild($scope.playerCard1);
                        let pl1 = new TimelineLite();
                        pl1
                                .to($scope.backForPlayerCard, 0.3, {width: 1, x: 200, y: 162.5}, 0.0)
                                .to($scope.backForPlayerCard, 0, {alpha: 0}, 0.3)
                                .call(function () {

                                })
                                .to($scope.playerCard1, 0, {alpha: 1, width: 1}, 0.3)
                                .to($scope.playerCard1, 0.3, {width: 50, x: 100, y: 250, onComplete: function () {
                                        $scope.calculateScore(playerCard1);
                                        $scope.addOpponentCard1();
                                    }}, 0.3);
                    };
                    $scope.addPlayerCard2 = function () {
                        let playerCard2 = $scope.getRandomCard();
                        $scope.playerCard2 = PIXI.Sprite.fromImage('images/card-deck/' + playerCard2 + '.png');
                        $scope.playerCard2.scale.x = 0.1;
                        $scope.playerCard2.scale.y = 0.1;
                        $scope.playerCard2.x = 130;
                        $scope.playerCard2.y = 250;
                        $scope.playerCard2.alpha = 0;
                        $scope.playerHand.push(playerCard2);
                        $scope.stage.addChild($scope.playerCard2);
                        let pl2 = new TimelineLite();
                        pl2
                                .to($scope.backForPlayerCard, 0, {alpha: 1, width: 50, x: 300, y: 100}, 0.0)
                                .to($scope.backForPlayerCard, 0.3, {width: 1, x: 215, y: 162.5}, 0.0)
                                .to($scope.backForPlayerCard, 0, {alpha: 0}, 0.3)
                                .call(function () {
                                })
                                .to($scope.playerCard2, 0, {alpha: 1, x: 215, y: 162.5, width: 1}, 0.3)
                                .to($scope.playerCard2, 0.3, {width: 50, x: 130, y: 250, onComplete: function () {
                                        $scope.calculateScore(playerCard2);
                                        $scope.addOpponentCard2();
                                    }}, 0.3);
                    };
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    $scope.addPlayerCard1();
                    $scope.pause = false;
                };
                $scope.startGame = function () {
                    $scope.start = true;
                    $timeout(function () {
                        $window.dispatchEvent(new Event("resize"));
                    }, 0);
                    $scope.playerCash = $scope.gameSettings.playerCash.value;
                    $scope.nextGame()
                }
                $scope.nextGame = function () {
                    let background = PIXI.Texture.fromImage('images/card-table.jpg');
                    let  bg = new PIXI.extras.TilingSprite(background, 400, 400);
                    bg.position.x = 0;
                    bg.position.y = 0;
                    bg.tilePosition.x = 0;
                    bg.tilePosition.y = 0;
                    $scope.stage.addChild(bg);
                    $scope.deck = PIXI.Sprite.fromImage('images/card-deck/yellow_back.png')
                    $scope.deck.scale.x = 0.1;
                    $scope.deck.scale.y = 0.1;
                    $scope.deck.width = 50;
                    $scope.deck.x = 300;
                    $scope.deck.y = 100;
                    $scope.stage.addChild($scope.deck);
                    $scope.cash = new PIXI.Text("" + $scope.playerCash + ' $', {
                        background: 'red',
                        fontFamily: "Arial",
                        fontSize: 25,
                        dropShadow: true,
                        dropShadowBlur: 7,
                        dropShadowColor: '#d9cb32',
                        dropShadowAngle: 15,
                        dropShadowDistance: 0
                    });
                    $scope.cash.buttonMode = true;
                    $scope.cash.anchor.set(0.5);
                    $scope.cash.x = 50;
                    $scope.cash.y = 370;
                    $scope.cash.style.fontWeight = '300';
                    $scope.stage.addChild($scope.cash);
                    function coin(item, x, y, bet, coinX, coinY) {
                        item.x = x;
                        item.y = y;
                        $scope.playerCash >= bet ? item.alpha = 1 : item.alpha = 0.5;
                        $scope.playerCash >= bet ? item.interactive = true : item.interactive = false;
                        item.buttonMode = true;
                        item.on('mouseover', function () {
                            TweenMax.to(item, 0.1, {scaleX: 1.1, scaleY: 1.1});
                        });
                        item.on('mouseout', function () {
                            TweenMax.to(item, 0.1, {scaleX: 1, scaleY: 1});
                        });
                        item.on('click', function () {
                            $scope.stage.removeChild($scope.coinsContainer);
                            $scope.currentDealBet = bet;
                            $scope.loadElements();
                        });
                        item.on('touchstart', function () {
                            $scope.stage.removeChild($scope.coinsContainer);
                            $scope.currentDealBet = bet;
                            $scope.loadElements();
                        });
                        let coin1Text = new PIXI.Text(bet + '', {
                            fontFamily: "Arial",
                            fontSize: 25,
                            dropShadow: true,
                            dropShadowBlur: 7,
                            dropShadowColor: '#d9cb32',
                            dropShadowAngle: 15,
                            dropShadowDistance: 0
                        });
                        coin1Text.anchor.set(0.5);
                        item.addChild(coin1Text);
                        let coin1 = PIXI.Sprite.fromImage('images/bitcoin.png')
                        coin1.scale.x = 0.4;
                        coin1.scale.y = 0.4;
                        coin1.x = coinX;
                        coin1.y = coinY;
                        item.addChild(coin1);
                        $scope.coinsContainer.addChild(item);
                    }
                    $scope.coinsContainer = new PIXI.Container();
                    $scope.coin1Container = new PIXI.Container();
                    coin($scope.coin1Container, 175, 100, 25, 30, -20);
                    $scope.coin2Container = new PIXI.Container();
                    coin($scope.coin2Container, 175, 175, 50, 30, -20);
                    $scope.coin3Container = new PIXI.Container();
                    coin($scope.coin3Container, 175, 250, 100, 30, -20);
                    $scope.stage.addChild($scope.coinsContainer);
                    renderer.render($scope.stage);
                    $scope.pause = false;
                    animationLoop();
                };
                $scope.getRandomCard = function () {
                    let availableCard = false;
                    while (!availableCard) {
                        let card = Math.floor(Math.random() * (14 - 2 + 1)) + 2;
                        let cardSuit = Math.floor(Math.random() * 4) + 1;
                        switch (card) {
                            case 11:
                                card = 'J';
                                break;
                            case 12:
                                card = 'Q';
                                break;
                            case 13:
                                card = 'K';
                                break;
                            case 14:
                                card = 'A';
                                break;
                            default:
                                break;
                        }
                        switch (cardSuit) {
                            case 1:
                                cardSuit = 'H';
                                break;
                            case 2:
                                cardSuit = 'S';
                                break;
                            case 3:
                                cardSuit = 'C';
                                break;
                            case 4:
                                cardSuit = 'D';
                                break;
                            default:
                                break;
                        }
                        let result = card + cardSuit;
                        if ($scope.cardsInPlay.indexOf(result) === -1) {
                            $scope.cardsInPlay.push(result);
                            availableCard = true;
                            return  result;
                        }
                    }
                };
                $scope.loadCards = function () {
                    for (let i = 2; i <= 14; i++) {
                        for (let j = 1; j <= 4; j++) {
                            let card = i;
                            let cardSuit = j;
                            switch (card) {
                                case 11:
                                    card = 'J';
                                    break;
                                case 12:
                                    card = 'Q';
                                    break;
                                case 13:
                                    card = 'K';
                                    break;
                                case 14:
                                    card = 'A';
                                    break;
                                default:
                                    break;
                            }

                            switch (cardSuit) {
                                case 1:
                                    cardSuit = 'H';
                                    break;
                                case 2:
                                    cardSuit = 'S';
                                    break;
                                case 3:
                                    cardSuit = 'C';
                                    break;
                                case 4:
                                    cardSuit = 'D';
                                    break;
                                default:
                                    break;
                            }
                            let texture = PIXI.Sprite.fromImage('images/card-deck/' + card + cardSuit + '.png');
                            texture.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                            let x = 'images/card-deck/' + card + cardSuit + '.png';
                            $scope.loader.add(x);
                        }
                    }
                    $scope.loader.add('images/card-deck/yellow_back.png');
                };
                $scope.calculateScore = function () {
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    let currentValue = 0;
                    let aces = [];
                    for (let x of $scope.playerHand) {
                        if (x.substring(0, 1) === 'A') {
                            aces.push(x);
                        } else if (x.substring(0, 1) === 'J' || x.substring(0, 1) === 'Q' || x.substring(0, 1) === 'K' || x.substring(0, 1) === '1') {
                            currentValue += 10;
                        } else {
                            currentValue += Number(x.substring(0, 1));
                        }
                    }
                    for (let ace of aces) {
                        if (currentValue + 11 > 21) {
                            currentValue += 1;
                        } else {
                            currentValue += 11;
                        }
                    }
                    $scope.playerScore = currentValue;
                    $scope.displayPlayerScore.text = '' + $scope.playerScore;
                    if ($scope.playerScore > 21) {
                        $scope.dealFinished('lost');
                        return;
                    }
                    if ($scope.playerHand.length > 2) {
                        $scope.hitCard.interactive = true;
                        $scope.stand.interactive = true;
                    }
                };
                $scope.calculateOpponentScore = function () {
                    let currentValue = 0;
                    let aces = [];
                    for (let x of $scope.opponentHand) {
                        if (x.substring(0, 1) === 'A') {
                            aces.push(x);
                        } else if (x.substring(0, 1) === 'J' || x.substring(0, 1) === 'Q' || x.substring(0, 1) === 'K' || x.substring(0, 1) === '1') {
                            currentValue += 10;
                        } else {
                            currentValue += Number(x.substring(0, 1));
                        }
                    }
                    for (let a of aces) {
                        if (currentValue + 11 > 21) {
                            currentValue += 1;
                        } else {
                            currentValue += 11;
                        }
                    }
                    $scope.opponentScore = currentValue;
                    $scope.displayOpponentScore.text = '' + $scope.opponentScore;
                    if ($scope.opponentScore > 21) {
                        $scope.dealFinished('won');
                    } else if ($scope.opponentScore > $scope.playerScore && $scope.playerFolded) {
                        $scope.dealFinished('lost');
                    } else if ($scope.opponentScore === 21 && $scope.playerScore === 21) {
                        $scope.dealFinished('tie');
                    } else if ($scope.secondOpponentCardFlipped) {
                        $scope.opponentDrawCard();
                    } else if ($scope.secondOpponentCardFlipped && $scope.opponentScore === $scope.playerScore && $scope.playerFolded) {
                        $scope.opponentDrawCard();
                    }
                };

                $scope.drawCard = function () {
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    let newCard = $scope.getRandomCard();
                    let card = PIXI.Sprite.fromImage('images/card-deck/' + newCard + '.png');
                    card.scale.x = 0.1;
                    card.scale.y = 0.1;
                    card.alpha = 0;
                    let xPoint = 160 + (($scope.playerHand.length - 2) * 30);
                    card.x = 200;
                    card.y = 162.5;
                    $scope.playerHand.push(newCard);
                    $scope.stage.addChild(card);
                    let pl1 = new TimelineLite();
                    pl1
                            .to($scope.backForPlayerCard, 0, {alpha: 1, width: 50, x: 300, y: 100}, 0.0)
                            .to($scope.backForPlayerCard, 0.3, {width: 1, x: 300 - xPoint / 2, y: 162.5}, 0.0)
                            .to($scope.backForPlayerCard, 0, {alpha: 0}, 0.3)
                            .call(function () {
                            })
                            .to(card, 0, {alpha: 1, width: 1}, 0.3)
                            .to(card, 0.3, {width: 50, x: xPoint, y: 250, onComplete: function () {
                                    $scope.calculateScore(newCard);
                                }}, 0.3);
                };
                $scope.revealOpponentCards = function () {
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    $scope.flipCard1 = function () {
                        let opp1 = new TimelineLite();
                        opp1
                                .to($scope.backForOpponentCard, 0.3, {width: 1, x: 120, y: 50}, 0)
                                .to($scope.backForOpponentCard, 0, {alpha: 0}, 0.3)
                                .to($scope.opponentCard1, 0, {alpha: 1, width: 1, x: 120, y: 50}, 0)
                                .to($scope.opponentCard1, 0.3, {width: 50, x: 100, y: 50, onComplete: function () {
                                        $scope.calculateOpponentScore($scope.opponentHand[0]);
                                        $scope.flipCard2();
                                    }}, 0.3);
                    };
                    $scope.flipCard2 = function () {
                        let opp2 = new TimelineLite();
                        opp2
                                .to($scope.backForOpponentCard2, 0.3, {width: 1, x: 150, y: 50}, 0)
                                .to($scope.backForOpponentCard2, 0, {alpha: 0}, 0.3)
                                .to($scope.opponentCard2, 0, {alpha: 1, width: 1, x: 150, y: 50}, 0)
                                .to($scope.opponentCard2, 0.3, {width: 50, x: 130, y: 50, onComplete: function () {
                                        $scope.secondOpponentCardFlipped = true;
                                        $scope.calculateOpponentScore($scope.opponentHand[1]);
                                    }}, 0.3);
                    }
                    switch ($scope.gameSettings.cards.value) {
                        case '0':
                            $scope.flipCard1();
                            break;
                        case '1':
                            $scope.calculateOpponentScore($scope.opponentHand[0]);
                            $scope.flipCard2();
                            break;
                        case '2':
                            $scope.opponentDrawCard();
                            break;
                    }
                };
                $scope.opponentDrawCard = function () {
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    let newCard = $scope.getRandomCard();
                    let card = PIXI.Sprite.fromImage('images/card-deck/' + newCard + '.png');
                    card.scale.x = 0.1;
                    card.scale.y = 0.1;
                    card.alpha = 0;
                    let xPoint = 160 + (($scope.opponentHand.length - 2) * 30);
                    card.x = 200;
                    card.y = 75;
                    $scope.opponentHand.push(newCard);
                    $scope.stage.addChild(card);
                    let pl1 = new TimelineLite();
                    pl1
                            .to($scope.backForOpponentCard, 0, {alpha: 1, width: 50, x: 300, y: 100}, 0.0)
                            .to($scope.backForOpponentCard, 0.3, {width: 1, x: 300 - xPoint / 2, y: 75}, 0.0)
                            .to($scope.backForOpponentCard, 0, {alpha: 0}, 0.3)
                            .call(function () {
                            })
                            .to(card, 0, {alpha: 1, width: 1}, 0.3)
                            .to(card, 0.3, {width: 50, x: xPoint, y: 50, onComplete: function () {
                                    $scope.calculateOpponentScore(newCard);
                                }}, 0.3);
                };
                $scope.dealFinished = function (deal) {
                    $scope.hitCard.interactive = false;
                    $scope.stand.interactive = false;
                    let message;
                    switch (deal) {
                        case 'won':
                            message = 'You win';
                            $scope.playerCash += $scope.currentDealBet * 2;
                            break;
                        case 'lost':
                            message = 'You lose';
                            break;
                        case 'tie':
                            message = 'Tie';
                            $scope.playerCash += $scope.currentDealBet;
                            break;
                    }
                    $scope.cash.text = ("" + $scope.playerCash + ' $');
                    $scope.dealFinishedMessage = new PIXI.Text("" + message, {fontFamily: "Arial", fontSize: 35});
                    $scope.dealFinishedMessage.position.set(120, 185);
                    $scope.dealFinishedMessage.style.fill = ['red'];
                    $scope.dealFinishedMessage.style.fontWeight = '900';
                    $scope.stage.addChild($scope.dealFinishedMessage);
                    let m = new TimelineLite();
                    m.to($scope.dealFinishedMessage, 2, {alpha: 0}, 1.0);
                    $timeout(function () {
                        while ($scope.stage.children[0]) {
                            $scope.stage.removeChild($scope.stage.children[0]);
                        }
                        renderer.render($scope.stage);
                        $scope.resetForNewDeal();
                    }, 2000);
                };
                $scope.resetForNewDeal = function () {
                    $scope.playerScore = 0;
                    $scope.opponentScore = 0;
                    $scope.cardsInPlay = [];
                    $scope.opponentHand = [];
                    $scope.playerHand = [];
                    $scope.playerFolded = false;
                    $scope.secondOpponentCardFlipped = false;
                    if ($scope.playerCash <= 0) {
                        $scope.gameOver();
                    } else if (!$scope.pause) {
                        $scope.nextGame();
                    }
                };
                $scope.gameOver = function () {
                    let background = PIXI.Texture.fromImage('images/card-table.jpg');
                    let  bg = new PIXI.extras.TilingSprite(background, 400, 400);
                    bg.position.x = 0;
                    bg.position.y = 0;
                    bg.tilePosition.x = 0;
                    bg.tilePosition.y = 0;
                    $scope.stage.addChild(bg);
                    let gameOver = new PIXI.Text('Game Over', {
                        fontFamily: "Arial",
                        fontSize: 40,
                        dropShadow: true,
                        dropShadowBlur: 7,
                        dropShadowColor: '#d9cb32',
                        dropShadowAngle: 15,
                        dropShadowDistance: 0
                    });
                    gameOver.anchor.set(0.5);
                    gameOver.x = 205;
                    gameOver.y = 200;
                    $scope.stage.addChild(gameOver);
                    renderer.render($scope.stage);
                    $timeout(function () {
                        $scope.pause = true;
                    }, 100);
                };
            });
})();







