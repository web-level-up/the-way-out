import { HttpError } from "../custom-errors.js";
import { goBack, navigate } from "../router.js";
import { authError, getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { renderMazeManager } from "./render-maze-manager.js";
import { loadPage } from "./renderer.js";

export function renderCms(mazeId = null) {
  loadPage("/views/cms.html").then(() => {
    document.getElementById("add-maze-btn").addEventListener("click", () => {
      renderMazeManager(null);
      const select = document.getElementById("maze-select");
      select.selectedIndex = 0;
    });

    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));

    document
      .getElementById("back-button")
      .addEventListener("click", () => goBack());

    getDataFromUrl("/api/mazes")
      .then((data) => {
        const select = document.getElementById("maze-select");
        const placeholderOption = document.createElement("option");
        placeholderOption.textContent = "Choose a maze";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);

        data.forEach((maze) => {
          const option = document.createElement("option");
          option.value = maze.id;
          option.textContent = `Maze #${maze.id} - Level ${maze.maze_level}`;
          select.appendChild(option);
        });

        select.addEventListener("change", (e) => {
          const mazeId = e.target.value;
          renderMazeManager(mazeId);
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
