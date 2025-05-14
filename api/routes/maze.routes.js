import express from "express";
import * as service from "../services/maze.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const mazes = await service.listMazes();
  res.json(mazes);
});

router.post("/completions", async (req, res) => {
  console.log("[POST] /api/mazes/completions called");
  console.log("Request body:", req.body);
  const { mazeId, timeTaken, stepsTaken } = req.body;
  const googleId = "oauth_001";
  const result = await service.completeMaze(
    mazeId,
    googleId,
    timeTaken,
    stepsTaken
  );
  console.log("Maze completion processed, result:", result);
  res.status(201).json(result);
});

router.get("/:id", async (req, res) => {
  const maze = await service.getMaze(req.params.id);
  const layoutResponse = await fetch(maze.maze_layout_url);
  const layout = await layoutResponse.text();
  if (!maze) return res.status(404).json({ error: "Maze not found" });
  res.json({ ...maze, maze_layout: layout });
});

router.post("/", async (req, res) => {
  const maze = req.body;
  const mazeId = await service.addMaze(maze);
  res.status(201).json(mazeId);
});

router.put("/", async (req, res) => {
  const maze = req.body;
  const mazeId = service.editMaze(maze);
  res.status(201).json(mazeId);
});

router.get("/:id/leaderboard", async (req, res) => {
  const leaderboard = await service.getMazeLeaderboard(req.params.id);
  res.json(leaderboard);
});

router.get("/:id/completions/current-user", async (req, res) => {
  const completions = await service.getUserMazeCompletions(
    req.params.id,
    req.user.sub
  );
  res.json(completions);
});

export default router;
