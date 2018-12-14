let canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let imgId = "BattleShip";
let BallNumber = 23;
let Game = "continue";
let Time = 0;
let timeFrame;
let Planet = createPlanetImg();
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SHIPTOP = 70;
const SHIPLEFT = 70;
const SHIPSIZE = 64;
//Main program
let objectList = [];
let interval;
createBalls(objectList, BallNumber);
//pickEmptySpace();
let battleShip = createShip(SHIPTOP, SHIPLEFT, SHIPSIZE, imgId);
battleShip.moveOnKeyDown();
animate(objectList);

//Tạo số lượng bóng random
function createBalls(objectList, numberOfBalls) {
    let ColorList = ["red", "blue", "green", "orange", "yellow", "brown", "pink", "tan"];
    let leftAcc = 0;
    let topAcc = 0;
    let left, top, radius, color;
    for (let i = 0; i < numberOfBalls; i++) {
        do {
            radius = getRandom(10, 30);
            left = getRandom(WIDTH / 5 + radius, WIDTH - radius);
            top = getRandom(HEIGHT / 5 + radius, HEIGHT - radius);
            color = ColorList[getRandom(0, 7)];
            leftAcc = getRandom(-4, 4);
            topAcc = getRandom(-4, 4);
        } while (((leftAcc == 0) & (topAcc == 0)) || (ifCollideAnyObject(left, top, radius, objectList)));
        let ball = new Ball(left, top, radius, color, leftAcc, topAcc, Planet[i % 6]);
        objectList.push(ball);
    }
}

//Tạo tàu chiến
function createShip(left, top, size, imgId) {
    let ship = new Ship(left, top, size, imgId);
    objectList.push(ship);
    return objectList[objectList.length - 1];
}

//Lấy ngẫu nhiên
function getRandom(low, high) {
    let result = Math.floor(Math.random() * (high - low) + low);
    return result;
}

//Chuyển động
function animate(objectList) {
    timeFrame = 20;
    interval = setInterval(function () {
        render(objectList)
    }, timeFrame);
}

//Vẽ hình
function render(objectList) {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let element of objectList) {
        element.randomMove();
        element.draw();
    }
    collisionEffect();
    displayScoreAndLife();
    Time += timeFrame / 1000;
}

//Kiểm tra va chạm
function checkCollision(objA, objB) {
    let Atop, Aleft, distance, centerDistance;
    if (objA.type != "ship") {
        Atop = objA.top;
        Aleft = objA.left;
    } else {
        Atop = objA.topCenter;
        Aleft = objA.leftCenter;
    }
    if ((Atop != objB.top) && (Aleft != objB.left)) {
        distance = Math.pow(Atop - objB.top, 2) + Math.pow(Aleft - objB.left, 2);
        centerDistance = Math.pow(objA.radius + objB.radius, 2);
        if (distance < centerDistance) {
            return true;
        }
    }
    return false;
}

function ifCollideAnyObject(left, top, radius, objectList) {
    let objA = new Ball(left, top, radius, "black", 2, 2);
    for (let objB in objectList) {
        if (checkCollision(objA, objB) == true) {
            return true;
        }
    }
    return false;
}
//Chọn chỗ trống để đặt tàu
/*function pickEmptySpace() {
    let radius = 60;
    let left,top;
    do {
    left = getRandom(0+radius, WIDTH-radius);
    top = getRandom(0+radius, HEIGHT-radius);
    } while (ifCollideAnyObject(left,top,radius,objectList)==true);
    SHIPTOP = top;
    SHIPLEFT = left;
} */

//Game over
function gameOver() {
    clearInterval(interval);
    let ctx = canvas.getContext("2d");
    ctx.font = "50px Orbitron";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", WIDTH / 2 - 160, HEIGHT / 2);
    ctx.fillText("Press ENTER to restart", WIDTH / 2 - 160, HEIGHT / 2 + 40);
    $(document).keydown(function (event) {
        if (event.which == 13) {
            location.reload();
        }
    })
}
//Won the game
function wonTheGame() {
    clearInterval(interval);
    let ctx = canvas.getContext("2d");
    ctx.font = "50px Orbitron";
    ctx.fillStyle = "white";
    ctx.fillText("CONGRATULATION! YOU WON!", WIDTH / 2 - 160, HEIGHT / 2);
    ctx.fillText("Press ENTER to restart", WIDTH / 2 - 160, HEIGHT / 2 + 40);
    $(document).keydown(function (event) {
        if (event.which == 13) {
            location.reload();
        }
    })
}

//Tính điểm
function displayScoreAndLife() {
    let ctx = canvas.getContext("2d");
    ctx.font = "20px Orbitron";
    ctx.fillStyle = "yellow";
    ctx.fillText("Life: " + "♥".repeat(battleShip.life), 30, 30);
    ctx.fillText("Score: " + battleShip.score, 30, 50);
    ctx.fillText("Press A and S to fire", 30, 70);

}

function createPlanetImg() {
    let arr = [];
    let c;
    for (let i = 1; i <= 6; i++) {
        c = document.getElementById("Planet" + i);
        arr.push(c);
    }
    return arr;
}


function collisionEffect() {
    let distance, l, t;
    for (let i = 0; i < objectList.length; i++) {
        source = objectList[i];
        if (source.type != "ball") {
            continue;
        }
        for (let j = i + 1; j < objectList.length; j++) {
            target = objectList[j];
            if (checkCollision(target, source) == true) {
                if (target.type == "ball") {
                    l = source.leftAcc;
                    t = source.topAcc;
                    source.leftAcc = target.leftAcc;
                    source.topAcc = target.topAcc;
                    target.topAcc = t;
                    target.leftAcc = l;
                    while (checkCollision(target, source)) {
                        source.move();
                        target.move();
                    }
                } else if (target.type == "ship") {
                    target.life -= 1;
                    target.score += 1;
                    source.removeSelf();
                    //Tạo vụ nổ
                    let explosion = new Explosion(source.left - source.radius, source.top - source.radius, source.radius * 2);
                    objectList.push(explosion);
                    //Game over
                    if (target.life == 0) {
                        gameOver();
                    }
                    if (battleShip.score >= (BallNumber - 1)) {
                        wonTheGame();
                    }
                } else if ((target.type == "bullet")||(target.type == "rocket")) {
                    source.removeSelf();
                    target.removeSelf();
                    //Tạo vụ nổ
                    let explosion = new Explosion(source.left - source.radius, source.top - source.radius, source.radius * 2);
                    objectList.push(explosion);
                    //Tihs điểm
                    battleShip.score += 1;
                    if (battleShip.score >= (BallNumber - 1)) {
                        wonTheGame();
                    }
                }
            }
        }
    }


}