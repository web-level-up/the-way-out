import { loadConfig } from "./scripts/config-loader.js";
import { handleOAuthCallback } from "./scripts/auth.js";
import { renderLoginPage } from "./scripts/rendering/render-login.js";
import { renderUsernamePage } from "./scripts/rendering/render-username.js";
import { renderErrorPage } from "./scripts/rendering/render-error.js";
import { renderMainPage } from "./scripts/rendering/render-main-page.js";
import { renderMazeGameTemp } from "./scripts/rendering/render-maze-game-temp.js";
import { renderMazeDetailsPage } from "./scripts/rendering/render-maze-details.js";
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
//renderMazeGameTemp(1);
//renderMazeGame();
