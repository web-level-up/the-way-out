import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderMazeGame } from "./render-maze-game.js";

export function renderLoss() {
  loadPage("/views/game-loss.html").then(() => {});
}
