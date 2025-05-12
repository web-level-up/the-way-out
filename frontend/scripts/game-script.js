// const binary =
//   "1111111110000001101111011010010110101101101000011000110111111111";
console.log("game-script.js loaded2");
function generateMazeBinaryString(size = 32) {
  // Maze grid: 0 = path, 1 = wall
  const maze = Array.from({ length: size }, () => Array(size).fill(1));
  const dirs = [
    [0, -2], // up
    [2, 0], // right
    [0, 2], // down
    [-2, 0], // left
  ];
  function carve(x, y) {
    maze[y][x] = 0;
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (
        nx > 0 &&
        nx < size - 1 &&
        ny > 0 &&
        ny < size - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }
  for (let i = 0; i < size; i++) {
    maze[0][i] = 1;
    maze[size - 1][i] = 1;
    maze[i][0] = 1;
    maze[i][size - 1] = 1;
  }
  carve(1, 1);
  maze[1][1] = 0;
  return maze;
}

function findFarthestCell(maze, startX, startY) {
  const size = maze.length;
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue = [[startX, startY, 0]];
  visited[startY][startX] = true;
  let farthest = [startX, startY, 0];
  while (queue.length) {
    const [x, y, dist] = queue.shift();
    if (dist > farthest[2]) farthest = [x, y, dist];
    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (
        nx >= 0 &&
        nx < size &&
        ny >= 0 &&
        ny < size &&
        !visited[ny][nx] &&
        maze[ny][nx] === 0
      ) {
        visited[ny][nx] = true;
        queue.push([nx, ny, dist + 1]);
      }
    }
  }
  return { x: farthest[0], y: farthest[1] };
}

let size = 32;
let mazeArr, start, end, playerPos, binary, maze;
let timerInterval = null;
let timeLeft = 15;
let gameActive = false;
let isMuted = false;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  updateTimerDisplay();
  gameActive = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!(playerPos.x === end.x && playerPos.y === end.y)) {
        gameActive = false;

        playSound("../assets/loss.mp3");
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  gameActive = false;
}

function updateTimerDisplay() {
  const timerElem = document.getElementById("timer");
  const timerBar = document.getElementById("timer-bar");
  if (timerElem) timerElem.textContent = timeLeft;
  if (timerBar) {
    timerBar.value = timeLeft;
    if (timeLeft < 5) {
      timerBar.classList.add("timer-bar-red");
      timerBar.classList.remove("timer-bar-green");
    } else {
      timerBar.classList.add("timer-bar-green");
      timerBar.classList.remove("timer-bar-red");
    }
  }
  updateOverlay();
}

function updateOverlay() {
  const mazeElem = document.getElementById("maze");
  const overlay = document.getElementById("overlay");
  const container = document.getElementById("maze-container");
  if (!mazeElem || !overlay || !container) return;

  // Only show overlay if timeLeft <= 13
  if (timeLeft > 13) {
    overlay.style.display = "none";
    return;
  } else {
    overlay.style.display = "block";
  }

  // Get maze bounding box relative to container
  const width = mazeElem.offsetWidth;
  const height = mazeElem.offsetHeight;

  // Set overlay size and position to match maze
  const extraOverlayTop = 10; // or 40, adjust as needed for your maze's border radius
  overlay.width = width;
  overlay.height = height + extraOverlayTop;
  overlay.style.width = width + "px";
  overlay.style.height = height + extraOverlayTop + "px";
  overlay.style.position = "absolute";
  const overlayOffsetX = 0; // No horizontal shift
  const overlayOffsetY = 8; // Increase this value to move overlay further down
  overlay.style.left = mazeElem.offsetLeft + overlayOffsetX + "px";
  overlay.style.top =
    mazeElem.offsetTop + overlayOffsetY - extraOverlayTop + "px";

  const ctx = overlay.getContext("2d");
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  // Draw fully opaque overlay everywhere
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, overlay.width, overlay.height);

  // Calculate cell size
  const cellSize = width / size;

  // Reveal area around player
  const revealRadius = 1; // 1 = 3x3, 2 = 5x5, etc.
  for (let dy = -revealRadius; dy <= revealRadius; dy++) {
    for (let dx = -revealRadius; dx <= revealRadius; dx++) {
      const x = playerPos.x + dx;
      const y = playerPos.y + dy;
      if (x >= 0 && x < size && y >= 0 && y < size) {
        ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Always reveal the end cell (make this area much bigger)
  const endClearSize = cellSize * 4;
  ctx.clearRect(
    end.x * cellSize - (endClearSize - cellSize) / 2,
    end.y * cellSize - (endClearSize - cellSize) / 2,
    endClearSize,
    endClearSize
  );
}

function setupMaze(selectedSize) {
  console.log("setupMaze called");
  size = selectedSize;
  mazeArr = generateMazeBinaryString(size);
  start = { x: 1, y: 1 };
  end = findFarthestCell(mazeArr, start.x, start.y);
  playerPos = { ...start };
  binary = mazeArr.map((row) => row.join("")).join("");
  maze = [];
  for (let y = 0; y < size; y++) {
    maze[y] = [];
    for (let x = 0; x < size; x++) {
      maze[y][x] = binary[y * size + x] === "1" ? "wall" : "path";
    }
  }
  // Set CSS variables for grid and cell size
  const mazeDiv = document.getElementById("maze");
  mazeDiv.style.setProperty("--maze-size", size);
  let cellSize = 20;
  if (size === 16) cellSize = 32;
  else if (size === 20) cellSize = 28;
  else if (size === 24) cellSize = 24;
  else if (size === 28) cellSize = 22;
  else if (size === 32) cellSize = 20;
  mazeDiv.style.setProperty("--cell-size", cellSize + "px");
  renderMaze();
  startTimer();
  // Hide overlay for 2 seconds, then show if needed
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";
  setTimeout(() => {
    updateOverlay();
  }, 2000);
}

function renderMaze() {
  console.log("renderMaze called");
  const mazeDiv = document.getElementById("maze");
  mazeDiv.innerHTML = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement("div");
      let cellClass = "cell " + maze[y][x];
      if (x === end.x && y === end.y) cellClass += " end";
      cell.className = cellClass;
      if (playerPos.x === x && playerPos.y === y) {
        const player = document.createElement("div");
        player.className = "player";
        cell.appendChild(player);
      }
      mazeDiv.appendChild(cell);
    }
  }
  setTimeout(updateOverlay, 0);
}

