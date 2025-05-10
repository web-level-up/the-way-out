export async function loadPage(url) {
  const res = await fetch(url);
  const html = await res.text();
  root.innerHTML = html;
}