import { HttpError } from "../custom-errors.js";
import { navigate } from "../router.js";
import { getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { renderMazeManager } from "./render-maze-manager.js";
import { loadPage } from "./renderer.js";

const state = {
  mazes: [],
  currentMaze: null,
};

export function renderCms() {
  loadPage("/views/cms.html")
    .then(() => {
      document
        .getElementById("add-maze-btn")
        .addEventListener("click", () => renderMazeManager(state, renderMazeList, null));

      document
        .getElementById("home-button")
        .addEventListener("click", () => navigate("menu"));

      getDataFromUrl("/api/mazes").then((data) => {
        state.mazes = data;
        const buttons = document
          .getElementById("sidebar")
          .querySelectorAll(".maze-btn:not(#add-maze-btn)");
        buttons.forEach((button) => button.remove());

        state.mazes.forEach((maze) => {
          const button = document.createElement("button");
          button.className = "maze-btn";
          button.textContent = `Maze #${maze.id}`;
          button.addEventListener("click", () =>
            renderMazeManager(state, maze)
          );
          sidebar.appendChild(button);
        });
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

  function renderMazeList() {
    const buttons = sidebar.querySelectorAll(".maze-btn:not(#add-maze-btn)");
    buttons.forEach((button) => button.remove());

    state.mazes.forEach((maze) => {
      const button = document.createElement("button");
      button.className = "maze-btn";
      button.textContent = `Maze #${maze.id}`;
      button.addEventListener("click", () => renderMazeManager(state, renderMazeList, maze));
      sidebar.appendChild(button);
    });
  }
}
