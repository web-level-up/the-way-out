import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";

export function renderMazeGame() {
  loadPage("/views/maze-game.html").then(() => {
    console.log("Game page loaded");
    //add dynamic content to the game-play.html page

    // Just append the script right away:
    const script = document.createElement("script");
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
