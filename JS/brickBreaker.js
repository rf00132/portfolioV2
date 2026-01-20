const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");

let score = 0;
let bricksBroken = 0;
let lives = 3;
let ballRadius = 10;
const paddleHeight = 10;
let paddleWidth = 75;
const basePaddleWidth = 75;
let bonusPaddleWidth = 0;

let x = canvas.width / 2;
let y = canvas.height - ballRadius - paddleHeight;
let dx = 2;
let dy = 2;
let bonusDx = 0;
let bonusDy = 0;

let trueDx = -1;
let trueDy = 0;

const colours = ["#d6b4e7", "#f59191", "#f0776c", "#eb4d4b", "#9954bb", "#727cf5", "#515365", "#4ecdc4", "#556270", "#ff6b6b"];
let ballColour = "#d6b4e7";


let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let playing = false;
let stopped = false;

let powerUpTimer = Math.floor(Math.random() * 10000);
let lastFrameTime = Date.now();
let resetPowerup = false;

let powerUpType = Math.floor(Math.random() * 4);

let randomise = false;

let brickRowCount = 5;
let brickColumnCount = 11;
let brickWidth = 30;
let brickHeight = 10;
let brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const scoreColour = "#d6b4e7";
const livesColour = "#d6b4e7";
const paddleColour = "#d6b4e7";
const brickColour = "#d6b4e7";

const bricks = [];


function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    trueDy = -trueDy;
                    b.status = 0;
                    score++;
                    bricksBroken++;
                    randomiseBallColour();

                }
            }
        }
    }
}

function draw() {
    if(!playing) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    if(lives <= 0) return;
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    drawBricks();
    drawPowerup();
    checkForWin();
    if(stopped) return;
    requestAnimationFrame(draw);
}

function checkForWin(){
    if (bricksBroken === brickRowCount * brickColumnCount) {
        drawWinScreen();
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
    if (y + trueDy < ballRadius) {
        trueDy = -trueDy;
        randomiseBallColour();
    } else if (y + trueDy > canvas.height - ballRadius) {
        lives--;
        if(lives <= 0){
            drawGameOver();
            return;
        } else {
            trueDy = -trueDy;
            randomiseBallColour();
        }

    } else if (y + trueDy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            trueDy = -trueDy;
            randomiseBallColour();
        }
    }
    if (x + trueDx > canvas.width - ballRadius  || x + trueDx < ballRadius) {
        trueDx = -trueDx;
        randomiseBallColour();
    }
    x += trueDx;
    y += trueDy;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColour;
    ctx.fill();
    ctx.closePath();

    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColour;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = scoreColour;
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = livesColour;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playing = false;
    ctx.font = "32px Arial";
    ctx.fillStyle = scoreColour;
    ctx.fillText(`Game Over!`, 155, 120);

    ctx.fillText(`Score: ${score}`, 175, 200);
}

function drawWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playing = false;
    ctx.font = "32px Arial";
    ctx.fillStyle = scoreColour;
    ctx.fillText(`You Win!`, 170, 120);
    ctx.fillText(`Score: ${score}`, 165, 200);
}

