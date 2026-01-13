const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const runButton = document.getElementById("runButton");

let score = 0;
let lives = 3;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const ballRadius = 10;
const colours = ["#d6b4e7", "#f59191", "#f0776c", "#eb4d4b", "#9954bb", "#727cf5", "#515365", "#4ecdc4", "#556270", "#ff6b6b"];
let ballColour = colours[Math.floor(Math.random() * colours.length)];

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let interval;

const brickRowCount = 5;
const brickColumnCount = 11;
const brickWidth = 30;
const brickHeight = 10;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const scoreColour = "#0095DD";
const livesColour = "#0095DD";
const paddleColour = "#0095DD";
const brickColour = "#0095DD";

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

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
                    dy = -dy;
                    b.status = 0;
                    score++;
                    randomiseBallColour();

                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();
    drawBricks();
    checkForWin();
}

function checkForWin(){
    if (score === brickRowCount * brickColumnCount) {
        alert("YOU WIN, CONGRATULATIONS!");
        document.location.reload();
        clearInterval(interval);
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColour;
    ctx.fill();
    ctx.closePath();
    if (y + dy < ballRadius) {
        dy = -dy;
        randomiseBallColour();
    } else if (y + dy > canvas.height - ballRadius) {
        lives--;
        if(lives === 0){
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        } else {
            dy = -dy;
            randomiseBallColour();
        }

    } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            randomiseBallColour();
        }
    }
    if (x + dx > canvas.width - ballRadius  || x + dx < ballRadius) {
        dx = -dx;
        randomiseBallColour();
    }
    x += dx;
    y += dy;
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

function startGame() {
    interval = setInterval(draw, 10);
}

function randomiseBallColour(){
    let newColour = colours[Math.floor(Math.random() * colours.length)];
    while(newColour === ballColour){
        newColour = colours[Math.floor(Math.random() * colours.length)];
    }
    ballColour = newColour;
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

runButton.addEventListener("click", () => {
    startGame();
    runButton.disabled = true;
});