import { loadConfig } from "./scripts/configLoader.js";
import { handleOAuthCallback } from "./scripts/auth.js";
import { renderLoginPage } from "./scripts/rendering/login.js";
import { renderMazeSelectionPage } from "./scripts/rendering/mazeSelection.js";
import { renderUsernamePage } from "./scripts/rendering/username.js";
import {renderGamePage} from "./scripts/rendering/render-game-page.js";

await loadConfig();
const loginState = await handleOAuthCallback();
switch (loginState) {
  case "existing":
    renderGamePage('main-menu');
    break;
  case "new":
    renderUsernamePage();
    break;
  case "failed":
    renderLoginPage();
    break;
  default:
    renderLoginPage();
}