function drawPowerup(){
    const plusSize = 10;
    const lineWidth = 4;
    let colour = "#FFD700";
    switch (powerUpType) {
        case 0:
            colour = "#FFD700";
            break;
        case 1:
            colour = "#B1005D";
            break;
        case 2:
            colour = "#DE00E4";
            break;
        case 3:
            colour = "#E46C00";
            break;
    }

    if (!canvas.powerup || resetPowerup) {
        canvas.powerup = {
            x: Math.random() * (canvas.width - plusSize * 2) + plusSize,
            y: 0,
            width: plusSize * 2,
            height: plusSize * 2,
            active: true,
            speed: 1
        };
        resetPowerup = false;
    }

    if(!canvas.powerup.active && lastFrameTime + powerUpTimer < Date.now()){
        lastFrameTime = Date.now();
        resetPowerUpTimer();
        resetPowerup = true;
        powerUpType = Math.floor(Math.random() * 4);
    }

    if (!canvas.powerup.active) return;

    ctx.strokeStyle = colour; // Gold color
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(canvas.powerup.x - plusSize, canvas.powerup.y);
    ctx.lineTo(canvas.powerup.x + plusSize, canvas.powerup.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.powerup.x, canvas.powerup.y - plusSize);
    ctx.lineTo(canvas.powerup.x, canvas.powerup.y + plusSize);
    ctx.stroke();

    canvas.powerup.y += canvas.powerup.speed;

    if (canvas.powerup.y > canvas.height) {
        canvas.powerup.active = false;
        resetPowerUpTimer();
    }

    if (
        canvas.powerup.x > paddleX &&
        canvas.powerup.x < paddleX + paddleWidth &&
        canvas.powerup.y > canvas.height - paddleHeight - 20 &&
        canvas.powerup.y < canvas.height - paddleHeight
    ) {
        canvas.powerup.active = false;

        switch (powerUpType) {
            case 0:
                score += 10;
                if(bonusPaddleWidth !== 0){
                    bonusPaddleWidth = 0;
                    changePaddleWidth()
                }
                if(bonusDx !== 0 || bonusDy !== 0){
                    clearSpeed();
                }
                break;
            case 1:
                lives++;
                if(bonusPaddleWidth !== 0){
                    bonusPaddleWidth = 0;
                    changePaddleWidth()
                }
                if(bonusDx !== 0 || bonusDy !== 0){
                    clearSpeed();
                }
                break;
            case 2:
                bonusPaddleWidth = 10;
                changePaddleWidth()
                if(bonusDx !== 0 || bonusDy !== 0){
                    clearSpeed();
                }
                break;
            case 3:
                bonusDx = 0.5;
                bonusDy = 0.5;

                setSpeed();

                if(bonusPaddleWidth !== 0){
                    bonusPaddleWidth = 0;
                    changePaddleWidth()
                }
                break;
        }


        resetPowerUpTimer();
    }
}

function resetPowerUpTimer(){
    powerUpTimer = Math.floor(Math.random() * 7000 - addBonusPowerups()) + 3000;
}

function setSpeed(){
    trueDx = (trueDx >= 0 ? dx + bonusDx : -1 * (dx + bonusDx));
    trueDy = (trueDy >= 0 ? dy + bonusDy : -1*(dy + bonusDy));
}

function clearSpeed(){
    bonusDx = 0;
    bonusDy = 0;
    setSpeed();
}

function changePaddleWidth(){
    paddleWidth = basePaddleWidth + bonusPaddleWidth;
}

function randomiseBallColour(){
    if(!randomise) return;
    let newColour = colours[Math.floor(Math.random() * colours.length)];
    while(newColour === ballColour){
        newColour = colours[Math.floor(Math.random() * colours.length)];
    }
    ballColour = newColour;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = Math.max(0, Math.min(relativeX - paddleWidth / 2, canvas.width - paddleWidth));
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

easyButton.addEventListener("click", () => {
    lives = 3 + addBonusLives();
    ballRadius = 10;
    dx = 0.75;
    dy = 0.75;
    brickRowCount = 2;
    brickColumnCount = 7;
    brickWidth = 50;
    brickHeight = 20;
    brickPadding = 10;
    startGame();
});


mediumButton.addEventListener("click", () => {
    lives = 3 + addBonusLives();
    ballRadius = 7.5;
    dx = 1.25;
    dy = 1.25;
    brickRowCount = 4;
    brickColumnCount = 9;
    brickWidth = 40;
    brickHeight = 15;
    brickPadding = 8;
    startGame();
})

hardButton.addEventListener("click", () => {
    lives = 3 + addBonusLives();
    ballRadius = 5;
    dx = 1.5;
    dy = 1.5;
    brickRowCount = 6;
    brickColumnCount = 12;
    brickWidth = 30;
    brickHeight = 10;
    brickPadding = 6;
    startGame();
})

function startGame(){
    stopped = true;
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    trueDx = 0;
    trueDy = -1;
    clearSpeed();
    stopped = false;
    if (!playing) {
        playing = true;
        draw();
    } else {
        playing = true;
    }
    /*
    easyButton.disabled = true;
    mediumButton.disabled = true;
    hardButton.disabled = true;
    */

    playing = true;
    stopped = false;

    bricksBroken = 0;
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - ballRadius - paddleHeight;
}

function addBonusLives(){
    return unlocks.bbMoreLives ? 2: 0;
}

function addBonusPowerups() {
    return unlocks.bbMorePowerups ? 3000 : 0;
}