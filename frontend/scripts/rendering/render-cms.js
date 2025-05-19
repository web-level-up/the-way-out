import { HttpError } from "../custom-errors.js";
import { goBack, navigate } from "../router.js";
import { authError, getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { renderMazeManager } from "./render-maze-manager.js";
import { loadPage } from "./renderer.js";

export function renderCms(mazeId = null) {
  loadPage("/views/cms.html").then(() => {
    document
      .getElementById("add-maze-btn")
      .addEventListener("click", () => renderMazeManager(null));

    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));

    document
      .getElementById("back-button")
      .addEventListener("click", () => goBack());

    getDataFromUrl("/api/mazes")
      .then((data) => {
        const buttons = document
          .getElementById("sidebar")
          .querySelectorAll(".maze-btn:not(#add-maze-btn)");
        buttons.forEach((button) => button.remove());

        data.forEach((maze) => {
          const button = document.createElement("button");
          button.className = "maze-btn";
          button.textContent = `Maze #${maze.maze_level}`;
          button.addEventListener("click", () => {
            renderMazeManager(maze.id);
          });
          sidebar.appendChild(button);
        });

        renderMazeManager(mazeId);
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
            error ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      });
  });
}
