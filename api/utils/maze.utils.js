export const validateMazePositions = (
  mazeLayout,
  xStartingPosition,
  yStartingPosition,
  xEndingPosition,
  yEndingPosition
) => {
  const mazeDimension = Math.sqrt(mazeLayout.length);

  if (xStartingPosition < 0 || xStartingPosition >= mazeDimension) {
    return `X starting position must be between 0 and ${mazeDimension - 1}`;
  }
  if (yStartingPosition < 0 || yStartingPosition >= mazeDimension) {
    return `Y starting position must be between 0 and ${mazeDimension - 1}`;
  }
  if (xEndingPosition < 0 || xEndingPosition >= mazeDimension) {
    return `X ending position must be between 0 and ${mazeDimension - 1}`;
  }
  if (yEndingPosition < 0 || yEndingPosition >= mazeDimension) {
    return `Y ending position must be between 0 and ${mazeDimension - 1}`;
  }

  if (
    xStartingPosition === xEndingPosition &&
    yStartingPosition === yEndingPosition
  ) {
    return "Starting and ending positions cannot be the same";
  }

  const startIndex = yStartingPosition * mazeDimension + xStartingPosition;
  const endIndex = yEndingPosition * mazeDimension + xEndingPosition;

  if (mazeLayout[startIndex] === "1") {
    return "Starting position cannot be on a wall";
  }

  if (mazeLayout[endIndex] === "1") {
    return "Ending position cannot be on a wall";
  }

  return null;
};

export function validateMazeData(body, requireId = false) {
  const {
    id,
    mazeLevel,
    difficultyLevelId,
    mazeLayout,
    xStartingPosition,
    yStartingPosition,
    xEndingPosition,
    yEndingPosition,
  } = body;

  if (!body) {
    return "Request body is required";
  } else if (requireId && !id) {
    return "Maze ID is required";
  } else if (mazeLevel === undefined || mazeLevel === null) {
    return "Maze level is required";
  } else if (typeof mazeLevel !== "number") {
    return "Maze level must be a number";
  } else if (difficultyLevelId === undefined || difficultyLevelId === null) {
    return "Difficulty level ID is required";
  } else if (typeof difficultyLevelId !== "number") {
    return "Difficulty level ID must be a number";
  } else if (!mazeLayout) {
    return "Maze layout is required";
  } else if (typeof mazeLayout !== "string") {
    return "Maze layout must be a string";
  } else if (Math.sqrt(mazeLayout.length) % 1 !== 0) {
    return "Maze layout must be a perfect square";
  } else if (xStartingPosition === undefined || xStartingPosition === null) {
    return "X starting position is required";
  } else if (typeof xStartingPosition !== "number") {
    return "X starting position must be a number";
  } else if (yStartingPosition === undefined || yStartingPosition === null) {
    return "Y starting position is required";
  } else if (typeof yStartingPosition !== "number") {
    return "Y starting position must be a number";
  } else if (xEndingPosition === undefined || xEndingPosition === null) {
    return "X ending position is required";
  } else if (typeof xEndingPosition !== "number") {
    return "X ending position must be a number";
  } else if (yEndingPosition === undefined || yEndingPosition === null) {
    return "Y ending position is required";
  } else if (typeof yEndingPosition !== "number") {
    return "Y ending position must be a number";
  }

  const mazePositionsError = validateMazePositions(
    mazeLayout,
    xStartingPosition,
    yStartingPosition,
    xEndingPosition,
    yEndingPosition
  );

  if (mazePositionsError) {
    return mazePositionsError;
  }

  return null; // No validation errors
}
