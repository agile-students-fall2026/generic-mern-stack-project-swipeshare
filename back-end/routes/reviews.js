import express from "express";
import { createReviewSchema, errorMessage } from "../../shared/schemas.js";

const router = express.Router();

router.post("/api/review", (req, res) => {
  const result = createReviewSchema.safeParse(req.body ?? {});
  if (!result.success) {
    return res.status(400).json({ message: errorMessage(result.error) });
  }
  res.status(201).json({});
});

export default router;
