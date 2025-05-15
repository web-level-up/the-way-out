import { loadPage } from "./renderer.js";
import { renderLoss } from "./render-loss.js";
import { renderCongrats } from "./render-congrats.js";

export function renderMazeGame() {
  loadPage("/views/maze-game.html").then(() => {
    console.log("Game page loaded");
  });
}

window.renderCongrats = function () {
  renderCongrats();
};

window.renderLoss = function () {
  renderLoss();
};
