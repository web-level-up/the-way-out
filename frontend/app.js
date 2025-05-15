import { loadConfig } from "./scripts/config-loader.js";
import { router } from "./scripts/router.js";

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();
  router();
});
