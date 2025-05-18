import { HttpError } from "../custom-errors.js";
import { navigate } from "../router.js";
import { delReqToUrl, getDataFromUrl, putReqToUrl } from "../util.js";
import { renderCms } from "./render-cms.js";
import { renderErrorPage } from "./render-error.js";
import { loadComponent, loadPage } from "./renderer.js";

const state = {
  mazes: [],
  currentMaze: null,
};

export function renderMazeManager(state, renderMazeList, maze = null) {
  const mazeManager = document.getElementById("maze-manager");
  loadComponent(mazeManager, "/views/maze-manager.html").then(() => {
    if (!maze) {
      // Set up publish button to create a new maze
      const publishBtn = document.getElementById("publishMazeBtn");
      if (publishBtn) {
        publishBtn.textContent = "Publish";
        publishBtn.onclick = () => createNewMaze();
      }
      // Hide the delete button
      const deleteBtn = document.getElementById("deleteMazeBtn");
      if (deleteBtn) {
        deleteBtn.style.display = "none";
      }
      return;
    } else {
      console.log("hello");
      console.log(maze);
      document.getElementById("maze-starting-x").value =
        maze.x_starting_position;
      document.getElementById("maze-starting-y").value =
        maze.y_starting_position;
      document.getElementById("maze-ending-x").value = maze.x_ending_position;
      document.getElementById("maze-ending-y").value = maze.y_ending_position;
      document.getElementById("maze-level").value = maze.maze_level;
      document.getElementById("maze-difficulty-level").value =
        maze.difficulty_name; // maze.difficulty_id; // or maze.difficulty_name

      // If you have a maze encoding property:
      if (maze.encoding) {
        document.getElementById("maze-encoding").value = maze.encoding;
      }

      // Optionally set the heading:
      document.getElementById(
        "maze-heading"
      ).textContent = `Maze Level ${maze.maze_level}`;

      // Set the difficulty dropdown value correctly
      const difficultySelect = document.getElementById("maze-difficulty-level");
      if (difficultySelect) {
        if (maze.difficulty_id) {
          difficultySelect.value = maze.difficulty_id;
        } else {
          difficultySelect.value = "1"; // Default to Easy
        }
      }

      showMazeDetails(maze);

      // Add event listeners for publish and delete buttons
      const publishBtn = document.getElementById("publishMazeBtn");
      const deleteBtn = document.getElementById("deleteMazeBtn");
      if (publishBtn) {
        if (maze && maze.id) {
          publishBtn.textContent = "Update";
        } else {
          publishBtn.textContent = "Publish";
        }
        publishBtn.onclick = () => PublishMaze(maze);
      }
      if (deleteBtn) {
        deleteBtn.onclick = () => deleteMaze(maze.id);
      }
    }
  });
  //this.state = state
}

// Create a new maze from the form data
async function createNewMaze() {
  try {
    // Collect all field values from inputs
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

    // Validate required fields
    if (!newMaze.maze_layout) {
      alert("Maze encoding is required");
      return;
    }
    if (!newMaze.x_starting_position) {
      alert("x starting position is required");
      return;
    }
    if (!newMaze.y_starting_position) {
      alert("y starting position is required");
      return;
    }
    if (!newMaze.x_ending_position) {
      alert("x ending position is required");
      return;
    }
    if (!newMaze.y_ending_position) {
      alert("y ending position is required");
      return;
    }

    if (!newMaze.difficulty_id) {
      alert("difficulty is required");
      return;
    }

    if (!newMaze.maze_level) {
      alert("maze level is required");
      return;
    }

    const response = await fetch("http://localhost:3000/api/mazes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaze),
    });
    console.log("new maze: ", newMaze);
    if (!response.ok) {
      const errorMsg = await response.text();
      console.error("Failed to create maze:", errorMsg);
      throw new Error("Failed to create maze: " + errorMsg);
    }

    // const createdMaze = await response.json();
    // state.mazes.push(createdMaze);
    // await fetchMazes(); // Refresh the maze list -- rather navigate back to cms page
    // renderMazeList();
    alert("Maze created successfully!");
  } catch (error) {
    console.error("Error creating maze:", error);
    alert("Failed to create maze. Please try again.");
  }
}

