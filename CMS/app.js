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

  // Remove active class from all maze buttons
  const allMazeButtons = sidebar.querySelectorAll(".maze-btn:not(#addMazeBtn)");
  allMazeButtons.forEach((btn) => btn.classList.remove("active"));

  // Add active class to the selected maze button
  if (maze.id) {
    const selectedButton = sidebar.querySelector(
      `.maze-btn:not(#addMazeBtn):nth-child(${
        state.mazes.findIndex((m) => m.id === maze.id) + 2
      })`
    );
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }

  if (maze.id) {
    const response = await fetch(`http://localhost:3000/api/mazes/${maze.id}`);
    maze = await response.json();
  } else {
    maze.id = "new";
  }

  // Clear previous content
  while (mazeDetails.firstChild) {
    mazeDetails.removeChild(mazeDetails.firstChild);
  }

  // Create maze details container
  const detailsContainer = document.createElement("section");
  detailsContainer.className = "maze-details";

  // Create heading
  const heading = document.createElement("h2");
  heading.textContent = `Maze #${maze.id}`;
  detailsContainer.appendChild(heading);

  // Create p for field names
  const createLabel = (text) => {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = text;
    paragraph.appendChild(strong);
    return paragraph;
  };

  // Create input fields - updated to use appropriate input elements
  const createTextField = (id, value, type = "text") => {
    if (id === "mazeEncoding") {
      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.rows = 4;
      textarea.value = value;
      return textarea;
    } else {
      const input = document.createElement("input");
      input.id = id;
      input.type = type;
      input.value = value;
      return input;
    }
  };

  const startingPositionLabels = document.createElement("section");
  startingPositionLabels.className = "details-double-input";
  startingPositionLabels.appendChild(createLabel("Start X"));
  startingPositionLabels.appendChild(createLabel("Start Y"));
  detailsContainer.appendChild(startingPositionLabels);

  const startingPositionInputs = document.createElement("section");
  startingPositionInputs.className = "details-double-input";
  startingPositionInputs.appendChild(
    createTextField("mazeStartingX", maze.x_starting_position, "number")
  );
  startingPositionInputs.appendChild(
    createTextField("mazeStartingY", maze.y_starting_position, "number")
  );
  detailsContainer.appendChild(startingPositionInputs);

  const endingPositionLabels = document.createElement("section");
  endingPositionLabels.className = "details-double-input";
  endingPositionLabels.appendChild(createLabel("End X"));
  endingPositionLabels.appendChild(createLabel("End Y"));
  detailsContainer.appendChild(endingPositionLabels);

  const endingPositionInputs = document.createElement("section");
  endingPositionInputs.className = "details-double-input";
  endingPositionInputs.appendChild(
    createTextField("mazeEndingX", maze.x_ending_position, "number")
  );
  endingPositionInputs.appendChild(
    createTextField("mazeEndingY", maze.y_ending_position, "number")
  );
  detailsContainer.appendChild(endingPositionInputs);

  const levelLabels = document.createElement("section");
  levelLabels.className = "details-double-input";
  levelLabels.className = "details-double-input";
  levelLabels.appendChild(createLabel("Difficulty Level"));
  levelLabels.appendChild(createLabel("Maze Level"));
  detailsContainer.appendChild(levelLabels);

  const levelInputs = document.createElement("section");
  levelInputs.className = "details-double-input";
  levelInputs.appendChild(
    createTextField("mazeLevel", maze.maze_level, "number")
  );
  levelInputs.appendChild(
    createTextField("mazeDifficulty", maze.difficulty_id, "number")
  );
  detailsContainer.appendChild(levelInputs);

  // Create encoding section - this remains a textarea
  detailsContainer.appendChild(createLabel("Maze Encoding:"));
  const encodingTextarea = createTextField("mazeEncoding", maze.maze_layout);
  detailsContainer.appendChild(encodingTextarea);

  // Add encoding feedback element
  const feedbackElement = document.createElement("p");
  feedbackElement.id = "encodingFeedback";
  detailsContainer.appendChild(feedbackElement);

  // Create action buttons
  const actionsSection = document.createElement("section");
  actionsSection.className = "maze-actions details-double-input";

  const publishBtn = document.createElement("button");
  publishBtn.id = "publishMazeBtn";
  publishBtn.textContent = "Publish";
  publishBtn.addEventListener("click", () => {
    PublishMaze(maze);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteMazeBtn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteMaze(state.currentMaze.id));

  actionsSection.appendChild(publishBtn);
  actionsSection.appendChild(deleteBtn);
  detailsContainer.appendChild(actionsSection);

  mazeDetails.appendChild(detailsContainer);

  const mazeContainer = document.createElement("section");
  mazeContainer.className = "maze-details";
  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.id = "mazeCanvas";
  canvas.className = "maze-canvas";
  canvas.width = 500;
  canvas.height = 500;
  mazeContainer.appendChild(canvas);
  mazeDetails.appendChild(mazeContainer);

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
  // Create a blank maze template
  const blankMaze = {
    maze_layout: "",
    x_starting_position: 0,
    y_starting_position: 0,
    x_ending_position: 0,
    y_ending_position: 0,
    maze_level: state.mazes.length + 1,
    difficulty_id: 1,
  };

  // Show the edit screen for the new maze
  showMazeDetails(blankMaze);

  // Update publish button behavior for new mazes
  const publishBtn = document.getElementById("publishMazeBtn");
  if (publishBtn) {
    publishBtn.textContent = "Create";

    // Remove all existing click listeners using cloneNode
    const newButton = publishBtn.cloneNode(true);
    publishBtn.parentNode.replaceChild(newButton, publishBtn);

    // Add the new event listener to the fresh button
    newButton.addEventListener("click", () => {
      createNewMaze();
    });
  }
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
    await fetchMazes(); // Refresh the maze list
    renderMazeList();
    alert("Maze created successfully!");
  } catch (error) {
    console.error("Error creating maze:", error);
    alert("Failed to create maze. Please try again.");
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
      difficulty_id: document.getElementById("mazeDifficulty").value,
      maze_level: document.getElementById("mazeLevel").value,
    };

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
  } catch (error) {
    console.error("Error updating maze:", error);
    alert("Failed to update maze. Please try again.");
  }
}

// Delete a maze
async function deleteMaze(id) {
  if (!confirm("Are you sure you want to delete this maze?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/mazes/${id}`, {
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
