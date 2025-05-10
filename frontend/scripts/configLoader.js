let CONFIG = null;

export async function loadConfig() {
  if (CONFIG) return CONFIG;

  const isLocalEnv =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const file = isLocalEnv ? "/config.local.json" : "/config.release.json";
  return fetch(file)
    .then((response) => response.json())
    .then((data) => {
      CONFIG = data;
      return CONFIG;
    })
    .catch((error) => {
      console.error("Error Loading Config:", error);
    });
}

export function getConfig() {
  if (!CONFIG) {
    loadConfig();
  }
  return CONFIG;
}
