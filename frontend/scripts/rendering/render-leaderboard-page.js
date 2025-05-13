import {loadPage} from "./renderer.js";
import {getDataFromUrl} from "../util.js";

export function renderLeaderboardPage() {
  return loadPage("views/leaderboard.html").then(() => {

    populateMazeSelect();
    const mazeSelect = document.getElementById('maze-select');
    mazeSelect.addEventListener('change', function() {
      filterLeaderboard(this.value);
    });
  });
}

function populateMazeSelect() {
  const mazeSelectElement = document.getElementById('maze-select');

  const mazeOptions = getAllMazeOptions();

  const placeholderOption = document.createElement('option');

  placeholderOption.value = "";
  placeholderOption.textContent = "Select a maze...";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;

  mazeSelectElement.appendChild(placeholderOption);

  mazeOptions.forEach(mazeOption => {
    const optionElement = document.createElement('option');

    optionElement.value = mazeOption.id;
    optionElement.textContent = mazeOption.label;

    mazeSelectElement.appendChild(optionElement);
  });
}

function getAllMazeOptions() {
  const storedMazesString = localStorage.getItem('mazes');
  const storedMazes = JSON.parse(storedMazesString);

  return storedMazes.map(maze => {
    return {
      id: maze.id,
      label: `Maze ${maze.id}`
    };
  });
}

function getUserCompletionsData(mazeId) {
  return getDataFromUrl(`/api/mazes/${mazeId}/${localStorage.userId}/completions`)
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
  tableBody.innerHTML = '';

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
  tableBody.innerHTML = '';

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