import express from "express";
import { app } from "../index.js";

const router = express.Router();

router.post("/api/review", (req, res) => {
  res.status(201).json({});
});

export default router;
