import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { listingData } from "../data.js";

describe("GET /api/listings", () => {
  it("returns every listing without filters", async () => {
    const res = await request(app).get("/api/listings");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.lengthOf(listingData.length);
  });

  it("returns a non-empty subset with filters", async () => {
    const res = await request(app).get("/api/listings?diningHall=Palladium");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").with.lengthOf.above(0);
    expect(res.body.length).to.be.at.most(listingData.length);
  });
});

describe("POST /api/purchases", () => {
  it("returns 201 with a purchase", async () => {
    const res = await request(app).post("/api/purchases").send({});
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
  });
});
