import { HttpError } from "../custom-errors.js";
import { navigate } from "../router.js";
import {
  delReqToUrl,
  getDataFromUrl,
  postDataToUrl,
  putReqToUrl,
} from "../util.js";
import { renderCms } from "./render-cms.js";
import { renderErrorPage } from "./render-error.js";
import { loadComponent } from "./renderer.js";

export function renderMazeManager(mazeId) {
  const mazeManager = document.getElementById("maze-manager");
  loadComponent(mazeManager, "/views/maze-manager.html").then(() => {
    if (!mazeId) {
      const publishBtn = document.getElementById("publish-maze-btn");
      if (publishBtn) {
        publishBtn.textContent = "Publish";
        publishBtn.onclick = () => createNewMaze();
      }

      const deleteBtn = document.getElementById("delete-maze-btn");
      if (deleteBtn) {
        deleteBtn.style.display = "none";
      }
    } else {
      getDataFromUrl(`/api/mazes/${mazeId}`)
        .then((data) => {
          document.getElementById("maze-starting-x").value =
            data.x_starting_position;
          document.getElementById("maze-starting-y").value =
            data.y_starting_position;
          document.getElementById("maze-ending-x").value =
            data.x_ending_position;
          document.getElementById("maze-ending-y").value =
            data.y_ending_position;
          document.getElementById("maze-level").value = data.maze_level;
          document.getElementById("maze-difficulty-level").value =
            data.difficulty_name;
          if (data.encoding) {
            document.getElementById("maze-encoding").value = maze.encoding;
          }
          document.getElementById(
            "maze-heading"
          ).textContent = `Maze Level ${data.maze_level}`;
          const difficultySelect = document.getElementById(
            "maze-difficulty-level"
          );
          if (difficultySelect) {
            difficultySelect.value = data.difficulty_id
              ? data.difficulty_id
              : "1";
          }
          if (data.maze_layout) {
            document.getElementById("maze-encoding").value = data.maze_layout;
          }
          drawMazeOnCanvas(
            data.maze_layout,
            data.x_starting_position,
            data.y_starting_position,
            data.x_ending_position,
            data.y_ending_position
          );
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            if (error.status === 401) {
              authError();
            } else {
              renderErrorPage(
                error.message ?? "An unexpected error has occurred",
                () => navigate("menu"),
                "Return to menu"
              );
            }
          } else {
            renderErrorPage(
              "An unexpected error has occurred",
              () => navigate("menu"),
              "Return to menu"
            );
          }
        });

      const publishBtn = document.getElementById("publish-maze-btn");
      const deleteBtn = document.getElementById("delete-maze-btn");
      if (publishBtn) {
        if (mazeId) {
          publishBtn.textContent = "Update";
        } else {
          publishBtn.textContent = "Publish";
        }
        publishBtn.onclick = () => PublishMaze(mazeId);
      }
      if (deleteBtn) {
        deleteBtn.onclick = () => deleteMaze(mazeId);
      }
    }

    const mazeEncodingInput = document.getElementById("maze-encoding");
    const mazeStartingXInput = document.getElementById("maze-starting-x");
    const mazeStartingYInput = document.getElementById("maze-starting-y");
    const mazeEndingXInput = document.getElementById("maze-ending-x");
    const mazeEndingYInput = document.getElementById("maze-ending-y");
    const mazeLevelInput = document.getElementById("maze-level");

    const inputs = [
      mazeEncodingInput,
      mazeStartingXInput,
      mazeStartingYInput,
      mazeEndingXInput,
      mazeEndingYInput,
      mazeLevelInput,
    ];

    inputs.forEach((input) => {
      input.addEventListener("input", updateDisplay);
    });
  });
}

