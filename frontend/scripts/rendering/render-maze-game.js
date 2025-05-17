import { HttpError } from "../custom-errors.js";
import { MazeGame } from "../maze-game.js";
import { navigate } from "../router.js";
import { authError, getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { loadPage } from "./renderer.js";

export function renderMazeGame(mazeId) {
  return loadPage("views/maze-game.html").then(() => {
    let game = null;

    history.pushState({ page: 1 }, "", "");
    const popstateHandler = () => {
      leavePage(() => history.back(), game, popstateHandler);
    };
    window.addEventListener("popstate", popstateHandler);

    document
      .getElementById("home-button")
      .addEventListener("click", () =>
        leavePage(() => navigate("menu"), game, popstateHandler)
      );

    document
      .getElementById("back-button")
      .addEventListener("click", () =>
        leavePage(() => navigate("maze/selection"), game, popstateHandler)
      );

    getDataFromUrl(`/api/mazes/${mazeId}`)
      .then((data) => {
        game = new MazeGame(data, popstateHandler);
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

function leavePage(leaveFunction, game, popstateHandler) {
  const dialog = document.getElementById("close-dialog");
  const closeBtn = document.getElementById("close-btn");
  const stayBtn = document.getElementById("cancel-btn");
  dialog.showModal();

  stayBtn.onclick = () => {
    history.pushState({ page: 1 }, "", "");
    dialog.close();
  };

  closeBtn.onclick = () => {
    if (game) {
      game.endGame();
    }
    if (popstateHandler) {
      window.removeEventListener("popstate", popstateHandler);
    }
    dialog.close();
    leaveFunction();
  };
}
