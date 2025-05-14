// const binary =
//   "1111111110000001101111011010010110101101101000011000110111111111";
console.log("game-script.js loaded2");
export class MazeGame {
  constructor(size = 32) {
    this.size = size;
    this.isMuted = false;
    this.timeLeft = 15;
    this.timerInterval = null;
    this.gameActive = false;
    this.initMaze();
    this.attachEventListeners();
  }

  generateMazeBinaryString(size = this.size) {
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

  findFarthestCell(maze, startX, startY) {
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

  initMaze(selectedSize = this.size) {
    console.log("setupMaze called");
    this.size = selectedSize;
    this.mazeArr = this.generateMazeBinaryString(this.size);
    this.start = { x: 1, y: 1 };
    this.end = this.findFarthestCell(this.mazeArr, this.start.x, this.start.y);
    this.playerPos = { ...this.start };
    this.binary = this.mazeArr.map((row) => row.join("")).join("");
    this.maze = [];
    for (let y = 0; y < this.size; y++) {
      this.maze[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.maze[y][x] =
          this.binary[y * this.size + x] === "1" ? "wall" : "path";
      }
    }
    // Set CSS variables for grid and cell size
    const mazeSection = document.getElementById("maze");
    mazeSection.style.setProperty("--maze-size", this.size);
    let cellSize = 20;
    if (this.size === 16) cellSize = 32;
    else if (this.size === 20) cellSize = 28;
    else if (this.size === 24) cellSize = 24;
    else if (this.size === 28) cellSize = 22;
    else if (this.size === 32) cellSize = 20;
    mazeSection.style.setProperty("--cell-size", cellSize + "px");
    this.renderMaze();
    this.startTimer();
    // Hide overlay for 2 seconds, then show if needed
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
    setTimeout(() => {
      this.updateOverlay();
    }, 2000);
  }

  renderMaze() {
    console.log("renderMaze called");
    const mazeSection = document.getElementById("maze");
    mazeSection.innerHTML = "";
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = document.createElement("section");
        let cellClass = "cell " + this.maze[y][x];
        if (x === this.end.x && y === this.end.y) cellClass += " end";
        cell.className = cellClass;
        if (this.playerPos.x === x && this.playerPos.y === y) {
          const player = document.createElement("mark");
          player.className = "player";
          cell.appendChild(player);
        }
        mazeSection.appendChild(cell);
      }
    }
    setTimeout(() => this.updateOverlay(), 0);
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timeLeft = 15;
    this.updateTimerDisplay();
    this.gameActive = true;
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        if (
          !(this.playerPos.x === this.end.x && this.playerPos.y === this.end.y)
        ) {
          this.gameActive = false;
          this.playSound("../assets/loss.mp3");
          if (window.renderLoss) window.renderLoss();
        }
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.gameActive = false;
  }

  updateTimerDisplay() {
    const timerElem = document.getElementById("timer");
    const timerBar = document.getElementById("timer-bar");
    if (timerElem) timerElem.textContent = this.timeLeft;
    if (timerBar) {
      timerBar.value = this.timeLeft;
      if (this.timeLeft < 5) {
        timerBar.classList.add("timer-bar-red");
        timerBar.classList.remove("timer-bar-green");
      } else {
        timerBar.classList.add("timer-bar-green");
        timerBar.classList.remove("timer-bar-red");
      }
    }
    this.updateOverlay();
  }

  // Temporarily disable the overlay feature
  updateOverlay() {
    // Overlay is paused/disabled for now. To re-enable, restore the original logic.
  }

  playSound(filename) {
    if (this.isMuted) return;
    const audio = new Audio(filename);
    audio.currentTime = 0;
    audio.play();
  }

  showSparkles() {
    const mazeSection = document.getElementById("maze");
    const endIndex = this.end.y * this.size + this.end.x;
    const endCell = mazeSection.children[endIndex];
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
      const sparkle = document.createElement("mark");
      sparkle.className = "sparkle";
      sparkle.style.setProperty("--dx", dx + "px");
      sparkle.style.setProperty("--dy", dy + "px");
      endCell.appendChild(sparkle);
      setTimeout(() => {
        if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
      }, 700);
    }
  }

  movePlayer(dx, dy) {
    if (!this.gameActive) return;
    const nx = this.playerPos.x + dx;
    const ny = this.playerPos.y + dy;
    if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
      if (this.maze[ny][nx] === "path") {
        this.playerPos = { x: nx, y: ny };
        this.renderMaze();
        this.updateOverlay();
        this.playSound("../assets/move.mp3");
        if (
          this.playerPos.x === this.end.x &&
          this.playerPos.y === this.end.y
        ) {
          this.showSparkles();
          setTimeout(() => console.log("game over"), 10);
          this.playSound("../assets/win.mp3");
          this.stopTimer();
          if (window.renderCongrats) window.renderCongrats();
        }
      } else {
        this.playSound("../assets/wall.mp3");
      }
    } else {
      this.playSound("../assets/wall.mp3");
    }
  }

  attachEventListeners() {
    if (!this.isMobile()) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") this.movePlayer(0, -1);
        if (e.key === "ArrowDown") this.movePlayer(0, 1);
        if (e.key === "ArrowLeft") this.movePlayer(-1, 0);
        if (e.key === "ArrowRight") this.movePlayer(1, 0);
      });
    }
    window.addEventListener("DOMContentLoaded", () => {
      console.log("DOMContentLoaded event listener added");
      const up = document.getElementById("up");
      const down = document.getElementById("down");
      const left = document.getElementById("left");
      const right = document.getElementById("right");
      if (up && down && left && right) {
        up.addEventListener("click", () => this.movePlayer(0, -1));
        down.addEventListener("click", () => this.movePlayer(0, 1));
        left.addEventListener("click", () => this.movePlayer(-1, 0));
        right.addEventListener("click", () => this.movePlayer(1, 0));
      }
    });
    const sizeSelect = document.getElementById("maze-size");
    const generateBtn = document.getElementById("generate-maze");
    console.log(sizeSelect);
    console.log(generateBtn);
    if (sizeSelect && generateBtn) {
      sizeSelect.addEventListener("change", () => {
        this.initMaze(Number(sizeSelect.value));
      });
      generateBtn.addEventListener("click", () => {
        this.initMaze(Number(sizeSelect.value));
      });
    }
    window.addEventListener("resize", () => this.updateOverlay());
    window.addEventListener("DOMContentLoaded", () => {
      const muteToggle = document.getElementById("mute-sound-toggle");
      if (muteToggle) {
        this.isMuted = muteToggle.checked;
        muteToggle.addEventListener("change", () => {
          this.isMuted = muteToggle.checked;
        });
      }
    });
  }

  isMobile() {
    return (
      window.innerWidth <= 600 || /Mobi|Android/i.test(navigator.userAgent)
    );
  }
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
