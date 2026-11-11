import { app } from "../index.js";
import express from 'express'
const router = express.Router()

router.post("/api/review", (req, res) => {
  res.status(201).json({});
});

export default router