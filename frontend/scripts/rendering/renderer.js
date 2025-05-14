export async function loadPage(url) {
  const root = document.getElementById("root");
  return loadComponent(root, url);
}

export async function loadComponent(component, url) {
  const res = await fetch(url);
  const html = await res.text();
  component.replaceChildren();

  const parser = new DOMParser();
  const tempDoc = parser.parseFromString(html, "text/html");

  const fragment = document.createDocumentFragment();
  const nodes = Array.from(tempDoc.body.childNodes);
  nodes.forEach((node) => fragment.appendChild(node));

  component.appendChild(fragment);
  return component;
}
