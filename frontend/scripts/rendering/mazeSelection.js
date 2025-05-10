import { loadPage } from "./renderer.js";
import {renderMazeDetailsPage } from "./mazeDetails.js"

export function renderMazeSelectionPage() {
    loadPage("/views/maze-selection.html").then(() => {
      // const config = getConfig();
      // fetch(config.apiBaseUrl + "/api/mazes", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      //   },
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     const mazeList = document.getElementById("mazes");
  
      //     data.forEach((maze) => {
      //       const btn = document.createElement("button");
      //       btn.textContent = maze.maze;
      //       btn.className = "maze-button";
      //       btn.onclick = () => renderMazeDetailsPage(maze.maze);
  
      //       mazeList.appendChild(btn);
      //     });
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching mazes:", error);
      //   });
  
      const data = [{name: "Number 1"}, {name: "Number 2"}, {name: "Number 3"}]
      const mazeList = document.getElementById("mazes");
  
      data.forEach((maze) => {
        const btn = document.createElement("button");
        btn.textContent = maze.name;
        btn.className = "maze-button";
        btn.onclick = () => renderMazeDetailsPage(maze.name);
  
        mazeList.appendChild(btn);
      });
    });
  }