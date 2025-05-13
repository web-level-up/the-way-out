import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { renderLoss } from "./render-loss.js";
import { renderCongrats } from "./render-congrats.js";
export function renderMazeGame() {
  loadPage("/views/maze-game.html").then(() => {
    console.log("Game page loaded");
    //add dynamic content to the game-play.html page

    // Just append the script right away:
    const script = document.createElement("script");
    //script.type = "module";
    script.src = "./scripts/game-script.js";
    document.body.appendChild(script);

    // Add event listener for Give Up button
    const giveUpBtn = document.getElementById("giveUpBtn");
    if (giveUpBtn) {
      giveUpBtn.addEventListener("click", () => {
        renderMainPage();
      });
    }
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
