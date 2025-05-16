import { loadPage } from "./renderer.js";
import { logout } from "../util.js";
import { renderMazeGame } from "./render-maze-game.js";
import { navigate } from "../router.js";
export function renderLoss(maze_id) {
  loadPage("/views/game-loss.html").then(() => {
    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));

    const mainMenuBtn = document.getElementById("main-menu-btn");
    const mazeSelectionBtn = document.getElementById("maze-selection-btn");
    const retryBtn = document.getElementById("retry-btn");

    retryBtn.onclick = () => renderMazeGame(maze_id);
    mainMenuBtn.onclick = () => navigate("menu");
    mazeSelectionBtn.onclick = () => navigate("maze/selection");
  });
}
