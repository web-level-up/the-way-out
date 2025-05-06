import { getConfig } from "./configLoader.js";

export async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  if (code) {
    const config = getConfig();
    return fetch(config.apiBaseUrl + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("jwt", data.id_token);
        const url = new URL(window.location.href);
        window.history.replaceState({}, document.title, url.pathname);
        return true;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else if (error) {
    console.error("Authentication failed", error);
  }
  return false;
}

export function initiateGoogleOAuth() {
  const config = getConfig();
  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: config.googleCallbackUrl,
    access_type: "offline",
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    prompt: "consent",
  });

  window.location.href = `${"https://accounts.google.com/o/oauth2/v2/auth"}?${params.toString()}`;
}

export function logAuthCode() {
  console.log(localStorage.getItem("jwt"));
}
