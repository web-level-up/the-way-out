import { loadPage } from "./renderer.js";

export function renderErrorPage(error, buttonClick, buttonText) {
  loadPage("/views/error.html").then(() => {
    const message = document.getElementById("error-message");
    message.textContent = error || "An unknown error occurred.";

    const button = document.getElementById("nav-button");
    button.textContent = buttonText;
    button.addEventListener("click", () => {
      buttonClick();
    });
  });
}
