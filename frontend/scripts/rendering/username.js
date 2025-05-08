import { loadPage } from "./renderer.js";
import { getConfig } from "../configLoader.js";
import { renderMazeSelectionPage } from "./mazeSelection.js";

export function renderUsernamePage() {
  loadPage("/views/username.html").then(() => {
    const button = document.getElementById("set-username");
    const input = document.getElementById("username-input");
    const message = document.getElementById("message");

    button.addEventListener("click", async () => {
      const username = input.value.trim();
      if (!username) {
        message.textContent = "Username cannot be empty.";
        return;
      }

      const config = getConfig();
      return fetch(config.apiBaseUrl + "/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            message.textContent = data.error;
          } else {
            renderMazeSelectionPage();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          return "failed";
        });
    });
  });
}
