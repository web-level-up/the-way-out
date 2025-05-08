import { loadPage } from "./renderer.js";

export function renderMazeDetailsPage(mazeId) {
    loadPage("/views/mazeDetails.html").then(() => {
      const mazeDetails = document.getElementById("maze-details");
      const heading = document.createElement("h1");
      heading.textContent = "This is the page for maze " + mazeId;
      mazeDetails.appendChild(heading);
    });
  }
  