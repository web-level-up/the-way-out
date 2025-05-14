import { loadPage } from "./renderer.js";
import { renderMainPage } from "./render-main-page.js";
import { Congrats } from "../congrats.js";
import { renderLeaderboardPage } from "./render-leaderboard-page.js";
import { renderMazeGameTemp } from "./render-maze-game-temp.js";

export function renderCongrats({ steps, time, mazeId }) {
  loadPage("/views/game-congrats.html").then(() => {
    const congrats = new Congrats(mazeId, steps, time);
    congrats.show();
    congrats.addButtonListeners(renderMazeGameTemp, renderLeaderboardPage);
  });
  console.log("Steps :", steps);
  console.log("Time :", time);

  // Log before sending the request
  console.log("Sending maze completion to backend:", { mazeId, time, steps });

  // Assume you have a function or variable that provides the JWT
  const jwt = "115570824103694498468"; //localStorage.getItem("jwt"); // or however you store/retrieve it
  console.log("JWT:", jwt);
  // Call the backend to record the completion
  fetch("http://localhost:3000/api/mazes/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      mazeId: mazeId, // Make sure to pass mazeId to this function!
      timeTaken: time, // Adjust if your time is in seconds or another format
      stepsTaken: steps,
      googleId: "oauth_001",
    }),
  })
    .then((response) => {
      console.log("Received response from backend:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Completion recorded:", data);
      // Optionally, show a message or update the UI
    })
    .catch((error) => {
      console.error("Error recording completion:", error);
    })
    .finally(() => {
      console.log("Completion request finished");
    });
}
