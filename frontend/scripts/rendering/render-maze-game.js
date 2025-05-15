import { MazeGame } from "../maze-game.js";
import { loadPage } from "./renderer.js";
import { fetchMazeById } from "../api/mazeApi.js";

export function renderMazeGame() {
  return loadPage("views/maze-game.html").then(() => {
    document.body.classList.add("light-mode");
    const themeBtn = document.getElementById("theme-toggle-btn");
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
