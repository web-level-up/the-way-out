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

  constructor(maze) {
    this.mazeLayout = "1001001010101010";
    this.size = Math.sqrt(this.mazeLayout.length);

    for (let y = 0; y < this.size; y++) {
      const row = [];
      for (let x = 0; x < this.size; x++) {
        row.push(this.mazeLayout[y * this.size + x] === "1");
      }
      this.mazeGrid.push(row);
    }

    this.x = 0;
    this.y = 1;

    this.endX = 1;
    this.endY = 2;

    this.previewTimeLeft = 20;
    this.escapeTimeLeft = 20;

    this.renderMazeGrid();
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
        } else if (!this.isVisible(y, x) && this.previewTimeLeft === 0) {
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
      this.previewTimeLeft > 0 ? --this.previewTimeLeft : --this.escapeTimeLeft;
      this.updateTimerDisplay();
      if (this.escapeTimeLeft <= 0) {
        clearInterval(this.timerInterval);
        if (!(this.x === this.endX && this.y === this.endY)) {
          this.gameLost();
        }
      }
    }, 1000);
  }

  updateTimerDisplay() {
    //   const timerElem = document.getElementById("timer");
    //   const timerBar = document.getElementById("timer-bar");
    //   if (timerElem) timerElem.textContent = timeLeft;
    //   if (timerBar) {
    //     timerBar.value = timeLeft;
    //     if (timeLeft < 5) {
    //       timerBar.classList.add("timer-bar-red");
    //       timerBar.classList.remove("timer-bar-green");
    //     } else {
    //       timerBar.classList.add("timer-bar-green");
    //       timerBar.classList.remove("timer-bar-red");
    //     }
    //   }
    //   updateOverlay();

    const timerElem = document.getElementById("preview");
    const timer2Elem = document.getElementById("escape");

    timerElem.textContent = `Preview: ${this.previewTimeLeft}`;
    timer2Elem.textContent = `Escape: ${this.escapeTimeLeft}`;
  }
  updateStepsDisplay() {
    const stepsElem = document.getElementById("steps");

    stepsElem.textContent = `Steps: ${this.stepsTaken}`;
  }

  movePlayer(dx, dy) {
    const nx = this.x + dx;
    const ny = this.y + dy;
    if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
      if (!this.mazeGrid[ny][nx]) {
        this.x = nx;
        this.y = ny;
        this.stepsTaken += 1;
        this.renderMazeGrid();
        this.updateStepsDisplay();
        if (this.x === this.endX && this.y === this.endY) {
          this.gameWon();
        }
      } else {
      }
    } else {
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
    console.log("WON");
    this.endGame();
    renderCongrats();
  }

  gameLost() {
    console.log("LOST");
    this.endGame();
    renderLoss();
  }
}
