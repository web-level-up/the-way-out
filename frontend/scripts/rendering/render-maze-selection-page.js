import { dummyMazes } from "../dummy-data.js";
import { getConfig } from "../config-loader.js";
import { renderMazeCard } from "./render-maze-card.js";
import { loadPage } from "./renderer.js";

export function renderMazeSelectionPage() {
  return loadPage("views/maze-selection.html").then(() => {
    const mazeContainer = document.getElementById("mazes");

    // const config = getConfig();
    // return fetch(config.apiBaseUrl + "/api/mazes", {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    //   },
    //   signal: AbortSignal.timeout(5000),
    // })
    //   .then(async (response) => {
    //     if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new HttpError(response.status, errorData.error);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     data.forEach((maze) => {
    //       renderMazeCard(maze).then((card) =>
    //         mazeContainer.appendChild(card)
    //       );
    //     });
    //   })
    //   .catch((error) => {
    //     if (error instanceof HttpError) {
    //       if ((error.status = 401)) {
    //         renderErrorPage(
    //           "Your session has expired, you will need to login again",
    //           renderLoginPage,
    //           "return to login"
    //         );
    //       } else {
    //         renderErrorPage(
    //           error.message ?? "An unexpected error has occurred",
    //           renderMazeSelectionPage,
    //           "return to selection page"
    //         );
    //       }
    //     } else {
    //       renderErrorPage(
    //         error ?? "An unexpected error has occurred",
    //         renderMazeSelectionPage,
    //         "return to selection page"
    //       );
    //     }
    //   });

    dummyMazes.forEach((maze) => {
      renderMazeCard(maze).then((card) => mazeContainer.appendChild(card));
    });
  });
}
