import { renderLoginPage } from "./rendering/render-login.js";
import { renderMazeSelectionPage } from "./rendering/render-maze-selection-page.js";
import { renderMainPage } from "./rendering/render-main-page.js";
import { renderErrorPage } from "./rendering/render-error.js";
import { renderLeaderboardPage } from "./rendering/render-leaderboard-page.js";
import { renderMazeGame } from "./rendering/render-maze-game.js";
import { handleOAuthCallback } from "./auth.js";
import { renderUsernamePage } from "./rendering/render-username.js";
import { renderCms } from "./rendering/render-cms.js";
import {renderUserManagementPage} from "./rendering/render-user-management-page.js";

let pageStack = [];

const routes = {
  "": async () => {
    const loginState = await handleOAuthCallback();
    switch (loginState) {
      case "existing":
        navigate("menu");
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
  },
  menu: () => {
    renderMainPage();
  },
  "maze-management": (params) => {
    const mazeId = params.get("mazeId");
    renderCms(mazeId);
  },
  "user-management": (params) => {
    renderUserManagementPage();
  },
  "maze/selection": () => {
    renderMazeSelectionPage();
  },
  "maze/leaderboard": (params) => {
    const mazeId = params.get("mazeId");
    renderLeaderboardPage(mazeId);
  },
  "maze/game": (params) => {
    const mazeId = params.get("mazeId");
    renderMazeGame(mazeId);
  },
};

export function router() {
  const [path, queryString] = window.location.hash.slice(1).split("?");
  const params = new URLSearchParams(queryString || "");

  const routeHandler = routes[path];
  if (routeHandler) {
    routeHandler(params);
  } else {
    renderErrorPage(
      "404 Page could not be found",
      () => navigate(""),
      "Go to login"
    );
  }
}

export function navigate(path, queryParams = {}) {
  const [prevPath, prevQueryString] = window.location.hash.slice(1).split("?");
  const prevQueryParams = new URLSearchParams(prevQueryString || "");

  pageStack.push({ path: prevPath, queryParams: prevQueryParams });

  const searchParams = new URLSearchParams(queryParams).toString();
  window.location.hash = searchParams ? `${path}?${searchParams}` : path;
}

export function goBack() {
  const prevPage = pageStack.pop() ?? { path: "menu", queryParams: {} };

  navigate(prevPage.path, prevPage.queryParams);
  pageStack.pop();
}
