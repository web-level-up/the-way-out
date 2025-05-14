const state = {
  mazes: [],
  currentMaze: null,
};

const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");
const mazeDetails = document.getElementById("mazeDetails");
const addMazeBtn = document.getElementById("addMazeBtn");

const API_URL = "http://localhost:3000/api/mazes";

async function fetchMazes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch mazes");
    }
    state.mazes = await response.json();
    renderMazeList();
  } catch (error) {
    console.error("Error fetching mazes:", error);
    alert("Failed to load mazes. Please try again later.");
  }
}

function renderMazeList() {
  const buttons = sidebar.querySelectorAll(".maze-btn:not(#addMazeBtn)");
  buttons.forEach((button) => button.remove());

  state.mazes.forEach((maze) => {
    const button = document.createElement("button");
    button.className = "maze-btn";
    button.textContent = `Maze #${maze.id}`;
    button.addEventListener("click", () => showMazeDetails(maze));
    sidebar.appendChild(button);
  });
}

async function showMazeDetails(maze) {
  state.currentMaze = maze;

  const response = await fetch(`http://localhost:3000/api/mazes/${maze.id}`);
  maze = await response.json();
  
  // Clear previous content
  while (mazeDetails.firstChild) {
    mazeDetails.removeChild(mazeDetails.firstChild);
  }
  
  // Create maze details container
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "maze-details";
  
  // Create heading
  const heading = document.createElement("h2");
  heading.textContent = `Maze #${maze.id}`;
  detailsContainer.appendChild(heading);
  
  // Create ID paragraph
  const idParagraph = document.createElement("p");
  const idStrong = document.createElement("strong");
  idStrong.textContent = "ID: ";
  idParagraph.appendChild(idStrong);
  idParagraph.appendChild(document.createTextNode(maze.id));
  detailsContainer.appendChild(idParagraph);
  
  // Create input fields
  const createTextField = (id, value) => {
    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.rows = 1;
    textarea.cols = 50;
    textarea.value = value;
    return textarea;
  };
  
  detailsContainer.appendChild(createTextField("mazeStartingX", maze.x_starting_position));
  detailsContainer.appendChild(createTextField("mazeStartingY", maze.y_starting_position));
  detailsContainer.appendChild(createTextField("mazeEndingX", maze.x_ending_position));
  detailsContainer.appendChild(createTextField("mazeEndingY", maze.y_ending_position));
  detailsContainer.appendChild(createTextField("mazeLevel", maze.maze_level));
  detailsContainer.appendChild(createTextField("mazeDifficulty", maze.difficulty_name));
  
  // Create encoding section
  const encodingDiv = document.createElement("div");
  
  const encodingLabel = document.createElement("label");
  encodingLabel.htmlFor = "mazeEncoding";
  const encodingStrong = document.createElement("strong");
  encodingStrong.textContent = "Encoding:";
  encodingLabel.appendChild(encodingStrong);
  encodingDiv.appendChild(encodingLabel);
  
  const encodingTextarea = createTextField("mazeEncoding", maze.maze_layout);
  encodingDiv.appendChild(encodingTextarea);
  
  const feedbackDiv = document.createElement("div");
  feedbackDiv.id = "encodingFeedback";
  encodingDiv.appendChild(feedbackDiv);
  
  detailsContainer.appendChild(encodingDiv);
  mazeDetails.appendChild(detailsContainer);
  
  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.id = "mazeCanvas";
  canvas.className = "maze-canvas";
  canvas.width = 500;
  canvas.height = 500;
  mazeDetails.appendChild(canvas);
  
  // Create action buttons
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "maze-actions";
  
  const publishBtn = document.createElement("button");
  publishBtn.id = "publishMazeBtn";
  publishBtn.textContent = "Publish";
  publishBtn.addEventListener("click", () => {
    PublishMaze(maze);
  });
  
  const deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteMazeBtn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteMaze(maze.id));
  
  actionsDiv.appendChild(publishBtn);
  actionsDiv.appendChild(deleteBtn);
  mazeDetails.appendChild(actionsDiv);

  drawMaze(maze.maze_layout);

  // Add event listener to the encoding input
  const mazeEncodingInput = document.getElementById("mazeEncoding");
  mazeEncodingInput.addEventListener("input", () => {
    const encoding = mazeEncodingInput.value;
    const feedback = document.getElementById("encodingFeedback");

    // Check if length is a perfect square
    const length = encoding.length;
    const sqrt = Math.sqrt(length);

    if (Math.floor(sqrt) === sqrt) {
      feedback.textContent = `Valid grid: ${sqrt}x${sqrt}`;
      feedback.style.color = "green";
      drawMaze(encoding);
    } else {
      feedback.textContent = `Invalid grid: Length must be a perfect square (current: ${length})`;
      feedback.style.color = "red";
    }
  });
}

