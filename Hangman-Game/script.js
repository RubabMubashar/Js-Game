const wordList = ['javascript', 'developer', 'hangman', 'responsive', 'coding', 'frontend'];
const canvas = document.getElementById('hangman-canvas');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('word-display');
const wrongLettersDisplay = document.getElementById('wrong-letters-list');
const keyboard = document.getElementById('keyboard');
const popup = document.getElementById('popup');
const message = document.getElementById('message');
const playAgainButton = document.getElementById('play-again');

let selectedWord = '';
let correctLetters = [];
let wrongLetters = [];

function startGame() {
  selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
  correctLetters = [];
  wrongLetters = [];
  updateDisplay();
  createKeyboard();
  drawHangman(0);
  popup.classList.add('hidden');
}

function updateDisplay() {
  wordDisplay.innerHTML = selectedWord
    .split('')
    .map(letter => (correctLetters.includes(letter) ? letter : '_'))
    .join(' ');

  wrongLettersDisplay.textContent = wrongLetters.join(', ');

  if (!wordDisplay.textContent.includes('_')) {
    showPopup('You Win!');
  }

  if (wrongLetters.length === 6) {
    showPopup('Game Over!');
  }
}

function createKeyboard() {
  keyboard.innerHTML = '';
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleGuess(letter, button));
    keyboard.appendChild(button);
  });
}

function handleGuess(letter, button) {
  button.disabled = true;

  if (selectedWord.includes(letter)) {
    correctLetters.push(letter);
  } else {
    wrongLetters.push(letter);
    drawHangman(wrongLetters.length);
  }

  updateDisplay();
}

function drawHangman(stage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#333';

  // Draw base
  if (stage > 0) ctx.fillRect(50, 140, 100, 10);
  if (stage > 1) ctx.fillRect(90, 10, 10, 130);
  if (stage > 2) ctx.fillRect(90, 10, 60, 10);
  if (stage > 3) ctx.beginPath(), ctx.arc(150, 40, 10, 0, Math.PI * 2), ctx.stroke();
  if (stage > 4) ctx.fillRect(150, 50, 2, 50);
  if (stage > 5) {
    ctx.fillRect(140, 70, 10, 2);
    ctx.fillRect(150, 70, 10, 2);
  }
}

function showPopup(msg) {
  message.textContent = msg;
  popup.classList.remove('hidden');
}

playAgainButton.addEventListener('click', startGame);

window.addEventListener('load', startGame);
