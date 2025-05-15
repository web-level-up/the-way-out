import { loadPage } from "./renderer.js";
import { authError, getDataFromUrl } from "../util.js";
import { navigate } from "../router.js";
import { HttpError } from "../custom-errors.js";
import { renderErrorPage } from "./render-error.js";

export function renderLeaderboardPage(mazeId = null) {
  return loadPage("views/leaderboard.html").then(() => {
    let selectedMaze = mazeId;
    populateMazeSelect(mazeId);
    const playMaze = document.getElementById("play-maze-button");
    if (mazeId) {
      playMaze.style.display = "block";
      playMaze.textContent = "Play Maze " + mazeId ?? ""
    } else {
      playMaze.style.display = "none";
    }

    const mazeSelect = document.getElementById("maze-select");
    mazeSelect.addEventListener("change", function () {
    selectedMaze = this.value
    if (this.value) {
      playMaze.style.display = "block";
      playMaze.textContent = "Play Maze " + this.value ?? ""
    } else {
      playMaze.style.display = "none";
    }
    navigate("maze/leaderboard", {mazeId: selectedMaze})
    });

    document
      .getElementById("home-button")
      .addEventListener("click", () => navigate("menu"));
    document
      .getElementById("play-maze-button")
      .addEventListener("click", () =>
        navigate("maze/game", { mazeId: selectedMaze })
      );
  });
}

function populateMazeSelect(mazeId) {
  getDataFromUrl("/api/mazes")
    .then((mazes) => {
      const mazeSelectElement = document.getElementById("maze-select");

      const mazeOptions = getAllMazeOptions(mazes);

      const placeholderOption = document.createElement("option");

      placeholderOption.value = "";
      placeholderOption.textContent = "Select a maze...";
      placeholderOption.disabled = true;
      if (!mazeId) {
        placeholderOption.selected = true;
      }

      mazeSelectElement.appendChild(placeholderOption);

      mazeOptions.forEach((mazeOption) => {
        const optionElement = document.createElement("option");

        optionElement.value = mazeOption.id;
        optionElement.textContent = mazeOption.label;

        if (mazeId && Number(mazeId) === mazeOption.id) {
          optionElement.selected = true;
          filterLeaderboard(mazeOption.id);
        }

        mazeSelectElement.appendChild(optionElement);
      });
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          authError();
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}

function getAllMazeOptions(mazes) {
  return mazes.map((maze) => {
    return {
      id: maze.id,
      label: `Maze ${maze.id}`,
    };
  });
}

function getUserCompletionsData(mazeId) {
  return getDataFromUrl(`/api/mazes/${mazeId}/completions/current-user`)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          authError();
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}

function getLeaderboardData(mazeId) {
  return getDataFromUrl(`/api/mazes/${mazeId}/leaderboard`)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        if (error.status === 401) {
          authError();
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}

function filterLeaderboard(mazeId) {
  getUserCompletionsData(mazeId).then((data) => {
    populateUserStats(data);
  });

  getLeaderboardData(mazeId).then((data) => {
    populateLeaderboard(mazeId, "time-leaderboard", data);
    populateLeaderboard(mazeId, "steps-leaderboard", data, true);
  });
}

function populateUserStats(data) {
  const tableBody = document
    .getElementById("user-stats")
    .getElementsByTagName("tbody")[0];
  tableBody.replaceChildren();

  data.forEach((entry, index) => {
    const row = tableBody.insertRow();
    const attemptCell = row.insertCell();
    const timeTakenCell = row.insertCell();
    const stepsTakenCell = row.insertCell();

    attemptCell.textContent = `${index + 1}`;
    timeTakenCell.textContent = `${entry.time_taken_seconds}s`;
    stepsTakenCell.textContent = entry.steps_taken;
  });
}

function populateLeaderboard(mazeId, tableId, data, isStepsTaken = false) {
  const tableBody = document
    .getElementById(tableId)
    .getElementsByTagName("tbody")[0];
  tableBody.replaceChildren();

  const sortedData = !isStepsTaken
    ? data
    : [...data].sort((a, b) => {
        if (isStepsTaken) {
          return a["steps_taken"] - b["steps_taken"];
        }
      });

  sortedData.forEach((entry, index) => {
    const row = tableBody.insertRow();
    const rankCell = row.insertCell();
    const usernameCell = row.insertCell();
    const valueCell = row.insertCell();

    getLeaderboardEntryRank(rankCell, `${index + 1}`);
    usernameCell.textContent = entry.username;

    if (isStepsTaken) {
      valueCell.textContent = `${entry.steps_taken}`;
    } else {
      valueCell.textContent = `${entry.time_taken_seconds}s`;
    }
  });
}

function getLeaderboardEntryRank(rankCell, rank) {
  if (rank <= 3) {
    let imageUrl = "";
    let imageAlt = "";
    switch (rank) {
      case "1":
        imageUrl = "../../../assets/gold-medal.png";
        imageAlt = "Gold medal";
        break;
      case "2":
        imageUrl = "../../../assets/silver-medal.png";
        imageAlt = "Silver medal";
        break;
      case "3":
        imageUrl = "../../../assets/bronze-medal.png";
        imageAlt = "Bronze medal";
        break;
    }

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = imageAlt;
    img.style.width = "2rem";
    img.style.height = "auto";

    rankCell.appendChild(img);
  } else {
    rankCell.textContent = rank;
  }
}