function playSound(filename) {
  const muteToggle = document.getElementById("mute-sound-toggle");
  if (muteToggle && muteToggle.checked) return;
  const audio = new Audio(filename);
  audio.currentTime = 0;
  audio.play();
}

function showSparkles() {
  const mazeDiv = document.getElementById("maze");
  const endIndex = end.y * size + end.x;
  const endCell = mazeDiv.children[endIndex];
  if (!endCell) return;
  const directions = [
    [0, -30],
    [21, -21],
    [30, 0],
    [21, 21],
    [0, 30],
    [-21, 21],
    [-30, 0],
    [-21, -21],
  ];
  for (const [dx, dy] of directions) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.setProperty("--dx", dx + "px");
    sparkle.style.setProperty("--dy", dy + "px");
    endCell.appendChild(sparkle);
    setTimeout(() => {
      if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
    }, 700);
  }
}

function movePlayer(dx, dy) {
  if (!gameActive) return;
  const nx = playerPos.x + dx;
  const ny = playerPos.y + dy;
  if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
    if (maze[ny][nx] === "path") {
      playerPos = { x: nx, y: ny };
      renderMaze();
      updateOverlay();
      playSound("../assets/move.mp3");
      if (playerPos.x === end.x && playerPos.y === end.y) {
        showSparkles();
        setTimeout(() => console.log("game over"), 10);
        playSound("../assets/win.mp3");
        stopTimer();
      }
    } else {
      playSound("../assets/wall.mp3");
    }
  } else {
    playSound("../assets/wall.mp3");
  }
}

function isMobile() {
  return window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent);
}

function updateControlsDisplay() {
  const controls = document.getElementById("controls");
  const hint = document.getElementById("keyboard-hint");
  if (isMobile()) {
    controls.style.display = "flex";
    hint.style.display = "none";
  } else {
    controls.style.display = "none";
    hint.style.display = "block";
  }
}

console.log("updateControlsDisplay called");
// Call on load and resize
window.addEventListener("DOMContentLoaded", updateControlsDisplay);
window.addEventListener("resize", updateControlsDisplay);
console.log("updateControlsDisplay called2");

// Button event listeners
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event listener added");
  const up = document.getElementById("up");
  const down = document.getElementById("down");
  const left = document.getElementById("left");
  const right = document.getElementById("right");
  if (up && down && left && right) {
    up.addEventListener("click", () => movePlayer(0, -1));
    down.addEventListener("click", () => movePlayer(0, 1));
    left.addEventListener("click", () => movePlayer(-1, 0));
    right.addEventListener("click", () => movePlayer(1, 0));
  }
});

// Listen for dropdown and button
const sizeSelect = document.getElementById("maze-size");
const generateBtn = document.getElementById("generate-maze");
console.log(sizeSelect);
console.log(generateBtn);
sizeSelect.addEventListener("change", () => {
  setupMaze(Number(sizeSelect.value));
});
generateBtn.addEventListener("click", () => {
  setupMaze(Number(sizeSelect.value));
});
setupMaze(Number(sizeSelect.value));

// Restore arrow key movement for desktop
console.log("arrow keys event listener added");
if (!isMobile()) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
  });
}

console.log("DOMContentLoaded event listener added");
const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");
if (up && down && left && right) {
  up.addEventListener("click", () => movePlayer(0, -1));
  down.addEventListener("click", () => movePlayer(0, 1));
  left.addEventListener("click", () => movePlayer(-1, 0));
  right.addEventListener("click", () => movePlayer(1, 0));
}

// Ensure overlay resizes with window and maze
window.addEventListener("resize", updateOverlay);

window.addEventListener("DOMContentLoaded", () => {
  const muteToggle = document.getElementById("mute-sound-toggle");
  if (muteToggle) {
    isMuted = muteToggle.checked;
    muteToggle.addEventListener("change", () => {
      isMuted = muteToggle.checked;
    });
  }
});
