const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

let highestScore = localStorage.getItem("highestScore") || 0;
let gameOver = false;

const playAgainBtn = document.getElementById("playAgainBtn");

window.onload = () => {
  gameLoop();
  playAgainBtn.addEventListener("click", restartGame);
};

function gameLoop() {
  setInterval(show, 1000 / (10 + snake.tail.length));
}

function show() {
  if (!gameOver) {
    update();
    draw();
  } else {
    playAgainBtn.style.display = "block";
  }
}

function restartGame() {
  snake.tail = [{ x: 20, y: 20 }];
  snake.rotateX = 0;
  snake.rotateY = 1;
  apple = new Apple();
  gameOver = false;

  playAgainBtn.style.display = "none";
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  checkCollision();
  eatApple();
  checkHitWall();
}

function checkCollision() {
  let headTail = snake.tail[snake.tail.length - 1];

  for (let i = 0; i < snake.tail.length - 1; i++) {
    if (headTail.x === snake.tail[i].x && headTail.y === snake.tail[i].y) {
      gameOver = true;
    }
  }
}

function eatApple() {
  if (
    snake.tail[snake.tail.length - 1].x == apple.x &&
    snake.tail[snake.tail.length - 1].y == apple.y
  ) {
    const currentScore = snake.tail.length - 1;

    if (currentScore > highestScore) {
      highestScore = currentScore;
      localStorage.setItem("highestScore", highestScore);
    }

    snake.tail[snake.tail.length] = { x: apple.x, y: apple.y };
    apple = new Apple();
  }
}

function checkHitWall() {
  let headTail = snake.tail[snake.tail.length - 1];

  if (
    headTail.x < 0 ||
    headTail.x >= canvas.width ||
    headTail.y < 0 ||
    headTail.y >= canvas.height
  ) {
    gameOver = true;
  }
}

function draw() {
  canvas.style.backgroundColor = "black";

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  createRect(0, 0, canvas.width, canvas.height, "black");
  createRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.tail.length; i++) {
    createRect(
      snake.tail[i].x + 2.5,
      snake.tail[i].y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "white",
      "snake"
    );
  }

  canvasContext.font = "20px Arial";
  canvasContext.fillStyle = "#00FF42";
  if (gameOver) {
    canvasContext.fillText(
      "Game Over | Score: " + (snake.tail.length - 1),
      canvas.width / 2 - 100,
      canvas.height / 2
    );
  } else {
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color);

    const scoreText = "Score: " + (snake.tail.length - 1);
    const highestScoreText = "Highest Score: " + highestScore;

    canvasContext.fillText(scoreText, canvas.width - 400, 30);
    canvasContext.fillText(highestScoreText, canvas.width - 400, 60);
  }
}

function createRect(x, y, width, height, color, className) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
  if (className) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
    canvasContext.fillStyle = "black";
  }
}

window.addEventListener("keydown", (event) => {
  setTimeout(() => {
    if (event.keyCode == 37 && snake.rotateX != 1) {
      snake.rotateX = -1;
      snake.rotateY = 0;
    } else if (event.keyCode == 38 && snake.rotateY != 1) {
      snake.rotateX = 0;
      snake.rotateY = -1;
    } else if (event.keyCode == 39 && snake.rotateX != -1) {
      snake.rotateX = 1;
      snake.rotateY = 0;
    } else if (event.keyCode == 40 && snake.rotateY != -1) {
      snake.rotateX = 0;
      snake.rotateY = 1;
    }
  }, 1);
});

class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
  }

  move() {
    let newRect;

    if (this.rotateX == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateX == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateY == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size,
      };
    } else if (this.rotateY == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size,
      };
    }

    this.tail.shift();
    this.tail.push(newRect);
  }
}

class Apple {
  constructor() {
    let isTouching;

    while (true) {
      isTouching = false;
      this.x =
        Math.floor((Math.random() * canvas.width) / snake.size) * snake.size;
      this.y =
        Math.floor((Math.random() * canvas.height) / snake.size) * snake.size;

      for (let i = 0; i < snake.tail.length; i++) {
        if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
          isTouching = true;
        }
      }

      this.size = snake.size;
      this.color = "red";

      if (!isTouching) {
        break;
      }
    }
  }
}

const snake = new Snake(20, 20, 20);
let apple = new Apple();