function updateDisplay() {
  const mazeEncodingInput = document.getElementById("maze-encoding");
  const mazeStartingXInput = document.getElementById("maze-starting-x");
  const mazeStartingYInput = document.getElementById("maze-starting-y");
  const mazeEndingXInput = document.getElementById("maze-ending-x");
  const mazeEndingYInput = document.getElementById("maze-ending-y");
  const feedback = document.getElementById("encoding-feedback-text");

  const mazeEncoding = mazeEncodingInput.value
    .replaceAll("\r\n", "")
    .replaceAll("\n", "")
    .replaceAll(" ", "");
  const mazeStartingX = mazeStartingXInput.value;
  const mazeStartingY = mazeStartingYInput.value;
  const mazeEndingX = mazeEndingXInput.value;
  const mazeEndingY = mazeEndingYInput.value;
  const length = mazeEncoding.length;
  const sqrt = Math.sqrt(length);

  const error = validateInput();

  if (error) {
    feedback.textContent = error;
    feedback.style.color = "red";
    return;
  }

  feedback.textContent = `Valid grid: ${sqrt}x${sqrt}`;
  feedback.style.color = "green";
  drawMazeOnCanvas(
    mazeEncoding,
    mazeStartingX,
    mazeStartingY,
    mazeEndingX,
    mazeEndingY
  );
}

function validateInput() {
  const mazeEncodingInput = document.getElementById("maze-encoding");
  const mazeStartingXInput = document.getElementById("maze-starting-x");
  const mazeStartingYInput = document.getElementById("maze-starting-y");
  const mazeEndingXInput = document.getElementById("maze-ending-x");
  const mazeEndingYInput = document.getElementById("maze-ending-y");
  const mazeLevelInput = document.getElementById("maze-level");

  const mazeEncoding = mazeEncodingInput.value
    .replaceAll("\r\n", "")
    .replaceAll("\n", "")
    .replaceAll(" ", "");
  const mazeStartingX = parseInt(mazeStartingXInput.value, 10);
  const mazeStartingY = parseInt(mazeStartingYInput.value, 10);
  const mazeEndingX = parseInt(mazeEndingXInput.value, 10);
  const mazeEndingY = parseInt(mazeEndingYInput.value, 10);
  const mazeLevel = parseInt(mazeLevelInput.value, 10);
  const mazeDimension = Math.sqrt(mazeEncoding.length);

  if (
    mazeEncoding === null ||
    mazeEncoding === undefined ||
    mazeEncoding.length === 0
  ) {
    return "Maze encoding required";
  }
  if (mazeStartingX === null || mazeStartingX === undefined) {
    return "Start X required";
  }
  if (mazeStartingY === null || mazeStartingY === undefined) {
    return "Start Y required";
  }
  if (mazeEndingX === null || mazeEndingX === undefined) {
    return "End X required";
  }
  if (mazeEndingY === null || mazeEndingY === undefined) {
    return "End Y required";
  }
  if (mazeLevel === null || mazeLevel === undefined) {
    return "Maze level required";
  }
  if (mazeLevel <= 0) {
    return "Maze level must be larger than 0";
  }
  if (Math.floor(mazeDimension) !== mazeDimension) {
    return "Invalid grid: Length must be a perfect square (current: ${length})";
  }
  if (mazeStartingX < 0 || mazeStartingX >= mazeDimension) {
    return `X starting position must be between 0 and ${mazeDimension - 1}`;
  }
  if (mazeStartingY < 0 || mazeStartingY >= mazeDimension) {
    return `Y starting position must be between 0 and ${mazeDimension - 1}`;
  }
  if (mazeEndingX < 0 || mazeEndingX >= mazeDimension) {
    return `X ending position must be between 0 and ${mazeDimension - 1}`;
  }
  if (mazeEndingY < 0 || mazeEndingY >= mazeDimension) {
    return `Y ending position must be between 0 and ${mazeDimension - 1}`;
  }
  if (mazeStartingX === mazeEndingX && mazeStartingY === mazeEndingY) {
    return "Starting and ending positions cannot be the same";
  }

  const startIndex = mazeStartingY * mazeDimension + mazeStartingX;
  const endIndex = mazeEndingY * mazeDimension + mazeEndingX;

  if (mazeEncoding[startIndex] === "1") {
    return "Starting position cannot be on a wall";
  }

  if (mazeEncoding[endIndex] === "1") {
    return "Ending position cannot be on a wall";
  }

  return "";
}

