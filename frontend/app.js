import { loadConfig } from "./scripts/configLoader.js";
import { handleOAuthCallback } from "./scripts/auth.js";
import { renderLoginPage } from "./scripts/rendering/login.js";
import { renderMazeSelectionPage } from "./scripts/rendering/mazeSelection.js";
import { renderUsernamePage } from "./scripts/rendering/username.js";
import { renderErrorPage } from "./scripts/rendering/error.js";

await loadConfig();
const loginState = await handleOAuthCallback();
switch (loginState) {
  case "existing":
    renderMazeSelectionPage();
    break;
  case "new":
    renderUsernamePage();
    break;
  case "failed":
    renderErrorPage("Login failed", renderLoginPage, "return to login");
    break;
  default:
    renderLoginPage();
}