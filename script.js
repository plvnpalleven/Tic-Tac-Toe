const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const decreaseBtn = document.querySelector("#decreaseBtn");
const increaseBtn = document.querySelector("#increaseBtn");
const gridSizeDisplay = document.querySelector("#gridSizeDisplay");

let gridSize = 3; // เริ่มต้นขนาดตารางที่ 3x3
const minSize = 3;
const maxSize = 7;
let options = Array(gridSize * gridSize).fill("");
let currentPlayer = "X";
let running = false;


initializeGame();

function initializeGame() {
  options = Array(gridSize * gridSize).fill(""); // รีเซ็ตตัวแปร options ให้ตรงกับขนาดตารางใหม่

  createGrid(gridSize);
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  decreaseBtn.addEventListener("click", decreaseGridSize);
  increaseBtn.addEventListener("click", increaseGridSize);
  updateGridSizeDisplay();
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}

function createGrid(size) {
  const cellContainer = document.querySelector("#cellContainer");
  cellContainer.style.gridTemplateColumns = `repeat(${size}, 75px)`; // กำหนดขนาดให้เหมาะสมกับเซลล์
  cellContainer.innerHTML = ""; // ล้างเนื้อหาเก่าใน container

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.id = i;
    cellContainer.appendChild(cell);
  }
}

function cellClicked() {
  const cellIndex = this.id;

  if (options[cellIndex] !== "" || !running) {
    return;
  }

  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  let roundWon = false;
  const winningConditions = generateWinningConditions(gridSize);

  for (let i = 0; i < winningConditions.length; i++) {
    const condition = winningConditions[i];
    const [a, b, c, ...rest] = condition;
    const valueA = options[a];
    const valueB = options[b];
    const valueC = options[c];

    if (valueA === "" || valueB === "" || valueC === "") {
      continue;
    }

    const isWinningConditionMet = rest.reduce(
      (acc, index) => acc && options[index] === valueA,
      valueA === valueB && valueB === valueC
    );

    if (isWinningConditionMet) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
    saveGameHistory(currentPlayer); // เซฟประวัติเกมชนะ
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    running = false;
    saveGameHistory("Draw"); //เซฟประวัติเกมเสมอ
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  initializeGame();
}

function updateGridSizeDisplay() {
  gridSizeDisplay.textContent = `${gridSize}x${gridSize}`;
}

function decreaseGridSize() {
  if (gridSize > minSize) {
    gridSize--;
    restartGame();
  }
}

function increaseGridSize() {
  if (gridSize < maxSize) {
    gridSize++;
    restartGame();
  }
}

function generateWinningConditions(size) {
  const conditions = [];

  // แนวนอน
  for (let i = 0; i < size; i++) {
    const rowCondition = [];
    for (let j = 0; j < size; j++) {
      rowCondition.push(i * size + j);
    }
    conditions.push(rowCondition);
  }

  // แนวตั้ง
  for (let i = 0; i < size; i++) {
    const colCondition = [];
    for (let j = 0; j < size; j++) {
      colCondition.push(i + size * j);
    }
    conditions.push(colCondition);
  }

  // แนวทแยงจากซ้ายบนไปขวาล่าง
  const diag1Condition = [];
  for (let i = 0; i < size; i++) {
    diag1Condition.push(i * size + i);
  }
  conditions.push(diag1Condition);

  // แนวทแยงจากขวาบนไปซ้ายล่าง
  const diag2Condition = [];
  for (let i = 0; i < size; i++) {
    diag2Condition.push((i + 1) * (size - 1));
  }
  conditions.push(diag2Condition);

  return conditions;
}

function saveGameHistory(winner, moves) {
  const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
  const gameRecord = {
    winner: winner,
    gridSize: gridSize,
    date: new Date().toISOString(),
  };

  gameHistory.push(gameRecord);
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
}

function openHistory() {
  window.location.href = "history.html";
}
