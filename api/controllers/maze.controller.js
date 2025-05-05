export const getAllMazes = async (req, res, next) => {
  try {
    const mazes = [{ maze: 1 }, { maze: 2 }];
    res.json(mazes);
  } catch (err) {
    next(err);
  }
};
