//todo: add timer for food spawn
//todo: allow multiple food spawns at once
//todo: make bad food to shrink snake

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
let fps = 10;
let blockSize = 25;
let totalRows = 17;
let totalColumns = 17;

let score = 0;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speed = { x: 0, y: 0};

let snake = [];

let foodCoords = [];
let foodTimer = 0;
let lastFrameTime = Date.now();

let gameOver = false;
let changedDirection = false;
let playing = false;
let playerMoved = false;

const scoreColour = "#d6b4e7";

function startGame(){
    gameOver = false;
    playerMoved = false;
    score = 0;
    snake = [];
    speed = { x: 0, y: 0};
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    canvas.height = blockSize * totalRows;
    canvas.width = blockSize * totalColumns;
    foodCoords = [];
    placeFood();
    resetFoodTimer();
    document.addEventListener("keydown", changeDirection);
    if(!playing) {
        playing = true;
        console.log("starting game");
        draw();
    }
}

function draw(){
    if(gameOver || !playing) return;
    // Background of a Game
    if(snake.length === totalColumns * totalRows) {
        drawWinScreen();
        gameOver = true;
        return;
    }
    ctx.fillStyle = "#9744be";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawFood();
    checkForNewFood();
    drawSnake();
    handleGameOver();

    if(gameOver) {
        drawGameOver();
        return;
    }

    changedDirection = false;

    setTimeout( () =>
    {
        requestAnimationFrame(draw);
    }, 1000/fps)
}

function drawSnake(){
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i - 1];
    }
    if (snake.length) {
        snake[0] = [snakeX, snakeY];
    }

    ctx.fillStyle = "white";

    snakeX += speed.x * blockSize;
    snakeY += speed.y * blockSize;

    ctx.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0], snake[i][1], blockSize, blockSize);
    }
}

function drawFood(){
    ctx.fillStyle = "yellow";
    foodCoords.forEach(food => {
        ctx.fillRect(food.x, food.y, blockSize, blockSize);
        checkFoodEaten(food);
    });
}

function checkFoodEaten(food){
    if (snakeX === food.x && snakeY === food.y) {
        snake.push([food.x, food.y]);
        score++;
        foodCoords = foodCoords.filter(item => item !== food);
    }
}

function checkForNewFood(){
    if(!playerMoved){ lastFrameTime = Date.now(); return;}
    if(lastFrameTime + foodTimer >= Date.now() && foodCoords.length !== 0) return;
    placeFood();
    resetFoodTimer()
}

function endGame(){
    gameOver = true;
    playing = false;
}

function placeFood(){
    const newFood = {
        x: Math.floor(Math.random() * totalColumns) * blockSize,
        y: Math.floor(Math.random() * totalRows) * blockSize
    }

    while(snake.some(part => part[0] === foodCoords.x && part[1] === foodCoords.y)) {
        newFood.x =  Math.floor(Math.random() * totalColumns) * blockSize;
        newFood.y = Math.floor(Math.random() * totalRows) * blockSize;
    }
    foodCoords.push(newFood);
}

function changeDirection(e){
    if(changedDirection) return;
    if(!playerMoved) playerMoved = true;

    switch(e.code){
        case "ArrowUp":
            if(speed.y === 1) return;
            speed.y = -1;
            speed.x = 0;
            break;
        case "ArrowDown":
            if(speed.y === -1) return;
            speed.y = 1;
            speed.x = 0;
            break;
        case "ArrowLeft":
            if(speed.x === 1) return;
            speed.y = 0;
            speed.x = -1;
            break;
        case "ArrowRight":
            if(speed.x === -1) return;
            speed.y = 0;
            speed.x = 1;
            break;
        default:
            break;
    }

    changedDirection = true;
}

function handleGameOver(){
    if (snakeX < 0
        || snakeX >= totalColumns * blockSize
        || snakeY < 0
        || snakeY >= totalRows * blockSize) {
        endGame();
    }

    for (let i = 0; i < snake.length; i++) {
        if (snakeX === snake[i][0] && snakeY === snake[i][1]) {
            endGame();
        }
    }
}

easyButton.addEventListener("click", () => {
    fps = 8 + addBonusSpeed();
    blockSize = 25;
    totalRows = 17;
    totalColumns = 17;
    startGame();
});

mediumButton.addEventListener("click", () => {
    fps = 12 + addBonusSpeed();
    blockSize = 25;
    totalRows = 21;
    totalColumns = 21;
    startGame();
})

hardButton.addEventListener("click", () => {
    fps = 16 + addBonusSpeed();
    blockSize = 25;
    totalRows = 25;
    totalColumns = 25;
    startGame();
})


function addBonusSpeed(){
    return unlocks.snakeMoreSpeed ? 4 : 0;
}

function addBonusFood(){
    return unlocks.snakeMoreFood ? 2000 : 0;
}

function resetFoodTimer(){
    console.log("resetting food timer: " + foodTimer);
    lastFrameTime = Date.now();
    foodTimer = Math.floor(Math.random() * 4000 - addBonusFood() ) + 500 ;
}

function drawGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playing = false;
    ctx.font = "32px Arial";
    ctx.fillStyle = scoreColour;
    ctx.fillText(`Game Over!`, 125, 120);

    ctx.fillText(`Score: ${score}`, 150, 200);
    console.log("game over");
}

function drawWinScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playing = false;
    ctx.font = "32px Arial";
    ctx.fillStyle = scoreColour;
    ctx.fillText(`You Win!`, 145, 120);
    ctx.fillText(`Score: ${score}`, 140, 200);
}