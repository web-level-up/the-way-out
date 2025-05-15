import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderLoss } from "./render-loss.js";
import { renderCongrats } from "./render-congrats.js";
// import { MazeGame } from "../game-script.js";

export function renderMazeGame() {
  loadPage("/views/maze-game.html").then(() => {
    console.log("Game page loaded");
    // Instantiate the MazeGame class after the page is loaded
    // const sizeSelect = document.getElementById("maze-size");
    // const initialSize = sizeSelect ? Number(sizeSelect.value) : 32;
    // window.mazeGame = new MazeGame(initialSize);

    // // Add event listener for Give Up button
    // const giveUpBtn = document.getElementById("giveUpBtn");
    // if (giveUpBtn) {
    //   giveUpBtn.addEventListener("click", () => {
    //     renderMainPage();
    //   });
    // }
  });
}

// // In render-congrats.js
window.renderCongrats = function () {
  // ... your code ...
  console.log("YOU WIN!!!");
  renderCongrats();
};

window.renderLoss = function () {
  // ... your code ...
  console.log("YOU LOSE!!!");
  renderLoss();
};
