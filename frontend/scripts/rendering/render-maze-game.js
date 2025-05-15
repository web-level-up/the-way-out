import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderLoss } from "./render-loss.js";
import { renderCongrats } from "./render-congrats.js";

export function renderMazeGame() {
  loadPage("/views/maze-game.html").then(() => {
    console.log("Game page loaded");
  });
}

// // In render-congrats.js
window.renderCongrats = function () {
  renderCongrats();
};

window.renderLoss = function () {
  console.log("YOU LOSE!!!");
  renderLoss();
};
