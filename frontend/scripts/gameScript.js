function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  console.log("DrawMaze constructor called");
  var map = Maze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  var visibleRadius = 2; // Number of cells to show around the player
  ctx.lineWidth = cellSize / 40;
  this.showFullMap = function () {
    console.log("showFullMap called");
    // Clear the canvas
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw all cells
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
    drawEndMethod();
  };
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  console.log("Player constructor called");
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  function drawSpriteCircle(coord) {
    console.log("drawSpriteCircle called", coord);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImg(coord) {
    console.log("drawSpriteImg called", coord);
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }
}

function makeMaze() {
  console.log("makeMaze called");
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = document.getElementById("diffSelect");
  difficulty = e.options[e.selectedIndex].value;
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

  // Draw the player immediately
  player.redrawPlayer(cellSize);

  // Show entire map for 5 seconds
  draw.showFullMap();

  // After 5 seconds, show only the visible area
  setTimeout(function () {
    draw.updateVisibleArea(maze.startCoord().x, maze.startCoord().y);
  }, 1000);

  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}
