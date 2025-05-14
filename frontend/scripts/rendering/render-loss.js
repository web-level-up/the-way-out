import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import {getDataFromUrl, logout} from "../util.js";
import { renderMazeGame } from "./render-maze-game.js";
import { renderMazeSelectionPage } from "./render-maze-selection-page.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";

export function renderLoss() {
  loadPage("./views/game-loss.html").then(() => {
    document
          .getElementById("main-page")
          .addEventListener("click", renderMainPage);
    document
          .getElementById("logout")
          .addEventListener("click", logout);
  });
}
