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

let foodCoords = { x: 0, y: 0 };

let gameOver = false;
let changedDirection = false;
let playing = false;

function startGame(){
    gameOver = false;
    score = 0;
    snake = [];
    nextSpeed = { x: 0, y: 0};
    speed = { x: 0, y: 0};
    lastSpeed = { x: 0, y: 0};
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    canvas.height = blockSize * totalRows;
    canvas.width = blockSize * totalColumns;
    placeFood();
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
    ctx.fillStyle = "#9744be";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set food color and position
    ctx.fillStyle = "yellow";
    ctx.fillRect(foodCoords.x, foodCoords.y, blockSize, blockSize);

    if (snakeX === foodCoords.x && snakeY === foodCoords.y) {
        snake.push([foodCoords.x, foodCoords.y]);
        score++;
        placeFood();
    }

    // body of snake will grow
    for (let i = snake.length - 1; i > 0; i--) {
        // it will store previous part of snake to the current part
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

    changedDirection = false;
    setTimeout( () =>
    {
        requestAnimationFrame(draw);
    }, 1000/fps)
}

function endGame(){
    gameOver = true;
    playing = false;
    alert("Game Over");
}

function placeFood(){
    while(snake.some(part => part[0] === foodCoords.x && part[1] === foodCoords.y)){
        foodCoords = {
            x: Math.floor(Math.random() * totalColumns) * blockSize,
            y: Math.floor(Math.random() * totalRows) * blockSize
        }
    }
}

function changeDirection(e){
    if(changedDirection) return;

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

easyButton.addEventListener("click", () => {
    fps = 10;
    blockSize = 25;
    totalRows = 17;
    totalColumns = 17;
    startGame();
});

mediumButton.addEventListener("click", () => {
    fps = 15;
    blockSize = 25;
    totalRows = 21;
    totalColumns = 21;
    startGame();
})

hardButton.addEventListener("click", () => {
    fps = 20;
    blockSize = 25;
    totalRows = 25;
    totalColumns = 25;
    startGame();
})