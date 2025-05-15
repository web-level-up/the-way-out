import { MazeGame } from "../maze-game-temp.js";
import { loadPage } from "./renderer.js";
import { fetchMazeById } from "../api/mazeApi.js";
import { toggleTheme } from "../util.js";

export function renderMazeGameTemp() {
  return loadPage("views/maze-game-temp.html").then(() => {
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) themeBtn.onclick = toggleTheme;
    const gameObject = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 1 },
      mazeId: 1,
      mazeLayout:
        "1111111110001011111010111000101110111011100000111111111111111111",
    };
    fetchMazeById(gameObject.mazeId)
      .then((data) => {
        console.log("Maze data:", data);
        const game = new MazeGame(gameObject);
      })
      .catch((error) => {
        console.error("Error fetching maze:", error);
      });
    console.log("Done fetching maze");
  });
}
