import { difficultyLevels } from "../dummy-data.js";
import { renderMazeGame } from "./render-maze-game.js";
import { renderMazeDetailsPage } from "./render-maze-details.js";

function getMazeSize(mazeLayout) {
  const layoutLength = mazeLayout.length;
  const size = Math.sqrt(layoutLength);
  console.log(size)

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
      console.log(maze.id)

      cardContainer.classList.add("maze-card-container");
      cardContainer.innerHTML = content;

      cardContainer.querySelector("#maze-card-title").textContent = `Maze ${maze.id}`;
      cardContainer.querySelector("#maze-size").textContent = `${getMazeSize(maze.maze_layout)}`;
      cardContainer.querySelector("#maze-difficulty").textContent = '⭐'.repeat(maze.difficulty_id);
    
    // Add event listener to Play button
      const playBtn = cardContainer.querySelector("#play-btn-maze-card");
      if (playBtn) {
        playBtn.addEventListener("click", () => {
          renderMazeGame();
        });
      }

      // Add event listener to Leaderboard button
      const leaderboardBtn = cardContainer.querySelector("#leaderboard-btn");
      if (leaderboardBtn) {
        leaderboardBtn.addEventListener("click", () => {
          renderMazeDetailsPage(maze.id);
        });
      }

      return cardContainer;
    })
}