async function PublishMaze(maze) {
  console.log("Publishing maze : ", maze);
  try {
    const updatedMaze = {
      id: maze.id,
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
      .then((data) => {})
      .catch((error) => {
        if (error instanceof HttpError) {
          if (error.status === 401) {
            renderErrorPage(
              "Your session has expired, you will need to login again",
              () => navigate(""),
              "Return to login"
            );
          } else {
            renderErrorPage(
              error.message ?? "An unexpected error has occurred",
              () => navigate("menu"),
              "Return to menu"
            );
          }
        } else {
          renderErrorPage(
            error ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      });

    // const index = state.mazes.findIndex((m) => m.id === maze.id);
    // state.mazes[index] = result;

    alert("Maze published successfully!");
    renderCms();
  } catch (error) {
    console.error("Error updating maze:", error);
    alert("Failed to update maze. Please try again.");
  }
}

async function deleteMaze(id) {
  if (!confirm("Are you sure you want to delete this maze?")) return;

  delReqToUrl(`/api/mazes/${id}`)
    .then((data) => {
      console.log("Maze deleted successfully:", data);
      renderCms();
      //state.mazes = state.mazes.filter((maze) => maze.id !== id);
    })
    .catch((error) => {
      console.log("error message: ", error.message);
      if (error instanceof HttpError) {
        if (error.status === 401) {
          renderErrorPage(
            "Your session has expired, you will need to login again",
            () => navigate(""),
            "Return to login"
          );
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          error ?? "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });

  try {
    // renderMazeList();
    // // Clear the maze details container
    // while (mazeDetails.firstChild) {
    //   mazeDetails.removeChild(mazeDetails.firstChild);
    // }
    // // Create and append the message element
    // const messageElement = document.createElement("p");
    // messageElement.textContent =
    //   "Select a maze from the sidebar to view details";
    // mazeDetails.appendChild(messageElement);
  } catch (error) {
    console.error("Error deleting maze:", error);
    alert("Failed to delete maze. Please try again.");
  }
}

function renderMaze(maze) {
  const detailsWrapper = document.getElementById("maze-details-wrapper");
  detailsWrapper.innerHTML = ""; // Clear previous content

  // Details section (form)
  const detailsSection = document.createElement("section");
  detailsSection.className = "maze-details";

  // Heading
  const heading = document.createElement("h2");
  heading.textContent = `Maze #${maze.id}`;
  detailsSection.appendChild(heading);

  // Start/End positions, Level, Difficulty, Encoding, etc.
  // (Use the same structure as CMS's showMazeDetails)
  // ... (repeat the createLabel/createTextField logic from CMS)

  // Example for starting X:
  const startXLabel = document.createElement("p");
  startXLabel.innerHTML = "<strong>Start X</strong>";
  detailsSection.appendChild(startXLabel);

  const startXInput = document.createElement("input");
  startXInput.type = "number";
  startXInput.value = maze.x_starting_position;
  startXInput.id = "maze-starting-x";
  detailsSection.appendChild(startXInput);

  // Repeat for other fields...

  // Encoding textarea
  const encodingLabel = document.createElement("p");
  encodingLabel.innerHTML = "<strong>Maze Encoding:</strong>";
  detailsSection.appendChild(encodingLabel);

  const encodingTextarea = document.createElement("textarea");
  encodingTextarea.id = "maze-encoding";
  encodingTextarea.rows = 4;
  encodingTextarea.value = maze.maze_layout || "";
  detailsSection.appendChild(encodingTextarea);

  // Feedback
  const feedback = document.createElement("p");
  feedback.id = "encoding-feedback-text";
  detailsSection.appendChild(feedback);

  // Action buttons
  // ...

  detailsWrapper.appendChild(detailsSection);

  // Canvas section
  const canvasSection = document.createElement("section");
  canvasSection.className = "maze-details";
  const canvas = document.createElement("canvas");
  canvas.id = "mazeCanvas";
  canvas.className = "maze-canvas";
  canvas.width = 400;
  canvas.height = 400;
  canvasSection.appendChild(canvas);
  detailsWrapper.appendChild(canvasSection);

  // Draw maze, add event listeners, etc.
}

async function showMazeDetails(maze) {
  if (maze.id) {
    const response = await fetch(`http://localhost:3000/api/mazes/${maze.id}`);
    let maze_layout = await response.json();
    console.log(maze_layout);
    // If you have a maze encoding property:
    if (maze_layout.maze_layout) {
      document.getElementById("maze-encoding").value = maze_layout.maze_layout;
    }
    drawMazeOnCanvas(
      maze_layout.maze_layout,
      maze_layout.x_starting_position,
      maze_layout.y_starting_position,
      maze_layout.x_ending_position,
      maze_layout.y_ending_position
    );
  } else {
    //maze.id = "new";
  }
}

function drawMazeOnCanvas(maze_layout, x_start, y_start, x_end, y_end) {
  // Find the canvas element
  const canvas = document.getElementsByTagName("canvas")[0];
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Parse the layout into rows
  const rows = maze_layout.trim().split(/\r?\n/);
  const numRows = rows.length;
  const numCols = rows[0].length;

  // Set cell size based on canvas size
  const cellWidth = canvas.width / numCols;
  const cellHeight = canvas.height / numRows;

  // Draw each cell
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      if (rows[y][x] === "1") {
        ctx.fillStyle = "#000"; // Wall
      } else {
        ctx.fillStyle = "#fff"; // Path
      }
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight); // Optional: grid lines
    }
  }

  // Load images for start and end
  const startImg = new Image();
  const endImg = new Image();
  startImg.src = "/assets/g.webp";
  endImg.src = "/assets/home.png";

  // Draw images when both are loaded
  let imagesLoaded = 0;
  function tryDrawImages() {
    imagesLoaded++;
    if (imagesLoaded < 2) return;
    // Draw start position (g.webp)
    ctx.drawImage(
      startImg,
      x_start * cellWidth,
      y_start * cellHeight,
      cellWidth,
      cellHeight
    );
    // Draw end position (home.png)
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
