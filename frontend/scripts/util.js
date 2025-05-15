import { renderLoginPage } from "./rendering/render-login.js";
import { HttpError } from "./custom-errors.js";
import { getConfig } from "./config-loader.js";

export function clearQueryParams() {
  const url = new URL(window.location.href);
  window.history.replaceState({}, document.title, url.pathname);
}

export function logout() {
  localStorage.setItem("jwt", "");
  localStorage.setItem("username", "");

  renderLoginPage();
}

export function getDataFromUrl(url) {
  const config = getConfig();

  return fetch(config.apiBaseUrl + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    signal: AbortSignal.timeout(5000),
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new HttpError(response.status, errorData.error);
    }
    return response.json();
  });
}

export function toggleTheme() {
  document.body.classList.toggle("light-mode");
}
