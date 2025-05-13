import { MazeGame } from "../maze-game-temp.js";
import { loadPage } from "./renderer.js";

export function renderMazeGameTemp(mazeId) {
  return loadPage("views/maze-game-temp.html").then(() => {
    const game = new MazeGame({hi: "HI"})   
    
  });
}
