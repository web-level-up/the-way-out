import { loadPage } from "./renderer.js";
import { logout } from "../util.js";
import { renderMazeGame } from "./render-maze-game.js";
import { navigate } from "../router.js";
export function renderLoss(maze_id) {
  loadPage("/views/game-loss.html").then(() => {
    const mainMenuBtn = document.getElementById("main-menu-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const retryBtn = document.getElementById("retry-btn");

    retryBtn.onclick = () => renderMazeGame(maze_id);
    mainMenuBtn.onclick = () => navigate("menu");
    logoutBtn.onclick = () => logout();
  });
}
