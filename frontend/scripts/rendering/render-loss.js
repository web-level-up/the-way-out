import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderMazeGame } from "./render-maze-game.js";
import { renderMazeSelectionPage } from "./render-maze-selection-page.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";

export function renderLoss() {
  loadPage("./views/game-loss.html").then(() => {
    document
          .getElementById("maze-selection")
          .addEventListener("click", renderMazeSelectionPage);
    document
          .getElementById("leaderboard")
          .addEventListener("click", renderLeaderboardPage);
  });
}
