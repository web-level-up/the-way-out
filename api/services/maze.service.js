import * as repo from "../repositories/maze.repository.js";

export const listMazes = () => repo.getAllMazes();

export const getMaze = (id) => repo.getMazeById(id);

export const completeMaze = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  repo.postCompletion(mazeId, playerGoogleId, timeTaken, stepsTaken);

export const getMazeLeaderboard = (mazeId) => repo.getLeaderboard(mazeId);
