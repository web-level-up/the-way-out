import express from "express";
import * as rolesService from "../services/roles.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const roles = await rolesService.getAllRoles();
    res.json(roles);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch roles. Try again later." });
  }
});

export default router;
