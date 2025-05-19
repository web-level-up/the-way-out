import { loadPage } from "./renderer.js";
import { HttpError } from "../custom-errors.js";
import { renderErrorPage } from "./render-error.js";
import { renderLoginPage } from "./render-login.js";
import { renderMainPage } from "./render-main-page.js";
import { postDataToUrl } from "../util.js";
import { navigate } from "../router.js";

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
      } else if (username.length > 50){
        message.textContent = "Username cannot be longer than 50 characters"
        return;
      }

      return postDataToUrl("/api/user", { username })
        .then((data) => {
          localStorage.setItem("username", username);
          localStorage.setItem("roles", data.roles);
          navigate("menu")
        })
        .catch((error) => {
          if (error instanceof HttpError) {
            message.textContent =
              error.message ?? "An unexpected error has occurred";
            if (error.status === 401)
              renderErrorPage(
                "Your session has expired, you will need to login again",
                () => navigate(""),
                "return to login"
              );
          } else {
            message.textContent = error;
          }
        });
    });
  });
}
