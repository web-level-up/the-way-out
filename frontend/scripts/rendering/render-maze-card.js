import { loadComponent } from "./renderer.js";
import { navigate } from "../router.js";

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
    cardContainer.querySelector("#maze-difficulty").textContent =
      maze.difficulty_name;
    cardContainer.querySelector(
      "#maze-difficulty"
    ).title = `Difficulty: ${maze.difficulty_name}\nPreview time: ${maze.preview_time_seconds}s\nEscape time ${maze.escape_time_seconds}s`;

    const playBtn = cardContainer.querySelector("#play-btn-maze-card");
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        navigate("maze/game", { mazeId: maze.id });
      });
    }

    const leaderboardBtn = cardContainer.querySelector("#leaderboard-btn");
    if (leaderboardBtn) {
      leaderboardBtn.addEventListener("click", () => {
        navigate("maze/leaderboard", { mazeId: maze.id });
      });
    }
    return cardContainer;
  });
}
