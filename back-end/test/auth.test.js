import { expect } from "chai";
import request from "supertest";
import { app } from "../app.js";
import { currentUser } from "../data.js";
import { isNyuEmail } from "../routes/auth.js";

describe("isNyuEmail", () => {
  it("accepts NYU emails", () => {
    expect(isNyuEmail("alex@nyu.edu")).to.equal(true);
  });

  it("ignores capital letters", () => {
    expect(isNyuEmail("Alex@NYU.EDU")).to.equal(true);
  });

  it("rejects other emails", () => {
    expect(isNyuEmail("alex@gmail.com")).to.equal(false);
  });

  it("rejects look-alike domains", () => {
    expect(isNyuEmail("alex@notnyu.edu")).to.equal(false);
    expect(isNyuEmail("alex@nyu.edu.fake.com")).to.equal(false);
  });

  it("rejects missing emails", () => {
    expect(isNyuEmail(undefined)).to.equal(false);
  });
});

// We can't sign in with a real Google account in tests,
// so these check that bad requests get turned away.
describe("POST /api/auth/login", () => {
  it("returns 400 without a Google credential", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).to.equal(400);
    expect(res.body.message).to.be.a("string");
  });

  it("returns 401 for a fake Google credential", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ credential: "not-a-real-token" });
    expect(res.status).to.equal(401);
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
