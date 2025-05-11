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

    res.status(200).json({ id_token, existing_user: existingUser ? true : false, username: existingUser.username ?? "" });
  } catch (err) {
    console.error("Login handler error:", err);
  }
});
export default router;
