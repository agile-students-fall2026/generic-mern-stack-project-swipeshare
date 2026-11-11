import express from "express";
import { purchaseData } from "../data.js";

const router = express.Router();

router.post("/api/purchases", (req, res) => {
  return res.status(201).json(purchaseData[0]);
});

router.get("/api/purchases/:id", (req, res) => {
  const purchase = purchaseData.find((p) => p.id === req.params.id);
  if (!purchase) return res.status(404).json({ message: "Purchase not found" });
  return res.json(purchase);
});

router.post("/api/purchases/:id/complete", (req, res) => {
  const purchase = purchaseData.find((p) => p.id === req.params.id);
  if (!purchase) return res.status(404).json({ message: "Purchase not found" });
  return res.json({ ...purchase, status: "completed" });
});

router.post("/api/purchases/:id/cancel", (req, res) => {
  const purchase = purchaseData.find((p) => p.id === req.params.id);
  if (!purchase) return res.status(404).json({ message: "Purchase not found" });
  return res.json({ ...purchase, status: "cancelled" });
});

export default router;
