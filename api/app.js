import express from "express";
import healthRoute from "./routes/health.routes.js";
import mazeRoutes from "./routes/maze.routes.js";

const app = express();
app.use(express.json());
app.use("/api/health", healthRoute);
app.use("/api/mazes", mazeRoutes);

export default app;
