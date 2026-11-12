import express from "express";
import listingsRouter from "./routes/listings.js";
import miscRouter from "./routes/misc.js";
import purchasesRouter from "./routes/purchases.js";
import reviewsRouter from "./routes/reviews.js";

export const app = express();
app.use(express.json());

app.use(listingsRouter);
app.use(purchasesRouter);
app.use(reviewsRouter);
app.use(miscRouter);
