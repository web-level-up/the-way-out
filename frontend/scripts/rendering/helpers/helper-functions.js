import { loadPage } from "../renderer.js";
import {renderMazeSelectionPage} from "../render-maze-selection-page.js";

export function getRenderBaseGamePagePromise() {
    return loadPage("views/base-game-page.html").then(() => {
        addSidebarListeners();
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

function addSidebarListeners() {
    const sidebarButton = document.getElementById("nav-button");
    const mazeSelectionPageLink = document.getElementById("maze-selection-page-link");

    mazeSelectionPageLink.addEventListener("click", () => {
        resetGamePageView();
        renderMazeSelectionPage();
    });

    sidebarButton.addEventListener("click", () => {
        clickSidebarButton();
    });
}

export function clickSidebarButton() {
    let baseGamePage = document.getElementById("base-game-page");
    let sidebar = document.getElementById("sidebar");
    let navButtonImg = document.getElementById("nav-button-img");

    if (sidebar.style.width === "20vw") {
        sidebar.style.width = "0";
        navButtonImg.style.transform = "none";
        baseGamePage.style.gridTemplateAreas = '"sidebar nav-button content"';
        baseGamePage.style.gridTemplateColumns = "0 5vw 95vw";
    } else {
        sidebar.style.width = "20vw";
        navButtonImg.style.transform = "rotate(180deg)";
        baseGamePage.style.gridTemplateColumns = "20vw 5vw 75vw";
        baseGamePage.style.gridTemplateAreas = '"sidebar nav-button content"';
    }
}