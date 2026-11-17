import { expect } from "chai";
import { locations } from "../../shared/locations.js";
import {
  createListingSchema,
  createReviewSchema,
  errorMessage,
  listingSchema,
  purchaseSchema,
} from "../../shared/schemas.js";
import { listingData, purchaseData } from "../data.js";

const hoursFromNow = (hours) =>
  new Date(Date.now() + hours * 3600000).toISOString();

const futureWindow = () => ({ start: hoursFromNow(1), end: hoursFromNow(2) });
const pastWindow = () => ({ start: hoursFromNow(-3), end: hoursFromNow(-2) });

const inPersonBody = (overrides = {}) => ({
  fulfillment: "in_person",
  price: 850,
  paymentMethods: ["venmo", "cash"],
  windows: [futureWindow()],
  diningHallIds: [locations[0].id],
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

const expectInvalid = (schema, value) => {
  const result = schema.safeParse(value);
  expect(result.success).to.equal(false);
  expect(errorMessage(result.error)).to.be.a("string").with.lengthOf.above(0);
};

describe("Shared schemas", () => {
  describe("createListingSchema", () => {
    it("accepts an in-person listing", () => {
      expect(createListingSchema.safeParse(inPersonBody()).success).to.equal(
        true,
      );
    });

    it("accepts an online listing", () => {
      expect(createListingSchema.safeParse(onlineBody()).success).to.equal(
        true,
      );
    });

    it("accepts windows when at least one has not ended", () => {
      const body = inPersonBody({ windows: [pastWindow(), futureWindow()] });
      expect(createListingSchema.safeParse(body).success).to.equal(true);
    });

    it("drops fields that belong to the other fulfillment type", () => {
      const inPerson = createListingSchema.parse(inPersonBody({ quantity: 4 }));
      const online = createListingSchema.parse(
        onlineBody({ diningHallIds: [locations[0].id] }),
      );

      expect(inPerson).to.not.have.property("quantity");
      expect(online).to.not.have.property("diningHallIds");
    });

    const invalidBodies = {
      "no body": undefined,
      "an unknown fulfillment": inPersonBody({ fulfillment: "delivery" }),
      "a zero price": inPersonBody({ price: 0 }),
      "a fractional price": inPersonBody({ price: 8.5 }),
      "an unknown payment method": inPersonBody({ paymentMethods: ["btc"] }),
      "repeated payment methods": inPersonBody({
        paymentMethods: ["venmo", "venmo"],
      }),
      "a window that ends before it starts": inPersonBody({
        windows: [{ start: hoursFromNow(2), end: hoursFromNow(1) }],
      }),
      "windows that have all ended": inPersonBody({
        windows: [pastWindow(), pastWindow()],
      }),
      "an in-person listing with no diningHallIds": inPersonBody({
        diningHallIds: undefined,
      }),
      "an in-person listing with empty diningHallIds": inPersonBody({
        diningHallIds: [],
      }),
      "an in-person listing with an unknown dining hall": inPersonBody({
        diningHallIds: ["not-a-hall"],
      }),
      "an online listing with no quantity": onlineBody({ quantity: undefined }),
      "an online listing with a zero quantity": onlineBody({ quantity: 0 }),
      "an online listing with a fractional quantity": onlineBody({
        quantity: 2.5,
      }),
      "an online listing that takes cash": onlineBody({
        paymentMethods: ["cash"],
      }),
    };

    for (const [name, body] of Object.entries(invalidBodies)) {
      it(`rejects ${name}`, () => {
        expectInvalid(createListingSchema, body);
      });
    }
  });

  describe("listingSchema", () => {
    it("matches the seed listings", () => {
      for (const listing of listingData) {
        expect(listingSchema.safeParse(listing).success).to.equal(true);
      }
    });
  });

  describe("purchaseSchema", () => {
    it("matches the seed purchases", () => {
      for (const purchase of purchaseData) {
        expect(purchaseSchema.safeParse(purchase).success).to.equal(true);
      }
    });
  });

  describe("createReviewSchema", () => {
    it("accepts a rating with an optional comment", () => {
      expect(
        createReviewSchema.safeParse({ purchaseId: "p1", rating: 9 }).success,
      ).to.equal(true);
      expect(
        createReviewSchema.safeParse({
          purchaseId: "p1",
          rating: -1,
          comment: "Smooth swap",
        }).success,
      ).to.equal(true);
    });

    for (const rating of [-2, 11, 4.5]) {
      it(`rejects a rating of ${rating}`, () => {
        expectInvalid(createReviewSchema, { purchaseId: "p1", rating });
      });
    }
  });
});
