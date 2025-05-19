import { logout } from "../util.js";
import { loadPage } from "./renderer.js";
import { navigate } from "../router.js";
import { renderErrorPage } from "./render-error.js";
import { renderLoginPage } from "./render-login.js";

export function renderMainPage() {
  return loadPage("views/main-page.html").then(() => {
    if (!localStorage.getItem("username")) {
      renderErrorPage(
        "Your session has expired, you will need to login again",
        renderLoginPage,
        "return to login"
      );
    } else {
      document
        .getElementById("maze-selection")
        .addEventListener("click", () => navigate("maze/selection"));
      document
        .getElementById("leaderboard")
        .addEventListener("click", () => navigate("maze/leaderboard"));
      document.getElementById("logout").addEventListener("click", logout);
      document.getElementById(
        "welcome"
      ).textContent = `Welcome ${localStorage.getItem(
        "username"
      )}! Do You Remember the Way Out?`;
      const isAdmin = true;

      if (isAdmin) {
        const cmsButton = document.createElement("button");
        cmsButton.id = "cms";
        cmsButton.className = "menu-button";
        cmsButton.textContent = "Maze Management";
        cmsButton.addEventListener("click", () => navigate("maze/management"));

        const container = document.getElementById("menu-container");
        container.appendChild(cmsButton);
      }
    }
  });
}
