import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.status(200).json({ body: "Healthy" }));

export default router;
