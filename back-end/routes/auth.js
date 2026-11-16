import express from "express";
import { currentUser } from "../data.js";

const router = express.Router();

// Mocked for Sprint 2: everyone gets logged in as the same mock user.
// In Sprint 3 this will check the Google token, find or create the user
// in MongoDB, and send back a real JWT.
router.post("/api/auth/login", (req, res) => {
  res.json({ token: "mock-token", user: currentUser });
});

export default router;
