import { getConfig } from "./config-loader.js";
import { clearQueryParams } from "./util.js";

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
      signal: AbortSignal.timeout(5000),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("jwt", data.id_token);
        clearQueryParams();
        if (data.existing_user) {
          localStorage.setItem("username", data.username);
          localStorage.setItem("userId", data.id);
          return "existing";
        } else {
          return "new";
        }
      })
      .catch(() => {
        clearQueryParams();
        return "failed";
      });
  } else if (error) {
    clearQueryParams();
    return "failed";
  }
  return "";
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
