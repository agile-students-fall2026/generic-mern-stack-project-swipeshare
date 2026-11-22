import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { currentUser } from "../data.js";

describe("POST /api/purchases/:id/complete", () => {
  it("404 on invalid ID", async () => {
    const res = await request(app).post("/api/purchases/-1/complete");
    expect(res.status).to.equal(404);
    expect(res.body.message).to.be.a("string");
    expect(res.body.message).to.equal("Purchase not found");
  });

  it("only accepts POST", async () => {
    const purchaseId = await request(app)
      .post("/api/purchases")
      .send({})
      .then((res) => res.body.id);
    const res = await request(app).get(`/api/purchases/${purchaseId}/complete`);
    expect(res.status).to.equal(404);
  });

  it("200 OK on valid ID", async () => {
    const purchaseId = await request(app)
      .post("/api/purchases")
      .send({})
      .then((res) => res.body.id);
    const res = await request(app).post(
      `/api/purchases/${purchaseId}/complete`,
    );
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("completed");
  });
});

describe("POST /api/purchases/:id/cancel", () => {
  it("404 on invalid ID", async () => {
    const res = await request(app).post("/api/purchases/-1/cancel");
    expect(res.status).to.equal(404);
    expect(res.body.message).to.be.a("string");
    expect(res.body.message).to.equal("Purchase not found");
  });

  it("only accepts POST", async () => {
    const purchaseId = await request(app)
      .post("/api/purchases")
      .send({})
      .then((res) => res.body.id);
    const res = await request(app).get("/api/purchases/${purchaseId}/cancel");
    expect(res.status).to.equal(404);
  });

  it("200 OK on valid ID", async () => {
    const purchaseId = await request(app)
      .post("/api/purchases")
      .send({})
      .then((res) => res.body.id);
    const res = await request(app).post(`/api/purchases/${purchaseId}/cancel`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("cancelled");
  });
});
