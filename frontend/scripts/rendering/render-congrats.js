import { loadPage } from "./renderer.js";

export function renderMazeGame() {
  loadPage("/views/congrats.html").then(() => {
    console.log("Game page loaded");
    //add dynamic content to the game-play.html page

    const script = document.createElement("script");
    //  script.type = "module"; // or omit if not a module
    script.src = "./scripts/congrats.js";
    document.body.appendChild(script);
  });
}
