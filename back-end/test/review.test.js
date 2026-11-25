import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { currentUser } from "../data.js";

describe("POST /api/review", () => {
  it("400 on Empty", async () => {
    const res = await request(app).post("/api/review");
    expect(res.status).to.equal(400);
    expect(res.body.message).to.be.a("string");
  });

  it("only accepts POST", async () => {
    const res = await request(app).get("/api/review");
    expect(res.status).to.equal(404);
  });

  it("201 on valid review", async () => {
    const res = await request(app).post("/api/review").send({
      purchaseId: "purchase1",
      rating: 5,
      comment: "Great product!",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an("object");
  });

  it("201 on review without a comment", async () => {
    const res = await request(app).post("/api/review").send({
      purchaseId: "purchase1",
      rating: 0,
    });
    expect(res.status).to.equal(201);
  });
});
