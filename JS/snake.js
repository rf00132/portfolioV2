const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const easyButton = document.querySelector("#easy");
const mediumButton = document.querySelector("#medium");
const hardButton = document.querySelector("#hard");
const fps = 10;
let blockSize = 25;
let totalRows = 17;
let totalColumns = 17;

let score = 0;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speed = { x: 0, y: 0}

let snake = [];

let foodCoords = { x: 0, y: 0 };

let gameOver = false;

function startGame(){
    gameOver = false;
    score = 0;
    snake = [];
    speed = { x: 0, y: 0}
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    canvas.height = blockSize * totalRows;
    canvas.width = blockSize * totalColumns;
    placeFood();
    document.addEventListener("keydown", changeDirection);
    draw();
}


function draw(){
    if(gameOver) return;

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
    snakeX += speed.x * blockSize; //updating Snake position in X coordinate.
    snakeY += speed.y * blockSize;  //updating Snake position in Y coordinate.
    ctx.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i][0], snake[i][1], blockSize, blockSize);
    }

    if (snakeX < 0
        || snakeX > totalColumns * blockSize
        || snakeY < 0
        || snakeY > totalRows * blockSize) {

        // Out of bound condition
        gameOver = true;
        alert("Game Over");
    }

    for (let i = 0; i < snake.length; i++) {
        if (snakeX === snake[i][0] && snakeY === snake[i][1]) {

            // Snake eats own body
            gameOver = true;
            alert("Game Over");
        }
    }
    setTimeout( () =>
    {
        requestAnimationFrame(draw);
    }, 1000/fps)
}


function placeFood(){
    foodCoords = {
        x: Math.floor(Math.random() * totalColumns) * blockSize,
        y: Math.floor(Math.random() * totalRows) * blockSize
    }
}

function changeDirection(e){
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
}


easyButton.addEventListener("click", () => {
    startGame();
});


mediumButton.addEventListener("click", () => {

    startGame();
})

hardButton.addEventListener("click", () => {
    startGame();
})