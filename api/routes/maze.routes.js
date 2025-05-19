import express from "express";
import * as mazeService from "../services/maze.service.js";
import { validateMazeData } from "../utils/maze.utils.js";
import { convertSnakeToCamelCase } from "../utils/general.utils.js";
import * as userService from "../services/user.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mazes = await mazeService.listMazes();
    res.json(mazes);
  } catch {
    return res
      .status(500)
      .json({ error: "Unable to fetch mazes. Try again later." });
  }
});

router.post("/completions", async (req, res) => {
  try {
    const { mazeId, timeTaken, stepsTaken } = req.body;
    const googleId = req.user.sub;

    if (!mazeId) {
      return res.status(400).json({ error: "Maze ID is required" });
    } else if (typeof mazeId !== "number") {
      return res.status(400).json({ error: "Maze ID must be a number" });
    } else if (timeTaken !== 0 && !timeTaken) {
      return res.status(400).json({ error: "Time taken is required" });
    } else if (typeof timeTaken !== "number") {
      return res.status(400).json({ error: "Time taken must be a number" });
    } else if (!stepsTaken) {
      return res.status(400).json({ error: "Steps taken is required" });
    } else if (typeof stepsTaken !== "number") {
      return res.status(400).json({ error: "Steps taken must be a number" });
    }

    const result = await mazeService.completeMaze(
      mazeId,
      googleId,
      timeTaken,
      stepsTaken
    );

    res.status(201).json(result);
  } catch {
    return res.status(500).json({ error: "Unable to save maze completion." });
  }
});

router.get("/:id", async (req, res) => {
  console.log("Getting maze with ID:", req.params.id);
  try {
    const maze = await mazeService.getMaze(req.params.id);
    if (!maze)
      return res
        .status(404)
        .json({ error: `Maze with ID ${req.params.id} not found.` });

    const layoutResponse = await fetch(maze.maze_layout_url);
    const layout = await layoutResponse.text();
    res.json({ ...maze, maze_layout: layout });
  } catch {
    return res
      .status(500)
      .json({ error: "Unable to fetch maze. Try again later." });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "Maze Manager"))) {
      return res.status(403).json({ error: "You do not have permission to add a maze." });
    }

    const convertedBody = convertSnakeToCamelCase(req.body);
    convertedBody.difficultyLevelId = convertedBody.difficultyId;

    const validationError = validateMazeData(convertedBody, false);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const {
      mazeLevel,
      difficultyLevelId,
      mazeLayout,
      xStartingPosition,
      yStartingPosition,
      xEndingPosition,
      yEndingPosition,
    } = convertedBody;

    if (mazeService.getMazeByMazeLevel(mazeLevel)) {
      return res.status(500).json({ error: "Unable to save maze because a maze with that level already exists. Please try again with a different level." });
    }

    const mazeId = await mazeService.addMaze({
      mazeLayout,
      difficultyLevelId,
      mazeLevel,
      xStartingPosition,
      yStartingPosition,
      xEndingPosition,
      yEndingPosition,
    });
    res.status(201).json(mazeId);
  } catch {
    return res.status(500).json({ error: "Unable to save maze." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "Maze Manager"))) {
      return res.status(403).json({ error: "You do not have permission to delete a maze." });
    }

    const id = req.params.id;
    await mazeService.deleteMaze(id);
    res.status(200).json({ message: `Maze ${id} deleted successfully` });
  } catch (error) {
    if (error.name === "MazeNotFoundError") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete maze" });
  }
});

router.put("/", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "Maze Manager"))) {
      return res.status(403).json({ error: "You do not have permission to update a maze." });
    }

    const convertedBody = convertSnakeToCamelCase(req.body);
    convertedBody.difficultyLevelId = convertedBody.difficultyId;

    const validationError = validateMazeData(convertedBody, true);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const {
      id,
      mazeLayout,
      difficultyLevelId,
      mazeLevel,
      xStartingPosition,
      yStartingPosition,
      xEndingPosition,
      yEndingPosition,
    } = convertedBody;

    const result = await mazeService.editMaze({
      id,
      mazeLayout,
      difficultyLevelId,
      mazeLevel,
      xStartingPosition,
      yStartingPosition,
      xEndingPosition,
      yEndingPosition,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error editing maze:", error);
    return res.status(500).json({ error: `Unable to edit maze` });
  }
});

router.get("/:id/leaderboard", async (req, res) => {
  try {
    const leaderboard = await mazeService.getMazeLeaderboard(req.params.id);
    res.json(leaderboard);
  } catch {
    return res
      .status(500)
      .json({ error: "Unable to fetch leaderboard. Try again later." });
  }
});

router.get("/:id/completions/current-user", async (req, res) => {
  try {
    const completions = await mazeService.getUserMazeCompletions(
      req.params.id,
      req.user.sub
    );
    res.json(completions);
  } catch {
    return res
      .status(500)
      .json({ error: "Unable to fetch maze completions. Try again later." });
  }
});

export default router;
