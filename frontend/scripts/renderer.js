import { initiateGoogleOAuth } from "./auth.js";
import { getConfig } from "./configLoader.js";

async function loadPage(url) {
  const res = await fetch(url);
  const html = await res.text();
  root.innerHTML = html;
}

export function renderLoginPage() {
  loadPage("/views/login.html").then(() => {
    document
      .getElementById("google-login-button")
      .addEventListener("click", initiateGoogleOAuth);
  });
}

export function renderMenuPage() {
  loadPage("/views/menu.html").then(() => {
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

export function renderMazeDetailsPage(mazeId) {
  loadPage("/views/mazeDetails.html").then(() => {
    const mazeDetails = document.getElementById("maze-details");
    const heading = document.createElement("h1");
    heading.textContent = "This is the page for maze " + mazeId;
    mazeDetails.appendChild(heading);
  });
}
