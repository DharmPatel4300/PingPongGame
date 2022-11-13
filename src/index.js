import "./styles.css";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

const Ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "white"
};

const Separator = {
  xStart: canvas.width,
  xEnd: 0,
  y: canvas.height / 2,
  color: "grey"
};

const Cpu = {
  width: 150,
  height: 20,
  x: (canvas.width - 150) / 2,
  y: 2,
  score: 0,
  color: "blue"
};

const User = {
  width: 150,
  height: 20,
  x: (canvas.width - 150) / 2,
  y: canvas.height - 20 - 2,
  score: 0,
  color: "red"
};

// Functions

function setCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore(x, y, score) {
  ctx.fillStyle = "white";
  ctx.font = "30px Josefin Sans";
  ctx.fillText(score, x, y);
}

function drawSeparator(xStart, xEnd, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.1;
  ctx.setLineDash([5]);
  ctx.beginPath();
  ctx.moveTo(xStart, y);
  ctx.lineTo(xEnd, y);
  ctx.stroke();
}

function drawBar(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.roundRect(x, y, width, height, [40]);
  ctx.fill();
}

function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}

function reDrawLevel() {
  setCanvas();
  drawSeparator(Separator.xStart, Separator.xEnd, Separator.y, Separator.color);

  // Cpu bar and score
  drawBar(Cpu.x, Cpu.y, Cpu.width, Cpu.height, Cpu.color);
  drawScore(10, 30, Cpu.score);

  // User bar and score
  drawBar(User.x, User.y, User.width, User.height, User.color);
  drawScore(20, canvas.height - 10, User.score);

  drawBall(Ball.x, Ball.y, Ball.radius, Ball.color);
}
///// Game States ////////////////

function restart() {
  Ball.x = canvas.width / 2;
  Ball.y = canvas.height / 2;
  Ball.velocityY = -Ball.velocityY;
  Ball.speed = 2;
  isStart = false;
}

// state of bar according to mouse
function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  if (
    e.clientX - rect.left - User.width / 2 > 0 &&
    e.clientX - rect.left - User.width / 2 < canvas.width - User.width
  ) {
    User.x = e.clientX - rect.left - User.width / 2;
    Cpu.x = e.clientX - rect.left - Cpu.width / 2;
  }
}

// collision event at side wall as well ball-bars
function collision(ball, player) {
  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  return (
    player.top < ball.bottom &&
    player.left < ball.right &&
    player.right > ball.left &&
    player.bottom > ball.top
  );
}

// continues changing states of game-play
function update() {
  if (Ball.y - Ball.radius < 0) {
    Cpu.score++;
    restart();
  } else if (Ball.y + Ball.radius > canvas.height) {
    User.score++;
    restart();
  }

  Ball.x += Ball.velocityX;
  Ball.y += Ball.velocityY;

  //Wall-Boudries
  if (Ball.x - Ball.radius < 0 || Ball.x + Ball.radius > canvas.width) {
    Ball.velocityX = -Ball.velocityX;
  }
  let player = Ball.y + Ball.radius < canvas.width / 2 ? Cpu : User;

  if (collision(Ball, player)) {
    Ball.velocityY = -Ball.velocityY;
  }
}

function call_back() {
  update();
  reDrawLevel();
  isStart = true;
}

//************* Game Play *************//

reDrawLevel();
let isStart = false;
let looper;
window.alert("Please Press Enter To Start Game ");

let fps = 60;
window.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && isStart === false) {
    looper = setInterval(call_back, 1000 / fps);
    document.addEventListener("mousemove", getMousePos);
  }
});
