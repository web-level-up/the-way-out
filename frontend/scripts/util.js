export function clearQueryParams() {
  const url = new URL(window.location.href);
  window.history.replaceState({}, document.title, url.pathname);
}
