import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { logout } from "../util.js";
import { renderMazeGame } from "./render-maze-game.js";
export function renderLoss(maze_id) {
  loadPage("/views/game-loss.html").then(() => {
    const mainMenuBtn = document.getElementById("main-menu-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const retryBtn = document.getElementById("retry-btn");

    retryBtn.onclick = () => renderMazeGame(maze_id);
    mainMenuBtn.onclick = () => renderMainPage();
    logoutBtn.onclick = () => logout();
  });
}
