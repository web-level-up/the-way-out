console.log("Congrats script loaded");
import { renderMazeGameTemp } from "./rendering/render-maze-game-temp.js";
import { renderLeaderboardPage } from "./rendering/render-leaderboard-page.js";
export class Congrats {
  constructor(mazeId, steps, time) {
    this.mazeId = mazeId;
    this.steps = steps;
    this.time = time;
  }

  show() {
    const stepsElem = document.getElementById("congrats-steps");
    const timeElem = document.getElementById("congrats-time");
    if (stepsElem) stepsElem.textContent = `Steps taken: ${this.steps}`;
    if (timeElem) timeElem.textContent = `Time left: ${this.time}`;
  }

  addButtonListeners() {
    const playAgainBtn = document.getElementById("congrats-play-again");
    const leaderboardBtn = document.getElementById("congrats-view-leaderboard");

    playAgainBtn.addEventListener("click", () => {
      renderMazeGameTemp(this.mazeId);
    });
    leaderboardBtn.addEventListener("click", () => {
      renderLeaderboardPage();
    });
    // if (playAgainBtn && typeof onPlayAgain === "function")
    //   playAgainBtn.onclick = onPlayAgain;
    // if (leaderboardBtn && typeof onViewLeaderboard === "function")
    //   leaderboardBtn.onclick = onViewLeaderboard;
  }
}

// window.Congrats = Congrats;
