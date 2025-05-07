import { loadConfig } from "./scripts/configLoader.js";
import { handleOAuthCallback } from "./scripts/auth.js";
import { renderLoginPage, renderMenuPage } from "./scripts/renderer.js"

await loadConfig();
const loggedIn = await handleOAuthCallback();
loggedIn ? renderMenuPage() : renderLoginPage();
