console.log("Maze details script loaded");
import { renderMazeGame } from "./rendering/render-maze-game.js";

console.log(document.getElementById("startBtn"));

document.body.addEventListener("click", (event) => {
  if (event.target && event.target.id === "startBtn") {
    console.log("Start button clicked!");
    renderMazeGame();
  }
});
