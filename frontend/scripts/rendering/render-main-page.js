import { logout } from "../util.js";
import { renderMazeSelectionPage } from "./render-maze-selection-page.js";
import { loadPage } from "./renderer.js";

export function renderMainPage() {
  return loadPage("views/main-page.html").then(() => {
    document
      .getElementById("maze-selection")
      .addEventListener("click", renderMazeSelectionPage);
    document
      .getElementById("logout")
      .addEventListener("click", logout);
    document.getElementById("welcome").textContent = `Welcome ${localStorage.getItem("username")}! Do You Remember the Way Out?`
  });
  
}
