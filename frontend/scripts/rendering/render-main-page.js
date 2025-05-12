import {getDataFromUrl, logout} from "../util.js";
import { renderMazeSelectionPage } from "./render-maze-selection-page.js";
import { loadPage } from "./renderer.js";
import {renderLeaderboardPage} from "./render-leaderboard-page.js";
import {getConfig} from "../config-loader.js";
import {HttpError} from "../custom-errors.js";

export function renderMainPage() {
  return loadPage("views/main-page.html").then(() => {
    document
      .getElementById("maze-selection")
      .addEventListener("click", renderMazeSelectionPage);
    document
      .getElementById("leaderboard")
      .addEventListener("click", renderLeaderboardPage);
    document
      .getElementById("logout")
      .addEventListener("click", logout);
    document
      .getElementById("welcome").textContent =
        `Welcome ${localStorage.getItem("username")}! Do You Remember the Way Out?`

    retrieveAndStoreMazes();
  });
}

function retrieveAndStoreMazes() {
  getDataFromUrl("/api/mazes")
    .then((mazes) => {
      console.log('mazes', mazes);

      localStorage.setItem('mazes', JSON.stringify(mazes));
    });
}