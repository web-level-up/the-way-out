import { loadPage } from "./renderer.js";
import { renderMazeGame } from "./render-maze-game.js";
import { authError, postDataToUrl } from "../util.js";
import { navigate } from "../router.js";
import { HttpError } from "../custom-errors.js";
import { renderErrorPage } from "./render-error.js";

export function renderCongrats(steps, timeTaken, mazeId) {
  loadPage("/views/game-congrats.html").then(() => {
    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));

    document
      .getElementById("maze-selection-btn")
      .addEventListener("click", () => navigate("maze/selection"));

    const stepsElem = document.getElementById("congrats-steps");
    const timeElem = document.getElementById("congrats-time");
    if (stepsElem) stepsElem.textContent = `Steps taken: ${steps}`;
    if (timeElem) timeElem.textContent = `Time taken: ${timeTaken}s`;

    const playAgainBtn = document.getElementById("play-again-btn");
    const leaderboardBtn = document.getElementById("view-leaderboard-btn");

    playAgainBtn.addEventListener("click", () => {
      renderMazeGame(mazeId);
    });
    leaderboardBtn.addEventListener("click", () => {
      navigate("maze/leaderboard", { mazeId: mazeId });
    });
  });

  postDataToUrl("/api/mazes/completions", {
    mazeId: mazeId,
    timeTaken: timeTaken,
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
          "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}
