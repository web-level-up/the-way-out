import { renderMazeGame } from "./render-maze-game.js";
import { loadComponent } from "./renderer.js";
import { navigate } from "../router.js";

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
  const cardContainer = document.createElement("section");
  cardContainer.classList.add("maze-card-container");

  return loadComponent(cardContainer, "./views/maze-card.html").then(() => {
    cardContainer.querySelector(
      "#maze-card-title"
    ).textContent = `Maze ${maze.maze_level}`;
    cardContainer.querySelector(
      "#maze-size"
    ).textContent = `${maze.maze_size} x ${maze.maze_size}`;
    cardContainer.querySelector("#maze-difficulty").textContent = "⭐".repeat(
      maze.difficulty_id
    );

    const playBtn = cardContainer.querySelector("#play-btn-maze-card");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        navigate("maze/game", {mazeId: maze.id})
      });
    }

    const leaderboardBtn = cardContainer.querySelector("#leaderboard-btn");
    if (leaderboardBtn) {
      leaderboardBtn.addEventListener("click", () => {
        navigate("maze/leaderboard", {mazeId: maze.id})
      });
    }
    return cardContainer;
  });
}
