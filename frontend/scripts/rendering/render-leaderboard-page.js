import {loadPage} from "./renderer.js";
import {getDataFromUrl} from "../util.js";
import {renderMainPage} from "./render-main-page.js";
import {renderMazeGame} from "./render-maze-game.js";
import {renderNavigationButtons} from "./render-navigation-buttons.js";
import {HttpError} from "../custom-errors.js";
import {renderErrorPage} from "./render-error.js";
import {renderLoginPage} from "./render-login.js";
import {renderMazeSelectionPage} from "./render-maze-selection-page.js";

export function renderLeaderboardPage({mazeId = null, backPage = renderMainPage}) {
  return loadPage("views/leaderboard.html")
    .then(() => {
      populateMazeSelect(mazeId);

      addLeaderboardListeners(backPage)
    })
    .catch((error) => {
      if (error instanceof HttpError) {
        if ((error.status === 401)) {
          renderErrorPage(
            "Your session has expired, you will need to login again",
            renderLoginPage,
            "return to login"
          );
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            mazeId ? renderMazeSelectionPage : renderMainPage,
            mazeId ? "return to maze selection page" : "return to main page"
          );
        }
      } else {
        renderErrorPage(
          error ?? "An unexpected error has occurred",
          mazeId ? renderMazeSelectionPage : renderMainPage,
          mazeId ? "return to maze selection page" : "return to main page"
        );
      }
    });
}

function populateMazeSelect(mazeId = null) {
  console.log('mazeId', mazeId);
  getDataFromUrl("/api/mazes")
    .then((mazes) => {
      const mazeSelectElement = document.getElementById('maze-select');

      const mazeOptions = getAllMazeOptions(mazes);

      const placeholderOption = document.createElement('option');

      placeholderOption.value = "";
      placeholderOption.textContent = "Select a maze...";
      placeholderOption.disabled = true;
      if (!mazeId) {
        placeholderOption.selected = true;
      }

      mazeSelectElement.appendChild(placeholderOption);

      mazeOptions.forEach(mazeOption => {
        const optionElement = document.createElement('option');

        optionElement.value = mazeOption.id;
        optionElement.textContent = mazeOption.label;

        if (mazeId && mazeId === mazeOption.id) {
          optionElement.selected = true;
          filterLeaderboard(mazeOption.id);
        }

        mazeSelectElement.appendChild(optionElement);
      });
    });
}

function getAllMazeOptions(mazes) {
   return mazes.map(maze => {
    return {
      id: maze.id,
      label: `Maze ${maze.id}`
    };
  });
}

function getUserCompletionsData(mazeId) {
  return getDataFromUrl(`/api/mazes/${mazeId}/completions/current-user`)
    .then((data) => {
      return data;
    });
}

function getLeaderboardData(mazeId) {
  return getDataFromUrl(`/api/mazes/${mazeId}/leaderboard`)
    .then((data) => {
      return data;
    });
}

function filterLeaderboard(mazeId, data) {
  getUserCompletionsData(mazeId).then((data) => {
    populateUserStats(data);
  })

  getLeaderboardData(mazeId).then((data) => {
    populateLeaderboard(mazeId, 'time-leaderboard', data);
    populateLeaderboard(mazeId, 'steps-leaderboard', data, true);
  })
}

function populateUserStats(data) {
  const tableBody = document.getElementById('user-stats').getElementsByTagName('tbody')[0];
  tableBody.replaceChildren();

  data.forEach((entry, index) => {
    const row = tableBody.insertRow();
    const attemptCell = row.insertCell();
    const timeTakenCell = row.insertCell();
    const stepsTakenCell = row.insertCell();

    attemptCell.textContent = `${index + 1}`;
    timeTakenCell.textContent = entry.time_taken;
    stepsTakenCell.textContent = entry.steps_taken;
  });
}

function populateLeaderboard(mazeId, tableId, data, isStepsTaken = false) {
  const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
  tableBody.replaceChildren();

  const sortedData = !isStepsTaken
    ? data
    : [...data].sort((a, b) => {
      if (isStepsTaken) {
        return a['steps_taken'] - b['steps_taken'];
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
      valueCell.textContent = `${entry.time_taken}`;
    }
  });
}

function getLeaderboardEntryRank(rankCell, rank) {
  if (rank <= 3) {
    let imageUrl = '';
    let imageAlt = '';
    switch (rank) {
      case '1':
        imageUrl = "../../../assets/gold-medal.png";
        imageAlt = "Gold medal";
        break;
      case '2':
        imageUrl = "../../../assets/silver-medal.png";
        imageAlt = "Silver medal";
        break;
      case '3':
        imageUrl = "../../../assets/bronze-medal.png";
        imageAlt = "Bronze medal";
        break;
    }

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = imageAlt;
    img.style.width = '2rem';
    img.style.height = 'auto';

    rankCell.appendChild(img);
  } else {
    rankCell.textContent = rank;
  }
}

function addLeaderboardListeners(backPage) {
  const mazeSelect = document.getElementById('maze-select');
  mazeSelect.addEventListener('change', function() {
    filterLeaderboard(this.value);
  });

  renderNavigationButtons(backPage);

  document
    .getElementById("play-maze-button")
    .addEventListener("click", renderMazeGame);
}