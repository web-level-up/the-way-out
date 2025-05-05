import express from "express";
import * as mazeController from "../controllers/maze.controller.js";

const router = express.Router();

router.get("/", mazeController.getAllMazes);

export default router;
