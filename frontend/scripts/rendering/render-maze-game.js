import { HttpError } from "../custom-errors.js";
import { MazeGame } from "../maze-game.js";
import { navigate } from "../router.js";
import { getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { loadPage } from "./renderer.js";

export function renderMazeGame(mazeId) {
  return loadPage("views/maze-game.html").then(() => {

    getDataFromUrl(`/api/mazes/${mazeId}`)
      .then((data) => {
        const game = new MazeGame(data);
      })
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
  });
}
