import { HttpError } from "../custom-errors.js";
import { navigate } from "../router.js";
import { delReqToUrl, getDataFromUrl, putReqToUrl } from "../util.js";
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
      console.log("HI");
    } else {
      console.log("hello");
    }
  });
  this.state = state
}

// Create a new maze from the form data
async function createNewMaze() {
  try {
    // Collect all field values from inputs
    const newMaze = {
      maze_layout: document.getElementById("mazeEncoding").value,
      x_starting_position: document.getElementById("mazeStartingX").value,
      y_starting_position: document.getElementById("mazeStartingY").value,
      x_ending_position: document.getElementById("mazeEndingX").value,
      y_ending_position: document.getElementById("mazeEndingY").value,
      difficulty_id: document.getElementById("mazeDifficulty").value,
      maze_level: document.getElementById("mazeLevel").value,
    };

    // Validate required fields
    if (!newMaze.maze_layout) {
      alert("Maze encoding is required");
      return;
    }

    const response = await fetch("http://localhost:3000/api/mazes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaze),
    });

    if (!response.ok) {
      throw new Error("Failed to create maze");
    }

    const createdMaze = await response.json();
    state.mazes.push(createdMaze);
    await fetchMazes(); // Refresh the maze list -- rather navigate back to cms page
    renderMazeList();
    alert("Maze created successfully!");
  } catch (error) {
    console.error("Error creating maze:", error);
    alert("Failed to create maze. Please try again.");
  }
}

async function PublishMaze(maze) {
  try {
    const updatedMaze = {
      id: state.currentMaze.id,
      maze_layout: document.getElementById("maze-encoding").value,
      x_starting_position: document.getElementById("maze-starting-x").value,
      y_starting_position: document.getElementById("maze-starting-y").value,
      x_ending_position: document.getElementById("maze-ending-x").value,
      y_ending_position: document.getElementById("maze-ending-y").value,
      difficulty_id: document.getElementById("maze-difficulty-level").value,
      maze_level: document.getElementById("maze-level").value,
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

    const index = state.mazes.findIndex((m) => m.id === maze.id);
    state.mazes[index] = result;

    alert("Maze published successfully!");
  } catch (error) {
    console.error("Error updating maze:", error);
    alert("Failed to update maze. Please try again.");
  }
}

async function deleteMaze(id) {
  if (!confirm("Are you sure you want to delete this maze?")) return;

  delReqToUrl(`/api/mazes/${id}`)
    .then((data) => {
      state.mazes = state.mazes.filter((maze) => maze.id !== id);
    })
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

  try {
    renderMazeList();

    // Clear the maze details container
    while (mazeDetails.firstChild) {
      mazeDetails.removeChild(mazeDetails.firstChild);
    }

    // Create and append the message element
    const messageElement = document.createElement("p");
    messageElement.textContent =
      "Select a maze from the sidebar to view details";
    mazeDetails.appendChild(messageElement);
  } catch (error) {
    console.error("Error deleting maze:", error);
    alert("Failed to delete maze. Please try again.");
  }
}
