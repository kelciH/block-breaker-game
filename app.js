const gameWidth = 960;
const paddleSpeed = 8;

const endScreen = document.getElementById("endScreen");
const endMessage = document.getElementById("endMessage");
endScreen.classList.add("hidden");

const game = document.getElementById("game");
const paddle = document.getElementById("paddle");
const score = document.getElementById("score");
const lives = document.getElementById("lives");
let scoreNum = 0;
let livesNum = 3;

//const paddleWidth = 120;
//paddle.offsetWidth -> paddleWidth
let paddleX = (gameWidth - paddle.offsetWidth) / 2;

const bricksContainer = document.getElementById("bricks");
const brickWidth = 120;
const brickHeight = 60;
const rows = 5;
const cols = 7;
const brickPadding = 10;
const offsetTop = 30;
const offsetLeft = 30;
const bricks = [];

const ball = document.getElementById("ball");
const ballSize = 16;
const gameHeight = 640;
let ballX = gameWidth / 2;
let ballY = gameHeight - 60;
let dx = 6;
let dy = -6;

paddle.style.position = "absolute";
paddle.style.left = paddleX + "px";

let leftPressed = false;
let rightPressed = false;

let gameOver = false;

updateSL();

document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
})

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
})

for (let c = 0; c < cols; c++) {
  bricks[c] = [];
  for (let r = 0; r < rows; r++) {
    const brick = document.createElement("div");
    brick.classList.add("brick");

    const x = c * (brickWidth + brickPadding) + offsetLeft;
    const y = r * (brickHeight + brickPadding) + offsetTop;

    brick.style.left = x + "px";
    brick.style.top = y + "px";

    bricksContainer.appendChild(brick);
    bricks[c][r] = brick;
  }
}

function updateSL() {
    score.textContent = `Score: ${scoreNum}`;
    lives.textContent = `Lives: ${livesNum}`;
}

function resetBall() {
    ballX = gameWidth / 2;
    ballY = gameHeight - 60;
    dx = 6;
    dy = -6;
}

function endGame() {
    gameOver = true;
    endScreen.classList.remove("hidden");
    resetBall();
}

function restartGame() {
    location.reload();
}

function update() {
    if (gameOver) return;

    if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
//paddle.offsetWidth -> paddleWidth
    if (rightPressed && paddleX < gameWidth - paddle.offsetWidth) {
        paddleX += paddleSpeed;
    }

    ballX += dx;
    ballY += dy;
    
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    if(ballX <= 0 || ballX >= gameWidth - ballSize) dx = -dx;
    if(ballY <= 0) dy = -dy;

    if(
        ballY >= gameHeight - 50 &&
        ballX > paddleX &&
        ballX < paddleX + paddle.offsetWidth
    ) {dy = -dy}

    //bricks -> brick
    bricks.forEach((column, cIndex) => {
        column.forEach((brick, rIndex) => {
            //bricks -> brick
            if (!brick) return;
//bricks -> brick
    const rect = brick.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();

    const bx = rect.left - gameRect.left;
    const by = rect.top - gameRect.top;

    if (
        ballX > bx && ballX < bx + brickWidth && ballY > by && ballY < by + brickHeight
    ) {
        dy = -dy;
        //bricks -> brick
        brick.remove();
        bricks[cIndex][rIndex] = null;

        scoreNum++;
        updateSL();

        if (scoreNum === rows * cols) {
            endGame();
        }
    }

        });
    });


if (ballY >= gameHeight - ballSize) {
    livesNum--;
    updateSL();

    if (livesNum === 0) {
        endGame();
    }

    else {
        resetBall();
    }

    }

    paddle.style.left = paddleX + "px";

    requestAnimationFrame(update);
}

update();
