import * as repo from "../repositories/maze.repository.js";
import * as userService from "../services/user.service.js";

export const listMazes = () => repo.getAllMazes();

export const getMaze = (id) => repo.getMazeById(id);

export const completeMaze = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  repo.postCompletion(mazeId, playerGoogleId, timeTaken, stepsTaken);

export const getMazeLeaderboard = (mazeId) => repo.getLeaderboard(mazeId);

export const getUserMazeCompletions = async (mazeId, userGoogleId) => {
  const user = await userService.getUserByGoogleId(userGoogleId);
  return repo.getUserMazeCompletions(mazeId, user?.id);
}
