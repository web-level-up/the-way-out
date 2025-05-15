import express from "express";
import * as userService from "../services/user.service.js";

const router = express.Router();

router.get("/", async (res) => {
  const users = await userService.listUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await userService.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }
  const user = await userService.usernameTaken(username);
  if (user) return res.status(400).json({ error: "Username taken" });
  console.log("username", username);
  //console.log("req", req);
  console.log("req.user", req.user);
  console.log("req.user.sub", req.user.sub);

  const createdUser = await userService.addUser(req.user.sub, username);
  res.json(createdUser);
});

export default router;
