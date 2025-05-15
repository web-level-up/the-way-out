import { renderCongrats } from "./rendering/render-congrats.js";
import { renderLoss } from "./rendering/render-loss.js";

export class MazeGame {
  mazeLayout = "";
  mazeGrid = [];
  stepsTaken = 0;
  previewTimeLeft = 0;
  escapeTimeLeft = 0;
  x = 0;
  y = 0;
  endX = 0;
  endY = 0;
  visibility = 1;
  size = 0;
  timerInterval = null;
  keydownHandler = null;
  resizeHandler = null;
  mazeId = 0;
  moveAudio = null;
  wallAudio = null;
  winAudio = null;
  lossAudio = null;
  initialEscapeTime = 0;
  initialPreviewTime = 0;

  constructor(maze) {
    this.mazeLayout = maze.maze_layout.replaceAll('\r\n','');
    this.mazeId = maze.id;
    this.size = maze.maze_size;

    for (let y = 0; y < this.size; y++) {
      const row = [];
      for (let x = 0; x < this.size; x++) {
        row.push(this.mazeLayout[y * this.size + x] === "1");
      }
      this.mazeGrid.push(row);
    }

    this.x = maze.x_starting_position;
    this.y = maze.y_starting_position;

    this.endX = maze.x_ending_position;
    this.endY = maze.y_ending_position;

    this.previewTimeLeft = maze.preview_time_seconds;
    this.escapeTimeLeft = maze.escape_time_seconds;
    this.initialEscapeTime = this.escapeTimeLeft;
    this.initialPreviewTime = this.previewTimeLeft;

    this.renderMazeGrid();
    this.updateStepsDisplay();
    this.updateTimerDisplay(
      this.initialPreviewTime,
      this.previewTimeLeft,
      true
    );
    this.startTimer();

    this.resizeHandler = () => this.renderMazeGrid();
    window.addEventListener("resize", this.resizeHandler);

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

    this.keydownHandler = (e) => {
      if (e.key === "ArrowUp") this.movePlayer(0, -1);
      if (e.key === "ArrowDown") this.movePlayer(0, 1);
      if (e.key === "ArrowLeft") this.movePlayer(-1, 0);
      if (e.key === "ArrowRight") this.movePlayer(1, 0);
    };
    document.addEventListener("keydown", this.keydownHandler);

    this.moveAudio = new Audio("assets/move.mp3");
    this.wallAudio = new Audio("assets/wall.mp3");
    this.winAudio = new Audio("assets/win.mp3");
    this.lossAudio = new Audio("assets/loss.mp3");
  }

  isVisible(y, x) {
    const dx = Math.abs(this.x - x);
    const dy = Math.abs(this.y - y);
    return dx <= this.visibility && dy <= this.visibility;
  }

  renderMazeGrid() {
    const container = document.getElementById("grid-container");
    container.replaceChildren();

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let cols = Math.ceil(Math.sqrt(this.mazeLayout.length));
    let rows = Math.ceil(this.mazeLayout.length / cols);

    const cellSize = Math.min(
      Math.floor(containerWidth / cols),
      Math.floor(containerHeight / rows)
    );

    container.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    const size = Math.sqrt(this.mazeLayout.length);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = document.createElement("section");
        cell.classList.add("cell");

        if (y === this.y && x === this.x) {
          const player = document.createElement("section");
          player.id = "player";
          cell.appendChild(player);
        } else if (!this.isVisible(y, x) && this.previewTimeLeft <= 0) {
          cell.classList.add("darkness");
        } else if (y === this.endY && x === this.endX) {
          const endGoal = document.createElement("section");
          endGoal.id = "end";
          cell.appendChild(endGoal);
        } else if (this.mazeGrid[y][x]) {
          cell.classList.add("wall");
        }

        container.appendChild(cell);
      }
    }
  }

  startTimer() {
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.previewTimeLeft > 0) {
        --this.previewTimeLeft;
        this.updateTimerDisplay(
          this.initialPreviewTime,
          this.previewTimeLeft,
          true
        );
        if (this.previewTimeLeft === 0) {
          this.renderMazeGrid();
          this.updateTimerDisplay(
            this.initialEscapeTime,
            this.escapeTimeLeft,
            false
          );
        }
      } else {
        --this.escapeTimeLeft;
        this.updateTimerDisplay(
          this.initialEscapeTime,
          this.escapeTimeLeft,
          false
        );
      }
      if (this.escapeTimeLeft <= 0) {
        if (!(this.x === this.endX && this.y === this.endY)) {
          this.gameLost();
        } else {
          this.gameWon();
        }
      }
    }, 1000);
  }

  updateTimerDisplay(max, value, isPreview) {
    const timerText = document.getElementById("timer-label");
    timerText.textContent = isPreview ? "Preview" : "Escape";

    const timerBar = document.getElementById("timer-bar");
    if (timerBar) {
      timerBar.max = max;
      timerBar.value = value;
    }
  }
  updateStepsDisplay() {
    const stepsElem = document.getElementById("steps");

    stepsElem.textContent = `Steps: ${this.stepsTaken}`;
  }

  movePlayer(dx, dy) {
    // End preview as soon as player moves
    if (this.previewTimeLeft > 0) {
      this.previewTimeLeft = 0;
      this.renderMazeGrid();
    }
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
      if (!this.mazeGrid[ny][nx]) {
        this.x = nx;
        this.y = ny;
        this.stepsTaken += 1;
        this.renderMazeGrid();
        this.updateStepsDisplay();
        if (this.moveAudio)
          (this.moveAudio.currentTime = 0), this.moveAudio.play();
        if (this.x === this.endX && this.y === this.endY) {
          this.gameWon();
        }
      } else {
        if (this.wallAudio)
          (this.wallAudio.currentTime = 0), this.wallAudio.play();
      }
    } else {
      if (this.wallAudio)
        (this.wallAudio.currentTime = 0), this.wallAudio.play();
    }
  }

  endGame() {
    clearInterval(this.timerInterval);
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
  }

  gameWon() {
    console.log(this.initialEscapeTime - this.escapeTimeLeft);
    if (this.winAudio) (this.winAudio.currentTime = 0), this.winAudio.play();
    this.endGame();
    renderCongrats(
      this.stepsTaken,
      this.initialEscapeTime - this.escapeTimeLeft,
      this.mazeId
    );
  }

  gameLost() {
    if (this.lossAudio) (this.lossAudio.currentTime = 0), this.lossAudio.play();
    this.endGame();
    renderLoss(this.mazeId);
  }
}
