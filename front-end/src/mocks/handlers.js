import { delay, http, HttpResponse } from "msw";
import { locations } from "../../../shared/locations";
import {
  currentUser,
  listingData,
  paymentInfo,
  phones,
  purchaseData,
} from "./data";

const purchases = [...purchaseData];

const error = (status, message) => HttpResponse.json({ message }, { status });

const inWindow = (listing, time) =>
  listing.windows.some(
    (w) => new Date(w.start) <= time && time < new Date(w.end),
  );

export const handlers = [
  http.get("/api/health", async () => {
    await delay();
    return HttpResponse.json({
      status: "ok",
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post("/api/review", async () => {
    await delay();
    return HttpResponse.json({}, { status: 201 });
  }),

  http.get("/api/listings", async ({ request }) => {
    await delay();

    const params = new URL(request.url).searchParams;
    const fulfillment = params.get("fulfillment");
    const diningHall = params.get("diningHall");
    const from = new Date(params.get("from") ?? Date.now());
    const to = params.has("to") ? new Date(params.get("to")) : null;

    const overlaps = (start, end) =>
      new Date(end) >= from && (!to || new Date(start) <= to);

    let result = listingData.filter(
      (l) =>
        l.status === "active" &&
        l.windows.some((w) => overlaps(w.start, w.end)),
    );
    if (fulfillment) {
      result = result.filter((l) => l.fulfillment === fulfillment);
    }
    if (diningHall) {
      result = result.filter(
        (l) =>
          l.fulfillment !== "in_person" ||
          l.diningHalls.some((h) => h.name === diningHall),
      );
    }

    return HttpResponse.json(result);
  }),

  http.get("/api/listings/:id", async ({ params }) => {
    await delay();
    const listing = listingData.find((l) => l.id === params.id);
    if (!listing) {
      return HttpResponse.json(
        { message: "Listing not found" },
        { status: 404 },
      );
    }
    return HttpResponse.json(listing);
  }),

  http.post("/api/listings", async ({ request }) => {
    await delay();
    const body = await request.json();
    const slot = body.windows?.[0];

    if (!(body.price > 0)) return error(400, "Price must be more than $0");
    if (!body.paymentMethods?.length) {
      return error(400, "Pick at least one payment method");
    }
    if (!slot || new Date(slot.end) <= new Date(slot.start)) {
      return error(400, "The end time must be after the start time");
    }
    if (new Date(slot.end) <= new Date()) {
      return error(400, "Pick a time in the future");
    }

    const listing = {
      id: crypto.randomUUID(),
      fulfillment: body.fulfillment,
      seller: currentUser,
      price: body.price,
      paymentMethods: body.paymentMethods,
      windows: body.windows,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    if (body.fulfillment === "in_person") {
      listing.diningHalls = locations.filter((l) =>
        body.diningHallIds?.includes(l.id),
      );
      if (listing.diningHalls.length === 0) {
        return error(400, "Pick at least one dining hall");
      }
    } else {
      if (!(body.quantity >= 1)) return error(400, "Sell at least 1 swipe");
      if (body.paymentMethods.includes("cash")) {
        return error(400, "Cash isn't allowed for online orders");
      }
      listing.quantity = body.quantity;
    }

    listingData.push(listing);
    return HttpResponse.json(listing, { status: 201 });
  }),

  http.get("/api/purchases", async ({ request }) => {
    await delay();
    const listingId = new URL(request.url).searchParams.get("listingId");
    const listing = listingData.find((l) => l.id === listingId);
    if (!listing) return error(404, "Listing not found");
    if (listing.seller.id !== currentUser.id) {
      return error(403, "Only the seller can see this listing's sales");
    }
    return HttpResponse.json(
      purchases.filter((p) => p.listingId === listingId),
    );
  }),

  http.post("/api/purchases", async ({ request }) => {
    await delay();
    const { listingId, diningHallId, meetAt } = await request.json();
    const listing = listingData.find((l) => l.id === listingId);
    if (!listing) return error(404, "Listing not found");
    if (listing.status !== "active") {
      return error(409, "This swipe is no longer available");
    }

    const now = new Date();
    let diningHall = null;
    if (listing.fulfillment === "in_person") {
      diningHall = listing.diningHalls.find((h) => h.id === diningHallId);
      if (!diningHall)
        return error(400, "Pick one of the seller's dining halls");
      const time = new Date(meetAt);
      if (!meetAt || time < now || !inWindow(listing, time)) {
        return error(400, "Pick a time when the seller is available");
      }
      listing.status = "sold";
    } else {
      if (!inWindow(listing, now)) {
        return error(409, "The seller isn't taking orders right now");
      }
      listing.quantity -= 1;
      if (listing.quantity === 0) listing.status = "sold";
    }

    const purchase = {
      id: crypto.randomUUID(),
      listingId: listing.id,
      fulfillment: listing.fulfillment,
      seller: { ...listing.seller, phone: phones[listing.seller.id] },
      buyer: { ...currentUser, phone: phones[currentUser.id] },
      price: listing.price,
      paymentMethods: listing.paymentMethods,
      paymentInfo: paymentInfo[listing.seller.id],
      diningHall,
      meetAt: listing.fulfillment === "in_person" ? meetAt : null,
      orderNumber: null,
      status: "pending",
      createdAt: now.toISOString(),
    };
    purchases.push(purchase);
    return HttpResponse.json(purchase, { status: 201 });
  }),

  http.get("/api/purchases/:id", async ({ params }) => {
    await delay();
    const purchase = purchases.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    return HttpResponse.json(purchase);
  }),

  http.post("/api/purchases/:id/complete", async ({ params }) => {
    await delay();
    const purchase = purchases.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    if (purchase.status !== "pending") {
      return error(409, `This purchase is already ${purchase.status}`);
    }
    purchase.status = "completed";
    return HttpResponse.json(purchase);
  }),

  http.post("/api/purchases/:id/cancel", async ({ params }) => {
    await delay();
    const purchase = purchases.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    if (purchase.status !== "pending") {
      return error(409, `This purchase is already ${purchase.status}`);
    }
    purchase.status = "cancelled";
    const listing = listingData.find((l) => l.id === purchase.listingId);
    if (listing.fulfillment === "online") listing.quantity += 1;
    listing.status = "active";
    return HttpResponse.json(purchase);
  }),

  http.get("/api/dining-halls", async () => {
    await delay();
    return HttpResponse.json(locations);
  }),
];
