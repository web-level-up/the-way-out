import * as mazeRepository from "../repositories/maze.repository.js";
import * as userService from "../services/user.service.js";

export const listMazes = () => mazeRepository.getAllMazes();

export const getMaze = (id) => mazeRepository.getMazeById(id);

export const addMaze = ({
  mazeLayout,
  difficultyLevelId,
  mazeLevel,
  xStartingPosition,
  yStartingPosition,
  xEndingPosition,
  yEndingPosition,
}) =>
  mazeRepository.addMaze({
    mazeLayout,
    difficultyLevelId,
    mazeLevel,
    xStartingPosition,
    yStartingPosition,
    xEndingPosition,
    yEndingPosition,
  });

export const deleteMaze = (id) => mazeRepository.deleteMaze(id);

export const editMaze = async ({
  id,
  mazeLayout,
  difficultyLevelId,
  mazeLevel,
  xStartingPosition,
  yStartingPosition,
  xEndingPosition,
  yEndingPosition,
}) =>
  mazeRepository.editMaze({
    id,
    mazeLayout,
    difficultyLevelId,
    mazeLevel,
    xStartingPosition,
    yStartingPosition,
    xEndingPosition,
    yEndingPosition,
  });

export const completeMaze = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  mazeRepository.postCompletion(mazeId, playerGoogleId, timeTaken, stepsTaken);

export const getMazeLeaderboard = (mazeId) => mazeRepository.getLeaderboard(mazeId);

export const getUserMazeCompletions = async (mazeId, userGoogleId) => {
  const user = await userService.getUserByGoogleId(userGoogleId);
  return mazeRepository.getUserMazeCompletions(mazeId, user?.id);
};
