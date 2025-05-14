import { getConfig } from "../config-loader.js";
import { renderMazeCard } from "./render-maze-card.js";
import { loadPage } from "./renderer.js";

export function renderMazeSelectionPage() {
  return loadPage("views/maze-selection.html").then(() => {
    const mazeContainer = document.getElementById("mazes");

    console.log("Loading maze selection page...");
    // Fetch mazes from the local backend API instead of using dummy data
    console.log("Fetching mazes from http://localhost:3000/api/mazes");
    fetch("http://localhost:3000/api/mazes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if needed
        // 'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then(async (response) => {
        console.log("Received response from /api/mazes:", response);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response JSON:", errorData);
          throw new Error(errorData.error || "Failed to fetch mazes");
        }
        return response.json();
      })
      .then((mazes) => {
        console.log("Parsed mazes JSON:", mazes);
        mazes.forEach((maze) => {
          console.log("Rendering maze card for maze:", maze);
          renderMazeCard(maze).then((card) => mazeContainer.appendChild(card));
        });
      })
      .catch((error) => {
        // Handle errors gracefully
        console.error("Error fetching mazes:", error);
        // Optionally, display an error message to the user
      });

    // dummyMazes.forEach((maze) => {
    //   renderMazeCard(maze).then((card) => mazeContainer.appendChild(card));
    // });
  });
}
