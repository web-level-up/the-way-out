import {dummyMazes} from "../dummy-data.js";
import {renderMazeCard} from "./render-maze-card.js";
import {fetchContentPagePromise, getRenderBaseGamePagePromise} from "./helpers/helper-functions.js";

export function renderMazeSelectionPage() {
  getRenderBaseGamePagePromise().then(() => {
    const contentContainer = document.getElementById('content');

    fetchContentPagePromise("maze-selection", contentContainer)
      .then(() => {
        const mazeContainer = contentContainer.querySelector("#mazes");

        dummyMazes.forEach(maze => {
          renderMazeCard(maze)
            .then(card => mazeContainer.appendChild(card))
        });
      });
  });
}