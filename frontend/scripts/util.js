import { HttpError } from "./custom-errors.js";
import { getConfig } from "./config-loader.js";
import { navigate } from "./router.js";

export function clearQueryParams() {
  const url = new URL(window.location.href);
  window.history.replaceState({}, document.title, url.pathname);
}

export function logout() {
  localStorage.setItem("jwt", "");
  localStorage.setItem("username", "");

  navigate("");
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

export function postDataToUrl(url, body) {
  const config = getConfig();

  return fetch(config.apiBaseUrl + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new HttpError(response.status, errorData.error);
    }
    return response.json();
  });
}

export function authError() {
  renderErrorPage(
    "Your session has expired, you will need to login again",
    () => navigate(""),
    "Return to login"
  );
}

export function toggleTheme() {
  document.body.classList.toggle("light-mode");
}
