import { delay, http, HttpResponse } from "msw";
import { locations } from "../../../shared/locations";
import { listingData } from "./data";

export const handlers = [
  http.get("/api/health", async () => {
    await delay();
    return HttpResponse.json({
      status: "ok",
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
    });
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

    let result = listingData.filter((l) =>
      l.fulfillment === "in_person"
        ? overlaps(l.availableAt, l.availableAt)
        : l.windows.some((w) => overlaps(w.start, w.end)),
    );
    if (fulfillment) {
      result = result.filter((l) => l.fulfillment === fulfillment);
    }
    if (diningHall) {
      result = result.filter(
        (l) =>
          l.fulfillment !== "in_person" || l.diningHalls.includes(diningHall),
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

  http.get("/api/dining-halls", async () => {
    await delay();
    return HttpResponse.json(locations);
  }),
];
