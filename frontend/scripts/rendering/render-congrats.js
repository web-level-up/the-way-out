import { loadPage } from "./renderer.js";
import { Congrats } from "../congrats.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";
import { renderMazeGameTemp } from "./render-maze-game-temp.js";
import { authError, postDataToUrl } from "../util.js";

export function renderCongrats({ steps, time, mazeId }) {
  loadPage("/views/game-congrats.html").then(() => {
    const congrats = new Congrats(mazeId, steps, time);
    congrats.show();
    congrats.addButtonListeners(renderMazeGameTemp, renderLeaderboardPage);
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
