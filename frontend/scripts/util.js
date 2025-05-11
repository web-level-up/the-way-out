import { renderLoginPage } from "./rendering/render-login.js";

export function clearQueryParams() {
  const url = new URL(window.location.href);
  window.history.replaceState({}, document.title, url.pathname);
}

export function logout() {
  localStorage.setItem("jwt", "");
  localStorage.setItem("username", "");

  renderLoginPage();
}
