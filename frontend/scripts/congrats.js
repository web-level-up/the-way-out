console.log("Congrats script loaded");

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

  addButtonListeners(onPlayAgain, onViewLeaderboard) {
    const playAgainBtn = document.getElementById("congrats-play-again");
    const leaderboardBtn = document.getElementById("congrats-view-leaderboard");
    if (playAgainBtn && typeof onPlayAgain === "function")
      playAgainBtn.onclick = onPlayAgain;
    if (leaderboardBtn && typeof onViewLeaderboard === "function")
      leaderboardBtn.onclick = onViewLeaderboard;
  }
}

// window.Congrats = Congrats;
