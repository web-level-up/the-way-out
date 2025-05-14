import express from "express";
import * as userService from "../services/user.service.js";
import { decodeJwt } from "jose";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Google token exchange failed:", errorData);
      return res
        .status(500)
        .json({ error: "Failed to exchange code for token" });
    }

    const { id_token } = await tokenResponse.json();
    const decoded = decodeJwt(id_token);
    const existingUser = await userService.getUserByGoogleId(decoded.sub);

    // Safely respond with user info. If existingUser is undefined (user not found),
    // avoid accessing properties on undefined to prevent TypeError.
    // Use a conditional to provide an empty string for username if no user exists.
    res.status(200).json({
      id_token,
      existing_user: !!existingUser, // true if user exists, false otherwise
      username: existingUser ? existingUser.username : "", // safely access username or provide empty string
    });
  } catch (err) {
    console.error("Login handler error:", err);
  }
});
export default router;
