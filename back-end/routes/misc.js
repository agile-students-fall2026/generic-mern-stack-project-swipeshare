import express from "express";
import { locations } from "../../shared/locations.js";

const router = express.Router();

router.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

router.get("/api/dining-halls", (req, res) => {
  return res.json(locations);
});

export default router;
