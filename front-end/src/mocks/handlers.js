import { delay, http, HttpResponse } from "msw";
import { locations } from "../../../shared/locations";
import { currentUser, listingData, purchaseData } from "./data";

const error = (status, message) => HttpResponse.json({ message }, { status });

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
    if (params.size > 0) {
      const count = Math.ceil(Math.random() * listingData.length);
      return HttpResponse.json(listingData.slice(0, count));
    }

    return HttpResponse.json(listingData);
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
    if (
      !(body.price > 0) ||
      !body.paymentMethods?.length ||
      !body.windows?.length
    ) {
      return error(400, "Missing price, payment methods, or time");
    }
    if (new Date(body.windows[0].end) <= new Date()) {
      return error(400, "Pick a time in the future");
    }
    const inPerson = body.fulfillment === "in_person";
    const listing = {
      id: crypto.randomUUID(),
      fulfillment: body.fulfillment,
      seller: currentUser,
      price: body.price,
      paymentMethods: body.paymentMethods,
      status: "active",
      createdAt: new Date().toISOString(),
      windows: body.windows,
      ...(inPerson
        ? {
            diningHalls: locations.filter((l) =>
              body.diningHallIds?.includes(l.id),
            ),
          }
        : { quantity: body.quantity }),
    };
    // Saved so it shows up in My Listings and its detail page
    listingData.unshift(listing);
    return HttpResponse.json(listing, { status: 201 });
  }),

  http.get("/api/listings/:id/purchases", async ({ params }) => {
    await delay();
    return HttpResponse.json(
      purchaseData.filter((p) => p.listingId === params.id),
    );
  }),

  http.get("/api/me/listings", async ({ request }) => {
    await delay();
    const status = new URL(request.url).searchParams.get("status");
    return HttpResponse.json(
      listingData.filter(
        (l) =>
          l.seller.id === currentUser.id && (!status || l.status === status),
      ),
    );
  }),

  http.post("/api/purchases", async () => {
    await delay();
    return HttpResponse.json(purchaseData[0], { status: 201 });
  }),

  http.get("/api/purchases/:id", async ({ params }) => {
    await delay();
    const purchase = purchaseData.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    return HttpResponse.json(purchase);
  }),

  http.post("/api/purchases/:id/complete", async ({ params }) => {
    await delay();
    const purchase = purchaseData.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    return HttpResponse.json({ ...purchase, status: "completed" });
  }),

  http.post("/api/purchases/:id/cancel", async ({ params }) => {
    await delay();
    const purchase = purchaseData.find((p) => p.id === params.id);
    if (!purchase) return error(404, "Purchase not found");
    return HttpResponse.json({ ...purchase, status: "cancelled" });
  }),

  http.get("/api/dining-halls", async () => {
    await delay();
    return HttpResponse.json(locations);
  }),
];
