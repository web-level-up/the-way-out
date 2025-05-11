import { initiateGoogleOAuth } from "../auth.js";
import { loadPage } from "./renderer.js";

export function renderLoginPage() {
  loadPage("./views/login.html").then(() => {
    document
      .getElementById("google-login-button")
      .addEventListener("click", initiateGoogleOAuth);
  });
}
