import { HttpError } from "../custom-errors.js";
import { MazeGame } from "../maze-game.js";
import { navigate } from "../router.js";
import { getDataFromUrl } from "../util.js";
import { renderErrorPage } from "./render-error.js";
import { loadPage } from "./renderer.js";

export function renderMazeGame(mazeId) {
  return loadPage("views/maze-game.html").then(() => {
    const gameObject = {
      id: 17,
      maze_level: 1,
      maze_size: 8,
      maze_layout_url: "https://maze-blob.s3.af-south-1.amazonaws.com/17.txt",
      difficulty_id: 2,
      difficulty_name: "Medium",
      preview_time_seconds: 45,
      escape_time_seconds: 90,
      x_starting_position: 1,
      y_starting_position: 1,
      x_ending_position: 5,
      y_ending_position: 1,
      maze_layout:
        "1111111110001011111010111000101110111011100000111111111111111111",
    };

    getDataFromUrl(`/api/mazes/${mazeId}`)
      .then((data) => {
        const game = new MazeGame(gameObject);
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
