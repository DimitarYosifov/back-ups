
(function () {
    let app = angular.module('app', ['ui.router', 'ngSanitize'])
            .controller('MainController', function ($scope, $http, $window, $state, $timeout) {
                $scope.keyboardEvent = function (e) {

                    $scope.$broadcast('keyboardEvent', {keyPressed: e.which})

//                    console.log(e.which)
                };
                $scope.keyboardEventEnd = function (e) {

                    $scope.$broadcast('keyboardEventEnd', {keyPressed: e.which})

//                    console.log(e.which)
                    
                };








//
//                let renderer = PIXI.autoDetectRenderer(400, 640, {
//                    transparent: true,
//                    resolution: 1,
//                });
//
//                gameWindow = document.getElementById('gameWindow')
//                gameWindow.appendChild(renderer.view)
//                let stage = new PIXI.Container();
//                let loader = PIXI.loader
//                loader.add('spriteSheet', 'images/pixiAssets-hd.json')
//                loader.load(setup);
//
////let hero;
////let moveUp = false;
////let normalRun = [];
////let flyUp = [];
////let dead = [];
////let obstacles = [];
////let obstacle;
////let isHeroAlive = true;
////let displayScore;
////let score = 0
////let upperHeroBodyHit;
////
//function setup() {
//    
//    
//    
//    
//    
////    let inter = setInterval(function () {
////        obstacle = {
////            src: PIXI.Sprite.fromImage('images/box.png'),
////            speed: Math.floor((Math.random() * 10) + 5)
////        };
////        obstacle.src.x = 1300;
////        obstacle.src.y = Math.floor((Math.random() * 450) + 1);
////        obstacles.push(obstacle);
////        stage.addChild(obstacle.src);
////        stage.setChildIndex(obstacle.src, 1)
////    }, 1500);
////
////    addBackground();
////    addScore();
////
////    for (let i = 1; i <= 9; i++) {
////        let current = PIXI.Texture.fromFrame('characterRUNscaled_0' + i + '.png');
////        normalRun.push(current)
////    }
////
////    for (let j = 1; j <= 3; j++) {
////        let current = PIXI.Texture.fromFrame('characterFLATflying_0' + j + '.png');
////        flyUp.push(current)
////    }
////
////    for (let k = 1; k <= 3; k++) {
////        let current = PIXI.Texture.fromFrame('characterFALLscaled' + k + '.png');
////        dead.push(current)
////    }
////
////    hero = new PIXI.extras.AnimatedSprite(normalRun)
////    hero.interactive = true;
////    gameWindow.interactive = true;
////    attachMouseEvent();
////    hero.rotation -= 0.2;
////    hero.y = 200;
////    hero.x = 50;
////    hero.animationSpeed = 0.2;
////    stage.addChild(hero);
////    animationLoop();
//}
////
////function attachMouseEvent() {
////
////    document.getElementById('gameWindow').addEventListener('mousedown', function () {
////            let currentY = hero.y;
////            stage.removeChild(hero);
////            hero = new PIXI.extras.AnimatedSprite(flyUp);
////            hero.y = currentY;
////            hero.x = 50;
////            hero.animationSpeed = 0.5;
////            moveUp = true;
////            stage.addChild(hero);
////        }
////    );
////
////    document.getElementById('gameWindow').addEventListener('mouseup', function () {
////        let currentY = hero.y;
////        stage.removeChild(hero);
////        hero = new PIXI.extras.AnimatedSprite(normalRun);
////        hero.y = currentY;
////        hero.x = 50;
////        hero.animationSpeed = 0.2;
////        hero.rotation -= 0.2;
////        moveUp = false;
////        stage.addChild(hero);
////    })
////}
////
////function animationLoop() {
////    hero.play();
////
////    if (isHeroAlive) {
////        bg.tilePosition.x -= 5;
////
////        if (moveUp) {
////            hero.y -= 8
////        }
////
////        else {
////            hero.y += 2
////        }
////
////        if (hero.y < 0) {
////            upperHeroBodyHit = 'ceiling';
////            collision()
////        }
////
////        else if (hero.y > 640 - hero.height) {
////            upperHeroBodyHit = 'floor';
////            collision()
////        }
////
////    }
////
////    else {
////        spinningWhenDead()
////    }
////
////    for (let i = 0; i < obstacles.length; i++) {
////
////        let topY = obstacles[i].src.y;
////        let bottomY = obstacles[i].src.y + obstacles[i].src.height;
////
////        if (obstacles[i].src.x <= -160 && isHeroAlive) {
////            score++;
////            displayScore.text = "Score " + score;
////            obstacles.splice(i, 1)
////        }
////
////        if (obstacles[i].src.x <= hero.x + hero.width - 25 && topY + 20 <= hero.y + hero.height && hero.y < obstacles[i].src.y && isHeroAlive) {
////            collision();
////            upperHeroBodyHit = 'upperBody'
////        }
////        if (obstacles[i].src.x <= hero.x + hero.width - 25 && bottomY - 20 >= hero.y && hero.y > obstacles[i].src.y && isHeroAlive) {
////            collision();
////            upperHeroBodyHit = 'lowerBody'
////        }
////
////        obstacles[i].src.x -= obstacles[i].speed
////    }
////    renderer.render(stage);
////    requestAnimationFrame(animationLoop)
////}
////
////function collision() {
////    let old = document.getElementById('gameWindow');
////    let clone = old.cloneNode();
////
////    while (old.firstChild) {
////        clone.appendChild(old.lastChild);
////    }
////    old.parentNode.replaceChild(clone, old);
////
////    isHeroAlive = false;
////    let currentY = hero.y;
////    stage.removeChild(hero);
////    hero = new PIXI.extras.AnimatedSprite(dead);
////    hero.y = currentY;
////    hero.x = 80;
////    hero.animationSpeed = 0.1;
////    moveUp = false;
////    stage.addChild(hero);
////
////    let button = new PIXI.Text("Start Again?", {
////            background: 'red',
////            fontFamily: "Arial",
////            fontSize: 72,
////            dropShadow: true,
////            dropShadowBlur: 25,
////            dropShadowColor: 'black',
////            dropShadowAngle: 10,
////            dropShadowDistance: 0,
////        }
////    );
////    button.buttonMode = true;
////    button.anchor.set(0.5);
////    button.x = 643;
////    button.y = 320;
////    button.style.fill = ['yellow', 'orange', 'red'];
////    button.style.fillGradientType = PIXI.TEXT_GRADIENT.LINEAR_VERTICAL;
////    button.style.fillGradientStops = [0.3, 0.4, 0.8];
////    button.style.fontWeight = '900';
////    button.interactive = true;
////    button.buttonMode = true;
////    button.on('mouseup', function () {
////        startAgain()
////    });
////
////    stage.addChild(button);
////    stage.setChildIndex(button, 2)
////}
////
////function addBackground() {
////    background = PIXI.Texture.fromImage('images/tile.jpg');
////    bg = new PIXI.extras.TilingSprite(background, 1286, 640);
////    bg.position.x = 0;
////    bg.position.y = 0;
////    bg.tilePosition.x = 0;
////    bg.tilePosition.y = 0;
////    stage.addChild(bg);
////}
////
////function addScore() {
////    displayScore = new PIXI.Text(
////        "Score " + score,
////        {fontFamily: "Arial", fontSize: 36}
////    );
////    displayScore.position.set(1100, 10);
////    displayScore.style.fill = ['orange', 'red', 'orange'];
////    displayScore.style.fillGradientType = PIXI.TEXT_GRADIENT.LINEAR_VERTICAL;
////    displayScore.style.fillGradientStops = [0.1, 0.4, 1.0];
////    displayScore.style.fontWeight = '900';
////    stage.addChild(displayScore);
////}
////
////function startAgain() {
////    isHeroAlive = true;
////    stage.removeChild(hero);
////
////    for (let i = stage.children.length - 1; i >= 0; i--) {
////        stage.removeChild(stage.children[i]);
////    }
////
////    hero = new PIXI.extras.AnimatedSprite(normalRun);
////    hero.animationSpeed = 0.2;
////    hero.rotation -= 0.2;
////    score = 0;
////    attachMouseEvent();
////    obstacles.length = 0;
////    hero.y = 200;
////    hero.x = 50;
////    addBackground();
////    addScore();
////    stage.addChild(hero);
////}
////
////function spinningWhenDead() {
////    hero.anchor.set(0.5, 0.5);
////    if (upperHeroBodyHit === 'upperBody') {
////        hero.rotation += 0.02;
////        hero.x += 5;
////        hero.y -= 0.5
////    }
////    else if (upperHeroBodyHit === 'lowerBody') {
////        hero.rotation -= 0.02;
////        hero.x += 5;
////        hero.y += 0.5
////    }
////    else if (upperHeroBodyHit === 'ceiling') {
////        hero.rotation -= 0.02;
////        hero.x += 3;
////        hero.y += 7
////    }
////    else if (upperHeroBodyHit === 'floor') {
////        hero.rotation -= 0.02;
////        hero.x += 3;
////        hero.y -= 7
////    }
////}
////        
////        

























            });
})();







