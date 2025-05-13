import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderMazeGame } from "./render-maze-game.js";

export function renderCongrats() {
  loadPage("/views/game-congrats.html").then(() => {});
}
