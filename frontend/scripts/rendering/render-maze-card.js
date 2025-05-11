import {difficultyLevels} from "../dummy-data.js";

function getMazeSize(mazeLayout) {
  const layoutLength = mazeLayout.length;
  const size = Math.sqrt(layoutLength);

  if (Number.isInteger(size)) {
    return `${size} x ${size}`;
  } else {
    return NaN;
  }
}

export function renderMazeCard(maze) {
  return fetch(`views/maze-card.html`)
    .then(response => response.text())
    .then(content => {
      const cardContainer = document.createElement("section");

      cardContainer.classList.add("maze-card-container");
      cardContainer.innerHTML = content;

      cardContainer.querySelector("#maze-card-title").textContent = `Maze ${maze.id}`;
      cardContainer.querySelector("#maze-size").textContent = `${getMazeSize(maze.maze_layout)}`;
      cardContainer.querySelector("#maze-difficulty").textContent = '⭐'.repeat(maze.difficulty_level_id);
      cardContainer.querySelector("#maze-time-record").textContent = `Best Time: ${"N/A"}`;
      cardContainer.querySelector("#maze-step-record").textContent = `Best Steps Taken: ${"N/A"}`;

      return cardContainer;
    })
}