import express from "express";
import * as service from "../services/maze.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mazes = await service.listMazes();
    res.json(mazes);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch mazes. Try again later." });
  }
});

router.post("/completions", async (req, res) => {
  const { mazeId, timeTaken, stepsTaken } = req.body;
  const googleId = req.user.sub;
  try {
    const result = await service.completeMaze(
      mazeId,
      googleId,
      timeTaken,
      stepsTaken
    );

    res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Unable to save maze completion." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const maze = await service.getMaze(req.params.id);
    if (!maze)
      return res
        .status(404)
        .json({ error: `Maze with ID ${req.params.id} not found.` });

    const layoutResponse = await fetch(maze.maze_layout_url);
    const layout = await layoutResponse.text();
    res.json({ ...maze, maze_layout: layout });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch maze. Try again later." });
  }
});

router.get("/:id/leaderboard", async (req, res) => {
  try {
    const leaderboard = await service.getMazeLeaderboard(req.params.id);
    res.json(leaderboard);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch leaderboard. Try again later." });
  }
});

router.get("/:id/completions/current-user", async (req, res) => {
  try {
    const completions = await service.getUserMazeCompletions(
      req.params.id,
      req.user.sub
    );
    res.json(completions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch maze completions. Try again later." });
  }
});

export default router;
