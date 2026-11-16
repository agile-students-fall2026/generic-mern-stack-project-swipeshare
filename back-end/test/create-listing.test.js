import { expect } from "chai";
import request from "supertest";
import { locations } from "../../shared/locations.js";
import { app } from "../app.js";

const hoursFromNow = (hours) =>
  new Date(Date.now() + hours * 3600000).toISOString();

const futureWindow = () => ({ start: hoursFromNow(1), end: hoursFromNow(2) });
const pastWindow = () => ({ start: hoursFromNow(-3), end: hoursFromNow(-2) });

const diningHallIds = [locations[0].id, locations[2].id];

const inPersonBody = (overrides = {}) => ({
  fulfillment: "in_person",
  price: 850,
  paymentMethods: ["venmo", "cash"],
  windows: [futureWindow()],
  diningHallIds,
  ...overrides,
});

const onlineBody = (overrides = {}) => ({
  fulfillment: "online",
  price: 900,
  paymentMethods: ["zelle"],
  windows: [futureWindow()],
  quantity: 3,
  ...overrides,
});

const postListing = (body) => request(app).post("/api/listings").send(body);

const expectBadRequest = (res) => {
  expect(res.status).to.equal(400);
  expect(res.body.message).to.be.a("string").with.lengthOf.above(0);
};

describe("Create Listing", () => {
  describe("GET /api/dining-halls", () => {
    it("returns the shared locations", async () => {
      const res = await request(app).get("/api/dining-halls");

      expect(res.status).to.equal(200);
      expect(res.type).to.equal("application/json");
      expect(res.body).to.deep.equal(locations);
    });

    it("gives every location the id and name the form needs", async () => {
      const res = await request(app).get("/api/dining-halls");

      expect(res.body).to.be.an("array").with.lengthOf.above(0);
      for (const hall of res.body) {
        expect(hall.id).to.be.a("string").with.lengthOf.above(0);
        expect(hall.name).to.be.a("string").with.lengthOf.above(0);
      }
    });
  });

  describe("POST /api/listings", () => {
    it("creates an in-person listing", async () => {
      const body = inPersonBody();
      const res = await postListing(body);

      expect(res.status).to.equal(201);
      expect(res.body.id).to.be.a("string").with.lengthOf.above(0);
      expect(res.body).to.include({
        fulfillment: "in_person",
        price: body.price,
        status: "active",
      });
      expect(res.body.paymentMethods).to.deep.equal(body.paymentMethods);
      expect(res.body.windows).to.deep.equal(body.windows);
      expect(res.body.seller.id).to.be.a("string");
      expect(Number.isNaN(Date.parse(res.body.createdAt))).to.equal(false);
      expect(res.body.diningHalls.map((hall) => hall.id)).to.have.members(
        diningHallIds,
      );
      expect(res.body).to.not.have.property("quantity");
    });

    it("creates a quantity-based listing", async () => {
      const body = onlineBody();
      const res = await postListing(body);

      expect(res.status).to.equal(201);
      expect(res.body.id).to.be.a("string").with.lengthOf.above(0);
      expect(res.body).to.include({
        fulfillment: "online",
        price: body.price,
        status: "active",
        quantity: body.quantity,
      });
      expect(res.body.paymentMethods).to.deep.equal(body.paymentMethods);
      expect(res.body.windows).to.deep.equal(body.windows);
      expect(res.body).to.not.have.property("diningHalls");
    });

    it("gives each new listing its own id", async () => {
      const first = await postListing(inPersonBody());
      const second = await postListing(inPersonBody());

      expect(first.body.id).to.not.equal(second.body.id);
    });

    it("saves the listing so its detail page can load it", async () => {
      const created = await postListing(inPersonBody());
      const fetched = await request(app).get(
        `/api/listings/${created.body.id}`,
      );

      expect(fetched.status).to.equal(200);
      expect(fetched.body).to.deep.equal(created.body);
    });

    describe("rejects invalid input with 400 and a message", () => {
      const invalidBodies = {
        "a zero price": inPersonBody({ price: 0 }),
        "a negative price": inPersonBody({ price: -100 }),
        "a missing price": inPersonBody({ price: undefined }),
        "empty paymentMethods": inPersonBody({ paymentMethods: [] }),
        "missing paymentMethods": inPersonBody({ paymentMethods: undefined }),
        "empty windows": inPersonBody({ windows: [] }),
        "missing windows": inPersonBody({ windows: undefined }),
        "a past end time": inPersonBody({ windows: [pastWindow()] }),
      };

      for (const [name, body] of Object.entries(invalidBodies)) {
        it(name, async () => {
          expectBadRequest(await postListing(body));
        });
      }

      it("and does not save the rejected listing", async () => {
        const marker = 123457;
        await postListing(inPersonBody({ price: marker, windows: [] }));
        const all = await request(app).get("/api/listings");

        expect(all.body.map((listing) => listing.price)).to.not.include(marker);
      });
    });

    describe("rejects the cases added by the shared schema (#58)", () => {
      const invalidBodies = {
        "an in-person listing with no diningHallIds": inPersonBody({
          diningHallIds: undefined,
        }),
        "an in-person listing with empty diningHallIds": inPersonBody({
          diningHallIds: [],
        }),
        "a quantity-based listing with no quantity": onlineBody({
          quantity: undefined,
        }),
        "a quantity-based listing with a zero quantity": onlineBody({
          quantity: 0,
        }),
        "a quantity-based listing with a negative quantity": onlineBody({
          quantity: -1,
        }),
        "a quantity-based listing with a fractional quantity": onlineBody({
          quantity: 2.5,
        }),
        "windows that have all ended": inPersonBody({
          windows: [pastWindow(), pastWindow()],
        }),
      };

      for (const [name, body] of Object.entries(invalidBodies)) {
        it(name, async () => {
          expectBadRequest(await postListing(body));
        });
      }

      it("a request with no body", async () => {
        expectBadRequest(await request(app).post("/api/listings"));
      });
    });
  });
});