async function createNewMaze() {
  try {
    const newMaze = {
      maze_layout: document.getElementById("maze-encoding").value,
      x_starting_position: parseInt(
        document.getElementById("maze-starting-x").value,
        10
      ),
      y_starting_position: parseInt(
        document.getElementById("maze-starting-y").value,
        10
      ),
      x_ending_position: parseInt(
        document.getElementById("maze-ending-x").value,
        10
      ),
      y_ending_position: parseInt(
        document.getElementById("maze-ending-y").value,
        10
      ),
      difficulty_id: parseInt(
        document.getElementById("maze-difficulty-level").value,
        10
      ),
      maze_level: parseInt(document.getElementById("maze-level").value, 10),
    };

    postDataToUrl("/api/mazes", newMaze)
      .then((mazeId) => {
        renderCms(mazeId);
      })
      .catch((error) => {
        if (error instanceof HttpError) {
          if (error.status === 401) {
            authError();
          } else {
            const feedback = document.getElementById("encoding-feedback-text");
            feedback.textContent =
              error.message ?? "An unexpected error has occurred";
            feedback.style.color = "red";
          }
        } else {
          renderErrorPage(
            "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      });
  } catch (error) {
    renderErrorPage(
      "An unexpected error has occurred",
      () => navigate("menu"),
      "Return to menu"
    );
  }
}

async function PublishMaze(mazeId) {
  try {
    const updatedMaze = {
      id: mazeId,
      maze_layout: document.getElementById("maze-encoding").value,
      x_starting_position: parseInt(
        document.getElementById("maze-starting-x").value,
        10
      ),
      y_starting_position: parseInt(
        document.getElementById("maze-starting-y").value,
        10
      ),
      x_ending_position: parseInt(
        document.getElementById("maze-ending-x").value,
        10
      ),
      y_ending_position: parseInt(
        document.getElementById("maze-ending-y").value,
        10
      ),
      difficulty_id: parseInt(
        document.getElementById("maze-difficulty-level").value,
        10
      ),
      maze_level: parseInt(document.getElementById("maze-level").value, 10),
    };

    putReqToUrl("/api/mazes", updatedMaze)
      .then((data) => {
        const feedback = document.getElementById("encoding-feedback-text");
        feedback.textContent = "Maze successfully edited";
        feedback.style.color = "green";
      })
      .catch((error) => {
        if (error instanceof HttpError) {
          if (error.status === 401) {
            authError();
          } else {
            const feedback = document.getElementById("encoding-feedback-text");
            feedback.textContent =
              error.message ?? "An unexpected error has occurred";
            feedback.style.color = "red";
          }
        } else {
          renderErrorPage(
            "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      });
  } catch (error) {
    renderErrorPage(
      "An unexpected error has occurred",
      () => navigate("menu"),
      "Return to menu"
    );
  }
}

async function deleteMaze(id) {
  if (!confirm("Are you sure you want to delete this maze?")) return;

  delReqToUrl(`/api/mazes/${id}`)
    .then(() => {
      renderCms();
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          authError();
        } else {
          const feedback = document.getElementById("encoding-feedback-text");
          feedback.textContent =
            error.message ?? "An unexpected error has occurred";
          feedback.style.color = "red";
        }
      } else {
        renderErrorPage(
          "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}

function drawMazeOnCanvas(maze_layout, x_start, y_start, x_end, y_end) {
  const cleanedMazeLayout = maze_layout
    .replaceAll("\r\n", "")
    .replaceAll("\n", "")
    .replaceAll(" ", "");
  const canvas = document.getElementsByTagName("canvas")[0];
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const length = cleanedMazeLayout.length;
  const sqrt = Math.sqrt(length);

  let rows = [];
  for (let i = 0; i < length; i += sqrt) {
    rows.push(cleanedMazeLayout.slice(i, i + sqrt));
  }
  const numRows = rows.length;
  const numCols = rows[0].length;

  const cellWidth = canvas.width / numCols;
  const cellHeight = canvas.height / numRows;

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      if (rows[y][x] === "1") {
        ctx.fillStyle = "#000";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    }
  }

  const startImg = new Image();
  const endImg = new Image();
  startImg.src = "/assets/g.webp";
  endImg.src = "/assets/home.png";

  let imagesLoaded = 0;
  function tryDrawImages() {
    imagesLoaded++;
    if (imagesLoaded < 2) return;
    ctx.drawImage(
      startImg,
      x_start * cellWidth,
      y_start * cellHeight,
      cellWidth,
      cellHeight
    );
    ctx.drawImage(
      endImg,
      x_end * cellWidth,
      y_end * cellHeight,
      cellWidth,
      cellHeight
    );
  }
  startImg.onload = tryDrawImages;
  endImg.onload = tryDrawImages;
}
