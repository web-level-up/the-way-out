// import { MazeGame } from "../maze-game-temp.js";
// import { loadPage } from "./renderer.js";

// export function renderMazeGameTemp(mazeId) {
//   return loadPage("views/maze-game-temp.html").then(() => {
//     console.log("Tshepo");
//     const gameObject = {
//       start: { x: 1, y: 1 },
//       end: { x: 5, y: 1 },
//       mazeId: 1,
//       mazeLayout:
//         "1111111110001011111010111000101110111011100000111111111111111111",
//     };
//     fetch("http://localhost:3000/api/mazes/1", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         // Add Authorization header if your backend requires JWT
//         // 'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Maze not found or server error");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Maze data:", data);
//         // You can now use the maze data in your app
//       })
//       .catch((error) => {
//         console.error("Error fetching maze:", error);
//       });
//     console.log("Done fetching maze");
//     const game = new MazeGame(gameObject);
//   });
// }

import { MazeGame } from "../maze-game-temp.js";
import { loadPage } from "./renderer.js";
import { fetchMazeById } from "../api/mazeApi.js";
import { toggleTheme } from "../util.js";

export function renderMazeGameTemp() {
  return loadPage("views/maze-game-temp.html").then(() => {
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) themeBtn.onclick = toggleTheme;
    const gameObject = {
      start: { x: 1, y: 1 },
      end: { x: 5, y: 1 },
      mazeId: 1,
      mazeLayout:
        "1111111110001011111010111000101110111011100000111111111111111111",
    };
    fetchMazeById(gameObject.mazeId)
      .then((data) => {
        console.log("Maze data:", data);
        const game = new MazeGame(gameObject);
      })
      .catch((error) => {
        console.error("Error fetching maze:", error);
      });
    console.log("Done fetching maze");
  });
}
