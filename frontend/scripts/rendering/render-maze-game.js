import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";

export function renderMazeGame() {
  loadPage("/views/game-play.html").then(() => {
    console.log("Game page loaded");
    //add dynamic content to the game-play.html page

    const script = document.createElement("script");
    //script.type = "module"; // or omit if not a module
    script.src = "./scripts/gameScript.js";
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
