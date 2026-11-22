import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { currentUser } from "../data.js";

describe("POST /api/auth/login", () => {
  it("returns a token and the current user", async () => {
    const res = await request(app).post("/api/auth/login");
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a("string");
    expect(res.body.user).to.deep.equal(currentUser);
  });

  it("only accepts POST", async () => {
    const res = await request(app).get("/api/auth/login");
    expect(res.status).to.equal(404);
  });
});

describe("GET /api/me", () => {
  it("returns the current user", async () => {
    const res = await request(app).get("/api/me");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(currentUser);
  });
});
