import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";

export function renderMazeDetailsPage(mazeId) {
  loadPage("/views/maze-details.html").then(() => {
    const mazeDetails = document.getElementById("maze-details");
    const heading = document.createElement("h1");
    heading.textContent = "This is the page for maze " + mazeId;
    mazeDetails.appendChild(heading);

    // Add event listener to back button
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        renderMainPage();
      });
    }
  });
}
