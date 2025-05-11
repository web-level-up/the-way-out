import { loadConfig } from "./scripts/configLoader.js";
import { handleOAuthCallback } from "./scripts/auth.js";
import { renderLoginPage } from "./scripts/rendering/login.js";
import { renderUsernamePage } from "./scripts/rendering/username.js";
import { renderErrorPage } from "./scripts/rendering/error.js";
import { renderMainPage } from "./scripts/rendering/render-main-page.js";
import { renderMazeGame } from "./scripts/rendering/render-maze-game.js";
import { renderMazeDetailsPage } from "./scripts/rendering/mazeDetails.js";
await loadConfig();
const loginState = await handleOAuthCallback();
switch (loginState) {
  case "existing":
    renderMainPage();
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
// renderMainPage();
