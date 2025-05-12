export const cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ALLOW);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};
