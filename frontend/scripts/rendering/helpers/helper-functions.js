import { loadPage } from "../renderer.js";
import {renderMazeSelectionPage} from "../render-maze-selection-page.js";

export function getRenderBaseGamePagePromise() {
    return loadPage("views/base-game-page.html").then(() => {
        addNavigationListeners();
    });
}

export function fetchContentPagePromise(contentHtmlName, contentContainer) {
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

export function resetGamePageView() {
    let baseGamePage = document.getElementById("base-game-page");
    let sidebar = document.getElementById("sidebar");
    let navButtonImg = document.getElementById("nav-button-img");

    sidebar.style.width = "0";
    navButtonImg.style.transform = "none";
    baseGamePage.style.gridTemplateAreas = '"sidebar nav-button content"';
    baseGamePage.style.gridTemplateColumns = "0 5vw 95vw";
}

function addNavigationListeners() {
    const mazeSelectionPageLink = document.getElementById("maze-selection-page-link");

    mazeSelectionPageLink.addEventListener("click", () => {
        resetGamePageView();
        renderMazeSelectionPage();
    });
}