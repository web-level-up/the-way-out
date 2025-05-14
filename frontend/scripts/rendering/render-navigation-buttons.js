import {loadComponent} from "./renderer.js";
import {renderMainPage} from "./render-main-page.js";

export function renderNavigationButtons(backPage) {
  const navigationButtonsSection = document.getElementById("navigation-buttons")

  loadComponent(navigationButtonsSection, "views/navigation-buttons.html")
    .then(() => {
      document
        .getElementById("back-button")
        .addEventListener("click", backPage);

      document
        .getElementById("home-button")
        .addEventListener("click", renderMainPage);
    })
}

