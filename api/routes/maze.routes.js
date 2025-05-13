import express from "express";
import * as service from "../services/maze.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const mazes = await service.listMazes();
  res.json(mazes);
});

router.get("/:id", async (req, res) => {
  const maze = await service.getMaze(req.params.id);
  const layoutResponse = await fetch(maze.maze_layout_url);
  const layout = await layoutResponse.text();
  if (!maze) return res.status(404).json({ error: "Maze not found" });
  res.json({...maze,
    maze_layout: layout
  });
});

router.post("/completions", async (req, res) => {
  const { mazeId, timeTaken, stepsTaken } = req.body;
  const googleId = "oauth_001";
  const result = await service.completeMaze(
    mazeId,
    googleId,
    timeTaken,
    stepsTaken
  );
  res.status(201).json(result);
});

router.get("/:id/leaderboard", async (req, res) => {
  const leaderboard = await service.getMazeLeaderboard(req.params.id);
  res.json(leaderboard);
});

router.get("/:id/:userId/completions", async (req, res) => {
  const completions = await service.getUserMazeCompletions(req.params.id, req.params.userId);
  res.json(completions);
});

export default router;
