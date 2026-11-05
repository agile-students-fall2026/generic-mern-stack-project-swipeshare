import { delay, http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/health", async () => {
    await delay();
    return HttpResponse.json({
      status: "ok",
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get("/api/purchases/:id", async (req) => {
    await delay();
    const { id } = req.params;
    return HttpResponse.json({
      id,
      seller: "First L.",
      buyer: "Seller N.",
      status: "pending",
      price: 100,
      location: "Lipton Hall",
      scheduledDate: "2026-11-05T23:59:00Z",
      sellerPhone: "123-456-7890",
    });
  }),

  // submit review
  http.post("/api/review", async () => {
    await delay();
    return HttpResponse.json({});
  }),

  // buyer mark purchase complete
  http.post("/api/purchase/complete", async () => {
    await delay();
    return HttpResponse.json({});
  }),

  // buyer cancel purchase
  http.post("/api/purchase/cancel", async () => {
    await delay();
    return HttpResponse.json({});
  })
];
