import express from "express";

const router = express.Router();

router.post("/api/review", (req, res) => {
  if (!req.body || !req.body.purchaseId || !req.body.rating || !req.body.comment) {
    return res.status(400).send("Missing review data");
  }
  res.status(201).json({});
});

export default router;
