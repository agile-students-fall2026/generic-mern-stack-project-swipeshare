import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { currentUser } from "../data.js";

describe("GET /api/me/listings", () => {
  it("only returns the current user's listings", async () => {
    const res = await request(app).get("/api/me/listings");
    expect(res.status).to.equal(200);
    for (const l of res.body) expect(l.seller.id).to.equal(currentUser.id);
  });

  it("filters by status", async () => {
    const res = await request(app).get("/api/me/listings?status=active");
    for (const l of res.body) expect(l.status).to.equal("active");
  });
});
