// import { loadPage } from "./renderer.js";
// import { renderMainPage } from "./render-main-page.js";
// import { renderMazeGame } from "./render-maze-game.js";
//
// export function renderMazeDetailsPage(mazeId) {
//   loadPage("/views/maze-details.html").then(() => {
//     const mazeDetails = document.getElementById("maze-details");
//     const heading = document.createElement("h1");
//     heading.textContent = "This is the page for maze " + mazeId;
//     mazeDetails.appendChild(heading);
//
//     const backBtn = document.getElementById("backBtn");
//     if (backBtn) {
//       backBtn.addEventListener("click", () => {
//         renderMainPage();
//       });
//     }
//
//     const startBtn = document.getElementById("startBtn");
//     if (startBtn) {
//       startBtn.addEventListener("click", (event) => {
//         renderMazeGame();
//       });
//     }
//   });
// }
