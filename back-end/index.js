import express from 'express';
import dotenv from 'dotenv';
import { currentUser, listingData, purchaseData } from "./data.js";
import { locations } from '../shared/locations.js';
dotenv.config();

const app = express();

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});

app.post("/api/review", (req, res) => {
    res.status(201).json({});
});

app.get("/api/listings", (req, res) => {
    const params = req.query;
    if (Object.keys(params).length > 0) {
        const count = Math.ceil(Math.random() * listingData.length);
        return res.json(listingData.slice(0, count));
    }

    return res.json(listingData);
});

app.get("/api/listings/:id", (req, res) => {
    const listing = listingData.find((l) => l.id === req.params.id);
    if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
    }
    return res.json(listing);
});

app.post("/api/listings", (req, res) => {
    const body = req.body;
    if (
        !(body.price > 0) ||
        !body.paymentMethods?.length ||
        !body.windows?.length
    ) {
        return res.status(400).json({ message: "Missing price, payment methods, or time" });
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

app.get("/api/me/listings", (req, res) => {
    const status = req.query.status;
    return res.json(
        listingData.filter(
            (l) =>
                l.seller.id === currentUser.id && (!status || l.status === status),
        ),
    );
});

app.post("/api/purchases", (req, res) => {
    return res.status(201).json(purchaseData[0]);
});

app.get("/api/purchases/:id", (req, res) => {
    const purchase = purchaseData.find((p) => p.id === req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    return res.json(purchase);
});

app.post("/api/purchases/:id/complete", (req, res) => {
    const purchase = purchaseData.find((p) => p.id === req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    return res.json({ ...purchase, status: "completed" });
});

app.post("/api/purchases/:id/cancel", (req, res) => {
    const purchase = purchaseData.find((p) => p.id === req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    return res.json({ ...purchase, status: "cancelled" });
});

app.get("/api/dining-halls", (req, res) => {
    return res.json(locations);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});