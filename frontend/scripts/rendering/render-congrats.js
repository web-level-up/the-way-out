import { loadPage } from "./renderer.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";
import { renderMazeGameTemp } from "./render-maze-game-temp.js";
import { authError, postDataToUrl } from "../util.js";

export function renderCongrats({ steps, time, mazeId }) {
  loadPage("/views/game-congrats.html").then(() => {
    const stepsElem = document.getElementById("congrats-steps");
    const timeElem = document.getElementById("congrats-time");
    if (stepsElem) stepsElem.textContent = `Steps taken: ${steps}`;
    if (timeElem) timeElem.textContent = `Time left: ${time}`;

    const playAgainBtn = document.getElementById("play-again-btn");
    const leaderboardBtn = document.getElementById("view-leaderboard-btn");

    playAgainBtn.addEventListener("click", () => {
      renderMazeGameTemp(mazeId);
    });
    leaderboardBtn.addEventListener("click", () => {
      renderLeaderboardPage();
    });
  });

  postDataToUrl("/api/mazes/completions", {
    mazeId: mazeId,
    timeTaken: time,
    stepsTaken: steps,
  })
    .then(() => {})
    .catch((error) => {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          authError();          
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          error ?? "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}