// Draw the maze on the canvas based on the encoding
function drawMaze(encoding) {
  const canvas = document.getElementById("mazeCanvas");
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parse the encoding and draw the maze
  // This will depend on your specific encoding format
  // Example implementation for a simple grid-based encoding:

  const rows = Math.sqrt(encoding.length);
  const cellSize = canvas.width / rows;

  for (let i = 0; i < encoding.length; i++) {
    const row = Math.floor(i / rows);
    const col = i % rows;
    const x = col * cellSize;
    const y = row * cellSize;

    // Example: '1' represents a wall, '0' represents an open path
    if (encoding[i] === "1") {
      ctx.fillStyle = "#000";
      ctx.fillRect(x, y, cellSize, cellSize);
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  }
}

// Add a new maze
async function addMaze() {
  const encoding = prompt("Enter maze encoding:");
  if (!encoding) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encoding }),
    });

    if (!response.ok) {
      throw new Error("Failed to add maze");
    }

    const newMaze = await response.json();
    state.mazes.push(newMaze);
    renderMazeList();
    showMazeDetails(newMaze);
  } catch (error) {
    console.error("Error adding maze:", error);
    alert("Failed to add maze. Please try again.");
  }
}

// Edit an existing maze
async function PublishMaze(maze) {
  try {
    // Collect all field values from inputs
    const updatedMaze = {
      id: state.currentMaze.id,
      maze_layout: document.getElementById("mazeEncoding").value,
      x_starting_position: document.getElementById("mazeStartingX").value,
      y_starting_position: document.getElementById("mazeStartingY").value,
      x_ending_position: document.getElementById("mazeEndingX").value,
      y_ending_position: document.getElementById("mazeEndingY").value,
      maze_level: document.getElementById("mazeLevel").value,
    };

    // Check if anything has changed
    const hasChanges = Object.keys(updatedMaze).some(
      (key) => updatedMaze[key] !== maze[key]
    );

    if (!hasChanges) {
      console.log("No changes detected");
      return;
    }

    const response = await fetch(`http://localhost:3000/api/mazes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMaze),
    });

    if (!response.ok) {
      throw new Error("Failed to update maze");
    }

    const result = await response.text();
    const index = state.mazes.findIndex((m) => m.id === maze.id);
    state.mazes[index] = result;

    alert("Maze published successfully!");
    showMazeDetails(result);
  } catch (error) {
    console.error("Error updating maze:", error);
    alert("Failed to update maze. Please try again.");
  }
}

// Delete a maze
async function deleteMaze(id) {
  if (!confirm("Are you sure you want to delete this maze?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete maze");
    }

    state.mazes = state.mazes.filter((maze) => maze.id !== id);
    renderMazeList();
    mazeDetails.innerHTML =
      "<p>Select a maze from the sidebar to view details</p>";
  } catch (error) {
    console.error("Error deleting maze:", error);
    alert("Failed to delete maze. Please try again.");
  }
}

// Event listeners
addMazeBtn.addEventListener("click", addMaze);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  fetchMazes();
});
