const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 }; // Snake starts moving to the right
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval = null;

// Initialize the game
function initGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 }; // Reset direction to right
  food = randomFoodPosition();
  score = 0;
  scoreDisplay.textContent = score;
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 200);
}

// Draw the board
function drawBoard() {
  gameBoard.innerHTML = ""; // Clear board before re-drawing
  snake.forEach(segment => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add("snake");
    gameBoard.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

// Move the snake
function moveSnake() {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  snake.unshift(newHead); // Add the new head at the front of the snake array

  // Check if the snake eats food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    food = randomFoodPosition();
  } else {
    snake.pop(); // Remove the last segment of the snake if no food is eaten
  }
}

// Check for collision with walls or self
function checkCollision() {
  const head = snake[0];
  const hitWall = head.x < 1 || head.x > boardSize || head.y < 1 || head.y > boardSize;
  const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    alert("Game Over!");
    initGame();
  }
}

// Generate random food position
function randomFoodPosition() {
  let newFoodPosition;
  while (!newFoodPosition || snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
    newFoodPosition = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1,
    };
  }
  return newFoodPosition;
}

// Update the game (move snake, check collisions, draw the board)
function updateGame() {
  moveSnake();
  checkCollision();
  drawBoard();
}

// Change direction based on arrow key press
function changeDirection(event) {
  const key = event.key;

  // Prevent the snake from reversing directions
  if (key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: -1 }; // Move up
  }
  if (key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: 1 }; // Move down
  }
  if (key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -1, y: 0 }; // Move left
  }
  if (key === "ArrowRight" && direction.x === 0) {
    direction = { x: 1, y: 0 }; // Move right
  }
}

// On-Screen Buttons for Mobile
function createControlButtons() {
  const controlPanel = document.createElement("div");
  controlPanel.classList.add("control-panel");

  // Create up, down, left, right buttons
  const upButton = document.createElement("button");
  upButton.innerText = "Up";
  upButton.addEventListener("click", () => changeDirection({ key: "ArrowUp" }));

  const downButton = document.createElement("button");
  downButton.innerText = "Down";
  downButton.addEventListener("click", () => changeDirection({ key: "ArrowDown" }));

  const leftButton = document.createElement("button");
  leftButton.innerText = "Left";
  leftButton.addEventListener("click", () => changeDirection({ key: "ArrowLeft" }));

  const rightButton = document.createElement("button");
  rightButton.innerText = "Right";
  rightButton.addEventListener("click", () => changeDirection({ key: "ArrowRight" }));

  controlPanel.appendChild(upButton);
  controlPanel.appendChild(leftButton);
  controlPanel.appendChild(rightButton);
  controlPanel.appendChild(downButton);

  document.body.appendChild(controlPanel);
}

// Touch Event for Mobile
function handleTouchMove(event) {
  const touchStart = event.touches[0];
  const touchEnd = event.changedTouches[0];
  const deltaX = touchEnd.pageX - touchStart.pageX;
  const deltaY = touchEnd.pageY - touchStart.pageY;

  // Swipe gestures
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Swipe Right
    if (deltaX < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Swipe Left
  } else {
    if (deltaY > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Swipe Down
    if (deltaY < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Swipe Up
  }
}

// Event listeners
document.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", initGame);

// Add touch event listener for mobile devices
document.addEventListener("touchstart", handleTouchMove);
document.addEventListener("touchend", handleTouchMove);

// Initial render of the game board
drawBoard();
createControlButtons(); // Add on-screen buttons for mobile users
