import express from "express";
import { locations } from "../../shared/locations.js";
import { currentUser, listingData, purchaseData } from "../data.js";

const router = express.Router();

router.get("/api/listings", (req, res) => {
  const params = req.query;
  if (Object.keys(params).length > 0) {
    const count = Math.ceil(Math.random() * listingData.length);
    return res.json(listingData.slice(0, count));
  }

  return res.json(listingData);
});

router.get("/api/listings/:id", (req, res) => {
  const listing = listingData.find((l) => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  return res.json(listing);
});

router.get("/api/listings/:id/purchases", (req, res) => {
  const purchases = purchaseData.filter((p) => p.listingId === req.params.id);
  return res.json(purchases);
});

router.post("/api/listings", (req, res) => {
  const body = req.body;
  if (
    !(body.price > 0) ||
    !body.paymentMethods?.length ||
    !body.windows?.length
  ) {
    return res
      .status(400)
      .json({ message: "Missing price, payment methods, or time" });
  }
  if (new Date(body.windows[0].end) <= new Date()) {
    return res.status(400).json({ message: "Pick a time in the future" });
  }
  const inPerson = body.fulfillment === "in_person";
  const listing = {
    id: crypto.randomUUID(),
    fulfillment: body.fulfillment,
    seller: currentUser,
    price: body.price,
    paymentMethods: body.paymentMethods,
    status: "active",
    createdAt: new Date().toISOString(),
    windows: body.windows,
    ...(inPerson
      ? {
          diningHalls: locations.filter((l) =>
            body.diningHallIds?.includes(l.id),
          ),
        }
      : { quantity: body.quantity }),
  };
  // Saved so it shows up in My Listings and its detail page
  listingData.unshift(listing);
  return res.status(201).json(listing);
});

router.get("/api/me/listings", (req, res) => {
  const status = req.query.status;
  return res.json(
    listingData.filter(
      (l) => l.seller.id === currentUser.id && (!status || l.status === status),
    ),
  );
});

export default router;
