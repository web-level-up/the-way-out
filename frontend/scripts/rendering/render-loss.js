import { loadPage } from "./renderer.js";

export function renderLoss() {
  loadPage("/views/game-loss.html").then(() => {});
}
