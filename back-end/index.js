import dotenv from "dotenv";
import express from "express";
import { locations } from "../shared/locations.js";
import { currentUser, listingData, purchaseData } from "./data.js";
import listingsRouter from "./routes/listings.js";
import miscRouter from "./routes/misc.js";
import purchasesRouter from "./routes/purchases.js";
import reviewsRouter from "./routes/reviews.js";

dotenv.config();

export const app = express();
app.use(express.json());

app.use(listingsRouter);
app.use(purchasesRouter);
app.use(reviewsRouter);
app.use(miscRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
