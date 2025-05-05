import dotenv from "dotenv";
import express from "express";
import healthRoute from "./routes/health.routes.js";
import mazeRoutes from "./routes/maze.route.js";

const app = express();
app.use(express.json());
app.use("/api/health", healthRoute);
app.use("/api/mazes", mazeRoutes);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Maze API running on http://localhost:${PORT}`);
});
