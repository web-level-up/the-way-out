import express from "express";
import * as userService from "../services/user.service.js";

const router = express.Router();

router.get("/", async (res) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch users. Try again later." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch user. Try again later." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
    const user = await userService.usernameTaken(username);
    if (user) return res.status(400).json({ error: "Username taken" });

    const createdUser = await userService.addUser(req.user.sub, username);
    res.json(createdUser);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create user." });
  }
});

export default router;
