import { MazeGame } from "../maze-game-temp.js";
import { loadPage } from "./renderer.js";

export function renderMazeGameTemp(mazeId) {
  return loadPage("views/maze-game-temp.html").then(() => {
    const gameObject = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 1 },
      mazeId: 1,
      mazeLayout:
        "1111111110001011111010111000101110111011100000111111111111111111",
    };
    const game = new MazeGame(gameObject);
  });
}
