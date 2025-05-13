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

  constructor(maze) {
    this.mazeLayout = "1010101010101010";
    const size = Math.sqrt(this.mazeLayout.length);

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(this.mazeLayout[i * size + j] === "1");
      }
      this.mazeGrid.push(row);
    }

    this.x = 0;
    this.y = 1;

    this.endX = 1;
    this.endY = 2;

    this.renderMazeGrid();
    window.addEventListener("resize", () => this.renderMazeGrid());
  }

  renderMazeGrid() {
    const container = document.getElementById("grid-container");

    if (!container) {
      console.warn("Grid container not found.");
      return;
    }

    container.replaceChildren();

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth === 0 || containerHeight === 0) {
      console.warn("Container not yet sized. Try again later.");
      return;
    }

    let cols = Math.ceil(Math.sqrt(this.mazeLayout.length));
    let rows = Math.ceil(this.mazeLayout.length / cols);

    const cellSize = Math.min(
      Math.floor(containerWidth / cols),
      Math.floor(containerHeight / rows)
    );

    container.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    const size = Math.sqrt(this.mazeLayout.length);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = document.createElement("section");
        cell.classList.add("cell");

        if (row === this.y && col === this.x) {
          const player = document.createElement("section");
          player.id = "player";
          cell.appendChild(player);
        } else if (row === this.endY && col === this.endX) {
          const endGoal = document.createElement("section");
          endGoal.id = "end";
          cell.appendChild(endGoal);
        } else if (this.mazeGrid[col][row]) {
          cell.classList.add("wall");
        }

        container.appendChild(cell);
      }
    }
  }
}
