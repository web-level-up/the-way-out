import { renderMazeCard } from "./render-maze-card.js";
import { loadPage } from "./renderer.js";
import { renderErrorPage } from "./render-error.js";
import { HttpError } from "../custom-errors.js";
import { getDataFromUrl } from "../util.js";
import { navigate } from "../router.js";

export function renderMazeSelectionPage() {
  return loadPage("views/maze-selection.html").then(() => {
    const mazeContainer = document.getElementById("mazes");

    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));

    return getDataFromUrl("/api/mazes")
      .then((data) => {
        data.forEach((maze) => {
          renderMazeCard(maze).then((card) => mazeContainer.appendChild(card));
        });
      })
      .catch((error) => {
        if (error instanceof HttpError) {
          if (error.status === 401) {
            renderErrorPage(
              "Your session has expired, you will need to login again",
              () => navigate(""),
              "Return to login"
            );
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
  });
}
