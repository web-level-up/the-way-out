import { loadPage } from "./renderer.js";
import { renderMazeSelectionPage } from "./render-maze-selection-page.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";
import { renderMainPage } from "./render-main-page.js";
import { renderMazeGame } from "./render-maze-game.js";

export function renderCongrats() {
  loadPage("./views/game-congrats.html").then(() => {
    document
          .getElementById("maze-selection")
          .addEventListener("click", renderMazeSelectionPage);
    document
          .getElementById("leaderboard")
          .addEventListener("click", renderLeaderboardPage);
    document
          .getElementById("main-page")
          .addEventListener("click", renderMainPage);
  });
}
