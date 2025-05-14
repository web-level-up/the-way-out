import { loadPage } from "./renderer.js";
import { getConfig } from "../config-loader.js";
import { HttpError } from "../custom-errors.js";
import { renderErrorPage } from "./render-error.js";
import { renderLoginPage } from "./render-login.js";
import {renderMainPage} from "./render-main-page.js";

export function renderUsernamePage() {
  loadPage("./views/username.html").then(() => {
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
        signal: AbortSignal.timeout(5000),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new HttpError(response.status, errorData.error);
          }
          return response.json();
        })
        .then(() => {
          localStorage.setItem("username", username);
          renderMainPage();
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            message.textContent =
              error.message ?? "An unexpected error has occurred";
            if ((error.status === 401))
              renderErrorPage(
                "Your session has expired, you will need to login again",
                renderLoginPage,
                "return to login"
              );
          } else {
            message.textContent = error;
          }
        });
    });
  });
}
