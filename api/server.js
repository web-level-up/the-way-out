import dotenv from "dotenv";
import express from "express";
import healthRoute from "./routes/health.routes.js";
import mazeRoutes from "./routes/maze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { auth } from "./middleware/auth.js";
import { cors } from "./middleware/cors.js";

const app = express();
app.use(express.json());

app.use(cors);
//app.use(auth);

app.use("/api/health", healthRoute);
app.use("/api/mazes", mazeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Maze API running on http://localhost:${PORT}`);
});
