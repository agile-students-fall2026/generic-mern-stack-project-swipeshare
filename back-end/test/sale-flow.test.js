import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { listingData, purchaseData } from "../data.js";

const listing = listingData.find((l) => l.id === "m2");
const purchase = purchaseData.find((p) => p.listingId === listing.id);
const unsoldListing = listingData.find(
  (l) => !purchaseData.some((p) => p.listingId === l.id),
);

const expectNotFound = (res) => {
  expect(res.status).to.equal(404);
  expect(res.body.message).to.be.a("string").with.lengthOf.above(0);
};

describe("Sale Flow", () => {
  describe("GET /api/listings/:id", () => {
    it("returns the listing", async () => {
      const res = await request(app).get(`/api/listings/${listing.id}`);

      expect(res.status).to.equal(200);
      expect(res.type).to.equal("application/json");
      expect(res.body).to.deep.equal(listing);
    });

    it("returns the fields the page renders", async () => {
      const res = await request(app).get(`/api/listings/${listing.id}`);

      expect(res.body).to.include.keys(
        "id",
        "fulfillment",
        "price",
        "paymentMethods",
        "status",
        "windows",
        "seller",
      );
    });

    it("returns 404 for an unknown id", async () => {
      expectNotFound(await request(app).get("/api/listings/no-such-listing"));
    });
  });

  describe("GET /api/listings/:id/purchases", () => {
    it("returns the purchases made on the listing", async () => {
      const res = await request(app).get(
        `/api/listings/${listing.id}/purchases`,
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array").with.lengthOf.above(0);
      expect(res.body.map((p) => p.id)).to.include(purchase.id);
      for (const p of res.body) {
        expect(p.listingId).to.equal(listing.id);
      }
    });

    it("returns [] for a listing nobody has bought", async () => {
      const res = await request(app).get(
        `/api/listings/${unsoldListing.id}/purchases`,
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
    });

    it("returns [] for an unknown id", async () => {
      const res = await request(app).get(
        "/api/listings/no-such-listing/purchases",
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal([]);
    });
  });

  describe("POST /api/purchases/:id/complete", () => {
    it("returns the purchase with status completed", async () => {
      const res = await request(app).post(
        `/api/purchases/${purchase.id}/complete`,
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.include({
        id: purchase.id,
        listingId: listing.id,
        status: "completed",
      });
    });

    it("returns 404 for an unknown id", async () => {
      expectNotFound(
        await request(app).post("/api/purchases/no-such-purchase/complete"),
      );
    });
  });

  describe("POST /api/purchases/:id/cancel", () => {
    it("returns the purchase with status cancelled", async () => {
      const res = await request(app).post(
        `/api/purchases/${purchase.id}/cancel`,
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.include({
        id: purchase.id,
        listingId: listing.id,
        status: "cancelled",
      });
    });

    it("returns 404 for an unknown id", async () => {
      expectNotFound(
        await request(app).post("/api/purchases/no-such-purchase/cancel"),
      );
    });
  });
});
