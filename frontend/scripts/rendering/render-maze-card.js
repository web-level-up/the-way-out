import {difficultyLevels} from "../../js/dummy-data.js";

function getMazeSize(mazeLayout) {
    const layoutLength = mazeLayout.length;
    const size = Math.sqrt(layoutLength);

    if (Number.isInteger(size)) {
        return size;
    } else {
        return NaN;
    }
}

export function renderMazeCard(maze) {
    return fetch(`views/maze-card.html`)
        .then(response => response.text())
        .then(content => {
            const cardContainer = document.createElement("section");

            cardContainer.innerHTML = content;

            cardContainer.querySelector("#maze-title").textContent = `Maze ${maze.id}`;
            cardContainer.querySelector("#maze-size").textContent = `Size: ${getMazeSize(maze.maze_layout)}`;
            cardContainer.querySelector("#maze-difficulty").textContent = `Difficulty: ${difficultyLevels.find(level => level.id === maze.difficulty_level_id)?.difficulty_level_name || "Unknown"}`;
            cardContainer.querySelector("#maze-time-record").textContent = `Time Record: ${"N/A"}`;
            cardContainer.querySelector("#maze-step-record").textContent = `Step Record: ${"N/A"}`;
            cardContainer.querySelector("#maze-times-played").textContent = `Times Played By Users: ${"N/A"}`;

            return cardContainer;
        })
}