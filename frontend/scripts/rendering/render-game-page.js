import { loadPage } from "./renderer.js";
import {dummyMazes} from "../../js/dummy-data.js";
import {renderMazeCard} from "./render-maze-card.js";

export function renderGamePage(contentHtmlName) {
    loadPage("views/game-page.html").then(() => {
        const contentContainer = document.getElementById('content');

        switch (contentHtmlName) {
            case "mazeSelection":
                fetchContentPage(contentHtmlName, contentContainer)
                    .then(() => {
                        const mazeContainer = contentContainer.querySelector("#mazes");

                        dummyMazes.forEach(maze => {
                            renderMazeCard(maze)
                                .then(card => mazeContainer.appendChild(card))
                        });
                    });


                break;
            default:
                fetchContentPage(contentHtmlName, contentContainer)
                    .then()

        }

        const mazePageLink = document.getElementById("maze-selection-page-link");

        mazePageLink.addEventListener("click", () => {
            resetGamePageView();
            renderGamePage('mazeSelection');
        });
    });
}

function fetchContentPage(contentHtmlName, contentContainer) {
    return fetch(`views/${contentHtmlName}.html`)
        .then(response => response.text())
        .then(content => {
            if (contentContainer) {
                contentContainer.innerHTML = content;
            } else {
                console.error("Content container element not found.");
            }
        })
        .catch(error => {
            console.error("Error loading content:", error);
        });
}

function resetGamePageView() {
    let root = document.getElementById("root");
    let navButton = document.getElementById("nav-button");
    let sidebar = document.getElementById("sidebar");
    let navButtonImg = document.getElementById("nav-button-img");
    // let mainContent = document.getElementById("root");

    sidebar.style.width = "0";
    navButtonImg.style.transform = "none";
    root.style.gridTemplateAreas = '"sidebar nav-button content"';
    root.style.gridTemplateColumns = "0 5vw 95vw";
}